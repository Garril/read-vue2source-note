/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
// arrayMethods作为新的原型对象

// 拦截的7个，会改变原来数组的方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
// 遍历7方法，重写
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method] // 拿到 Array的原方法
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args) // 调用原Array方法
    const ob = this.__ob__
    let inserted
    // 对3个：可能让数组 新增元素 的方法进行处理
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify() // 通知视图更新
    return result
  })
})
