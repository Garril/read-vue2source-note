/* @flow */

import { isRegExp, remove } from 'shared/util'
import { getFirstComponentChild } from 'core/vdom/helpers/index'

type CacheEntry = {
  name: ?string;
  tag: ?string;
  componentInstance: Component;
};

type CacheEntryMap = { [key: string]: ?CacheEntry };

function getComponentName (opts: ?VNodeComponentOptions): ?string {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance: any, filter: Function) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const entry: ?CacheEntry = cache[key]
    if (entry) {
      const name: ?string = entry.name
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

function pruneCacheEntry (
  cache: CacheEntryMap,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const entry: ?CacheEntry = cache[key]
  if (entry && (!current || entry.tag !== current.tag)) {
    entry.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

const patternTypes: Array<Function> = [String, RegExp, Array]

export default {
  name: 'keep-alive',
  abstract: true, // 抽象组件

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  methods: {
    cacheVNode() {
      const { cache, keys, vnodeToCache, keyToCache } = this
      if (vnodeToCache) {
        const { tag, componentInstance, componentOptions } = vnodeToCache
        cache[keyToCache] = {
          name: getComponentName(componentOptions),
          tag,
          componentInstance,
        }
        keys.push(keyToCache)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
        this.vnodeToCache = null
      }
    }
  },

  created () {
    this.cache = Object.create(null) //创建缓存列表
    this.keys = [] // 创建缓存组件的key列表
  },

  destroyed () { // keep-alive销毁时，会清空所有的缓存和key
    for (const key in this.cache) { // 循环销毁
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () { // 会监控include和exclude属性是否改变，动态的进行组件的缓存处理（添加/删除）
    this.cacheVNode()
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  updated () {
    this.cacheVNode()
  },

  render () {
    const slot = this.$slots.default // 会默认拿当前组件的插槽 
    const vnode: VNode = getFirstComponentChild(slot) // 拿到的是第一个组件（假设keep-alive里放有多个组件）
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions) // 取出组件的名字
      const { include, exclude } = this
      if ( // 判断是否缓存
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) { // 不在缓存里
        return vnode // 直接就return了
      }
      
      // 有缓存，才会到下面去运行：

      const { cache, keys } = this
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key // 如果组件没key，就自己通过 组件的标签和key和cid 拼接一个key

      if (cache[key]) { // 缓存过

        vnode.componentInstance = cache[key].componentInstance // 直接拿到组件实例
        // make current key freshest
        remove(keys, key) // 删除队首，也就是当前的 --- 要添加到尾部

        /* ---- LRU 最近最久未使用法---最近用过的放到数组尾部,超出限制了，删除就删头部
        
          keep-alive中的组件，我按钮点击，去render页面，顺序为：[a,b,c]。
          比如我现在从c切回了a，我会把数组变成：[b,c,a] --- a在数组中，所以，放到后面
        */
        keys.push(key) // 并且将key放到后面

      } else { // 没有缓存过
        // delay setting the cache until update
        this.vnodeToCache = vnode
        this.keyToCache = key
        /* 
          等同于把： 
            cache[key] = vnode //缓存vnode
            keys.push(key) // 将key 存入
            if(this.max && keys.length > parseInt(this.max)) { // 缓存的太多，超过了max要删除部分
              pruneCacheEntry(cache,keys[0],keys,this._vnode); // 删除第0个，也就是现在渲染的
            }
          延迟了，直到update
        */
      }

      vnode.data.keepAlive = true // 并且标准 keep-alive下的组件是一个缓存组件
    }
    return vnode || (slot && slot[0]) // 返回当前的虚拟节点
  }
}
