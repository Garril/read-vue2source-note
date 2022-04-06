/* 创建：
  父beforeCreate
  父created
  父beforeMount
  子beforeCreate
  子created
  子beforeMount
  子mounted（子可能还有子，他不会直接去调mounted，会把钩子暂存一下）
  父mounted
  
  子组件初始化完成了，就会把子组件先放到一个队列里，存起来，之后一起执行
  在core/vdom/patch.js---createComponent函数


  销毁：
  父beforeDestory
  子beforeDestory
  子destoryed
  父destoryed


*/
function patch(oldVnode, vnode, hydrating, removeOnly) {
  if (isUndef(vnode)) {
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
    return
  }
  let isInitialPatch = false
  const insertedVnodeQueue = [] // 定义收集所有组件的insert hook方法的数组
  // somthing ...
  createElm(
    vnode,
    insertedVnodeQueue,
    oldElm._leaveCb ? null : parentElm,
    nodeOps.nextSibling(oldElm)
  )
  // somthing...
  // 最终会依次调用收集的insert hook
  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
  return vnode.elm
}

function createElm(
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  // createChildren会递归创建儿子组件
  createChildren(vnode, children, insertedVnodeQueue)
  // something...
}
// 将组件的vnode插入到数组中
function invokeCreateHooks(vnode, insertedVnodeQueue) {
  for (let i = 0; i < cbs.create.length; ++i) {
    cbs.create[i](emptyNode, vnode)
  }
  i = vnode.data.hook // Reuse variable
  if (isDef(i)) {
    if (isDef(i.create)) i.create(emptyNode, vnode)
    if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
  }
}
// insert方法中会依次调用mounted方法
insert(vnode: MountedComponentVNode) {
  const {
    context,
    componentInstance
  } = vnode
  if (!componentInstance._isMounted) {
    componentInstance._isMounted = true
    callHook(componentInstance, 'mounted')
  }
}

function invokeInsertHook(vnode, queue, initial) {
  // delay insert hooks for component root nodes, invoke them after the
  // element is really inserted
  if (isTrue(initial) && isDef(vnode.parent)) {
    vnode.parent.data.pendingInsert = queue
  } else {
    for (let i = 0; i < queue.length; ++i) {
      queue[i].data.hook.insert(queue[i]); // 调用insert方法
    }
  }
}
Vue.prototype.$destroy = function () {
  callHook(vm, 'beforeDestroy') //
  // invoke destroy hooks on current rendered tree
  vm.__patch__(vm._vnode, null) // 先销毁儿子
  // fire destroyed hook
  callHook(vm, 'destroyed')
}