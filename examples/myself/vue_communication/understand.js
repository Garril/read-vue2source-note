/* 
Vue组件通信 ---- （特点：单向数据流）

  1、父子间通信 父->子通过 props 、子->父 $on、$emit (发布订阅)
    src/core/instance/index.js --- 看eventsMixin的$on和$emit

  2、获取父子组件实例的方式 $parent、$children 
    src/core/instance/lifecycle.js --- initLifecycyle函数，会初始化 $parent 和 $children

  3、在父组件中提供数据子组件进行消费 Provide、inject ---- 开发用的少，写插件必备
    src/core/instance/init.js

  4、Ref 获取实例的方式调用组件的属性或者方法
    src/core/vdom/modules/ref.js --- registerRef函数

  5、Event Bus 实现跨组件通信 Vue.prototype.$bus = new Vue
    （基于$on和$emit ---因为每个实例都有$on和$emit，我可以专门找个公共的实例来进行通信 ）
    （--- 绑定事件和触发事件必须在同一个实例上，所以专门做了个实例在进行通信）
    Vue.prototype.$bus = new Vue(每个实例都可以拿到$bus属性，因为new出来的Vue实例，有$on和$emit属性)

  6、Vuex 状态管理实现通信 $attrs $listeners
    （最靠谱：把数据存容器里，所有组件一起共享）
*/