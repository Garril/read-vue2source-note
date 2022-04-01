var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3
  },
  watch: {
    //第一种写法 适用于普通变量（简单类型的值的观测写法）
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // 第二种写法：方法名
    b: 'someMethod',
    // 第三种写法：深度 watcher(能观测对象c下多重属性变化)（复杂类型的值的观测写法）
    c: {
      //当c变化后会回调handler函数
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    }
  }
})
vm.a = 2 // -> new: 2, old: 1