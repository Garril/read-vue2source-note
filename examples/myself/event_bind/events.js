let compiler = require('vue-template-compiler'); // vue-loader使用的一个包
let r1 = compiler.compile('<div @click="fn()"></div>');
let r2 = compiler.compile('<my-component @click.native="fn" @click="fn1"></my-component>');
/*  @click.native="fn"为原生的绑定，@click="fn1"为组件的自定义事件 */
console.log(r1); // {on:{click}}
console.log(r2); // {nativeOn:{click},on:{click}}

/* 为什么组件要加 nativeOn？
最终组件会把nativeOn的属性放到 on里面去（类似div的on，不是自己的on）
而自己的on会单独处理
总结：
  组件中的 nativeOn 等价于 普通元素的 on
  组件的on单独处理（ 绑定个$on('click') ）
源码路径：
src/core/vdom/create-components.js --- line:172

从源码可得：
  vue2不像react有事件代理
  他给一个普通dom元素绑定事件，是直接把事件绑定给元素，用的addEventListener
  对于组件呢?
  vue2用updateComponentListeners，内部调用的updateListeners方法
  依据是on还是nativeOn，传入的参数add不一样，
  如果 是nativeOn，那么add就会使得他的绑定，用的是 addEventListener
  如果 是on，那么add，如下：
  function add(event,fn) {
    target.$on(event,fn);
  }
  自己定义的发布订阅模式，用内部的 $on 方法
  通过 cpnName.$on('click',()=>{...})去绑定事件 
  ---- 所以组件内部可以通过 cpnName.$emit('click')来触发事件
总结：
  绑定事件的原则：1、addEventListener  2、$on

拓展：
  div v-for
    内层div @click="xxx"
  这样很耗性能。怎么解决？
解决：
  div @click
    div v-for
      div
  用这种事件代理的方式去解决，vue2没有事件代理
*/

/* 
！！！重点看 render！！！
r1 如下：
{
  ast: {
    type: 1,
    tag: 'div',
    attrsList: [ [Object] ],
    attrsMap: { '@click': 'fn()' },
    rawAttrsMap: {},
    parent: undefined,
    children: [],
    plain: false,
    hasBindings: true,
    events: { click: [Object] },
    static: false,
    staticRoot: false
  },
  render: `with(this){return _c('div',{on:{"click":function($event){return fn()}}})}`,
  staticRenderFns: [],
  errors: [],
  tips: []
}

r2 如下：
{
  ast: {
    type: 1,
    tag: 'my-component',
    attrsList: [ [Object], [Object] ],
    attrsMap: { '@click.native': 'fn', '@click': 'fn1' },
    rawAttrsMap: {},
    parent: undefined,
    children: [],
    plain: false,
    hasBindings: true,
    nativeEvents: { click: [Object] },
    events: { click: [Object] },
    static: false,
    staticRoot: false
  },
  render: `with(this){return _c('my-component',{on:{"click":fn1},nativeOn:{"click":function($event){return fn.apply(null, arguments)}}})}`,
  staticRenderFns: [],
  errors: [],
  tips: []
}
*/