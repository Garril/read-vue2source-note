const VueTemplateCompiler = require('vue-template-compiler');
// 定义插槽
let ele = VueTemplateCompiler.compile(`
    <my-component>
      <div slot="header">node</div>
      <div>react</div>
      <div slot="footer">vue</div>
    </my-component>
`)
// console.log(ele.render)
/*  ele.render如下：
*/
with(this) {
  return _c('my-component',// 第二参数--数组--3个儿子
    [
      _c('div', 
      {
        attrs: {
          "slot": "header"
        },
        slot: "header"
      }, [_v("node")] // _文本节点 --- _v("node")---把div内部的内容node存起来了
      // src/core/instance/render-helpers/index.js

    ), _v(" "), 

    _c('div', [_v("react")]), 

    _v(" "),
      
      _c('div', {
      attrs: {
        "slot": "footer"
      },
      slot: "footer"
    }, [_v("vue")] )
    ]
  )
} 

// 使用插槽
let ele2 = VueTemplateCompiler.compile(`
    <div>
      <slot name="header"></slot>
      <slot name="footer"></slot>
      <slot></slot>
    </div>
`);

with(this) {
  return _c('div', 
    [
      _t("header"), // _t: renderSlot 
      // --- 会找到header对应的虚拟节点：就上面保存的 _v("node"),然后换过来

      _v(" "), 
      
      _t("footer"),
      
      _v(" "), 
      
      _t("default")
    ], 2)
}
// _t定义在 core/instance/render-helpers/index.js
// 普通插槽，就只是一个替换的过程，将父组件渲染好的东西，直接替换自己身上
// 替换之后，如下：
with(this) {
  return _c('div', 
    [
      _v("node"),

      _v(" "), 
      
      _v("vue"),
      
      _v(" "), 
      
      _v("react")
    ], 2)
}