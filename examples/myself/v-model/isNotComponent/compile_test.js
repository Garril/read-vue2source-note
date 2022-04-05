const VueTemplateCompiler = require('vue-template-compiler')
const ele = VueTemplateCompiler.compile(`<input v-model="value"/>`);
console.log(ele);
/* 是一个普通标签input的情况： input+v-model。没有设置为checkbox
  需关注部分：
  render: `with(this) {
    return _c('input',{
      directives:[{
        name:"model",
        rawName:"v-model",
        value:(value),
        expression:"value"
      }],
      domProps:{
        "value":(value)
      },
      on:{
        "input":function($event) {
          if($event.target.composing) return;
          value = $event.target.value
        }
      }
    })
  }`,
  从 domProps和on上看，貌似和组件上的v-model差不多，就都是value+input的语法糖
  区别在：原生的v-model，除了value+input，他还解析出了指令directives
  
  指令的源码： src/platforms/web/compiler/directives/model.js

  指令运行(生成完ast后，codegen要去生成代码的时候)：src/platforms/web/runtime/directives/model.js
    （这个runtime的model是对我们运行时的指令做处理的，当我们的代码要生成的时候，会去绑定些事件
      v-model看model文件，v-html看html文件等等）
    原生的v-model，在编译完后，会多出事件compositionstart和compositionend等
    去解决输入框的一些问题

  主要判断：
    if (el.component) {
      genComponentModel(el, value, modifiers)
      // component v-model doesn't need extra runtime
      return false
    } else if (tag === 'select') {
      genSelect(el, value, modifiers)
    } else if (tag === 'input' && type === 'checkbox') {
      genCheckboxModel(el, value, modifiers)
    } else if (tag === 'input' && type === 'radio') {
      genRadioModel(el, value, modifiers)
    } else if (tag === 'input' || tag === 'textarea') {
      genDefaultModel(el, value, modifiers)
    } else if (!config.isReservedTag(tag)) {
      genComponentModel(el, value, modifiers)
      // component v-model doesn't need extra runtime
      return false
    } else.............
*/


/* ele结果如下：
{
  ast: {
    type: 1,
    tag: 'input',
    attrsList: [ [Object] ],
    attrsMap: { 'v-model': 'value' },
    rawAttrsMap: {},
    parent: undefined,
    children: [],
    plain: false,
    hasBindings: true,
    directives: [ [Object] ],
    static: false,
    staticRoot: false,
    props: [ [Object] ],
    events: { input: [Object] }
  },
  render: `with(this){return _c('input',{directives:[{name:"model",rawName:"v-model",value:(value),expression:"value"}],domProps:{"value":(value)},on:{"input":function($event){if($event.target.composing)return;value=$event.target.value}}})}`,
  staticRenderFns: [],
  errors: [],
  tips: []
}
*/