/* @flow */

import {
  warn,
  remove,
  isObject,
  parsePath,
  _Set as Set,
  handleError,
  invokeWithErrorHandling,
  noop
} from '../util/index'

import { traverse } from './traverse'
import { queueWatcher } from './scheduler'
import Dep, { pushTarget, popTarget } from './dep'

import type { SimpleSet } from '../util/index'
import { json } from 'stream/consumers'

let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) { // 有options，没设定为true的属性，就默认是false
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else { // 没有options，默认也是false
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching：批处理 -- new的时候自动++，保证唯一
    this.active = true
    this.dirty = this.lazy // for lazy watchers --- lazy为true，dirty就为true

    // dep相关属性的初始化
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()


    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    /**
     * computed--用户定义方法通过new Watcher传入，就是变成这里的 “expOrFn”
     */
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn // expOrFn是函数，存到getter里
    } else { // expOrFn是字符串，帮你包装成函数
      /* 比如vm.$watch('message',() => {...})，expOrFn是字符串message，包装成
        function() { return vm.message }，还是做取值这件事
      */
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    // 计算属性 --- 传入的lazy为true，就代表：默认什么都不做
    this.value = this.lazy // 默认 watcher不会执行计算属性中的函数（只有在页面上取值的时候执行）
      ? undefined
      : this.get() // 自己写的watch就是false，调用get -- 就会调用getter，就是执行用户自己定义的方法
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get () {
    pushTarget(this) // 将 watcher 放到全局上 --- Dep.target = watcher 当我取值的时候，
    //  会进行依赖收集，把当前计算属性的watcher收集起来 ---> 数据一变，就会重新执行（调update）
    let value
    const vm = this.vm
    try {
      /* 像watch，对象内对象的监视--deep:true其实就是判断：
      如果是对象，把对象再循环一遍，循环取值的过程，也会把watch存起来
      为什么computed没有deep：true？ 他内部是用在模板里的，比如：{{xxx}}，
      在模板中数据会调用JSON.stringify({对象})
      会默认对对象中的所有属性都进行求值（但是watch单独监控对象，是不行的，因为是监控的最外层对象） */
      value = this.getter.call(vm, vm) // 取值 会进行依赖收集
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**
   * Add a dependency to this directive.
   */
  addDep (dep: Dep) {
    // 拿到 新的 dep
    const id = dep.id
    // 记录 新的 id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this) // 把当前的这个watcher，push到dep.subs数组内
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) { // 计算属性在这写-- lazy为ture，lazy：计算属性用的一个标识
      
      // computed计算属性是同步更新的，在渲染执行之前，这也确保在渲染的时候可以拿到最新的值
      this.dirty = true // 改变dirty -- 页面再去取值的时候（ 执行watcher.evaluate() ）
      // 看 computedGetter
      // watcher.dirty 为 true，会再次求值，不改变说明没有执行 update数据没有变
      // watcher.dirty 为 false。不会重新求值（相当于缓存了）

    } else if (this.sync) { // 同步watcher
      this.run()
    } else { // 普通watcher是这里更新，运行这里
      queueWatcher(this) // 把watcher push进入队列
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run () {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {
          const info = `callback for watcher "${this.expression}"`
          invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info)
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   */
  teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}
