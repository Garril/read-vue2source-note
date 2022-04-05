const VueTemplateCompiler = require('vue-template-compiler')
const ele = VueTemplateCompiler.compile(`<el-checkbox v-model="check"></el-checkbox>`);
console.log(ele);
/* 第一种情况：model中没有 prop和event
需关注部分：
  render: `with(this) {
    return _c('el-checkbox', {
      model: {
        value:(check),
        callback:function ($$v) {
          check=$$v
        },
        expression:"check"
      }
    })
  }`,
  v-model解析完后，给当前的vdom的属性里加了model

  跳到src/core/vdom/create-components.js文件 line 158开始

  第二种情况：看 complie_test2.js
*/


/* ele结果如下：
{
  ast: {
    type: 1,
    tag: 'el-checkbox',
    attrsList: [ [Object] ],
    attrsMap: { 'v-model': 'check' },
    rawAttrsMap: {},
    parent: undefined,
    children: [],
    plain: false,
    hasBindings: true,
    directives: [ [Object] ],
    static: false,
    staticRoot: false,
    model: {
      value: '(check)',
      expression: '"check"',
      callback: 'function ($$v) {check=$$v}'
    }
  },
  render: `with(this){return _c('el-checkbox',{model:{value:(check),callback:function ($$v) {check=$$v},expression:"check"}})}`,
  staticRenderFns: [],
  errors: [],
  tips: []
}
*/