// =================  使用例子一 ================================
/* 
混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。
一个混入对象可以包含任意组件选项。当组件使用混入对象时，
所有混入对象的选项将被“混合”进入该组件本身的选项。
*/
// 定义一个混入对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"


// =================  使用例子二 ================================
/* 
当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。
比如，数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。

值为对象的选项，例如 methods、components 和 directives，
将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。
*/

var mixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

new Vue({
  mixins: [mixin],
  data: function () {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)
    // => { message: "goodbye", foo: "abc", bar: "def" }
  }
})

// =================  使用例子三 ================================
/* 
同名钩子函数将合并为一个数组，因此都将被调用。
另外，混入对象的钩子将在组件自身钩子之前调用。
*/
var mixin = {
  created: function () {
    console.log('混入对象的钩子被调用')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('组件钩子被调用')
  }
})

// => "混入对象的钩子被调用"
// => "组件钩子被调用"


// ================  使用例子四： ============================
//  全局混入
// 为自定义的选项 'myOption' 注入一个处理器。
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// => "hello!"
