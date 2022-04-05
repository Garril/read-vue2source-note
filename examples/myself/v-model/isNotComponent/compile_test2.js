const VueTemplateCompiler = require('vue-template-compiler')
const ele = VueTemplateCompiler.compile(`<input type="checkbox" v-model="value"/>`);
// console.log(ele);
console.log(ele.render)
/* 是一个普通标签input的情况： input+v-model。且设置了checkbox

  需关注部分：看domProps和on的改变

  render: with(this){
    return _c('input',{
      directives:[{
        name:"model",
        rawName:"v-model",
        value:(value),
        expression:"value"
      }],
      attrs:{
        "type":"checkbox"
      },
      domProps:{  ------------------------- 是checked，而不是value
        "checked": Array.isArray(value) ? _i(value,null)>-1 : (value)
      },
      on:{  ------------------------- 是change，而不是input事件
        "change":function($event) {
          var $$a = value,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
          if(Array.isArray($$a)) {
            var $$v = null,
            $$i = _i($$a,$$v);
            if($$el.checked) { 
              $$i<0 && (value = $$a.concat([$$v]))
            } else {
              $$i > -1 && (value = $$a.slice(0,$$i).concat($$a.slice($$i+1)))
            }
          } else {
              value=$$c
          }
        }}})
    },

*/


/* ele结果如下：
{
  ast: {
    type: 1,
    tag: 'input',
    attrsList: [ [Object], [Object] ],
    attrsMap: { type: 'checkbox', 'v-model': 'value' },
    rawAttrsMap: {},
    parent: undefined,
    children: [],
    plain: false,
    attrs: [ [Object] ],
    hasBindings: true,
    directives: [ [Object] ],
    static: false,
    staticRoot: false,
    props: [ [Object] ],
    events: { change: [Object] }
  },
  render: `with(this){return _c('input',{directives:[{name:"model",rawName:"v-model",value:(value),expression:"value"}],attrs:{"type":"checkbox"},domProps:{"checked":Array.isArray(value)?_i(value,null)>-1:(value)},on:{"change":function($event){var $$a=value,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_i($$a,$$v);if($$el.checked){$$i<0&&(value=$$a.concat([$$v]))}else{$$i>-1&&(value=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{value=$$c}}}})}`,
  staticRenderFns: [],
  errors: [],
  tips: []
}
*/