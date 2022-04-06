/* 
问题： Vue中相同逻辑如何抽离？
  Vue.mixin用法，给组件每个生命周期，函数等都混入一些公共逻辑。
  源码： src/core/global-api/mixin.js  ---- initMixin函数
  要跳去看mergeOptions函数

他尴尬的点：就在mixin中的数据，你如果可能是写死了。如果要获取后拿，
你的mixin对象就需要通过一个函数去return，这个函数接受 数据，作为参数
*/
