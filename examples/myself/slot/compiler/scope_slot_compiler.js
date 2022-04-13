/* 作用域插槽 */
// 定义插槽
let ele = VueTemplateCompiler.compile(`
    <app>
      <div slot-scope="msg" slot="footer"> {{msg.a}} </div> 
    </app>
`);
// slot-scope已经被废弃，推荐使用 vue2.6.0中的v-slot

with(this) {
  return _c('app', { // 第二参数变成了一个对象
    scopedSlots: _u([{ // 作用域插槽的内容会被渲染成一个函数fn
      key: "footer",
      fn: function (msg) { // 函数不调用，就不会去渲染那个孩子节点
        return _c('div', {}, [_v(_s(msg.a))])
      }
    }])
  })
}

// 使用插槽
const VueTemplateCompiler = require('vue-template-compiler');
VueTemplateCompiler.compile(`
    <div>
      <slot name="footer" a="1" b="2"></slot>
    </div>
`);

with(this) {
  return _c('div', [_t("footer", null, {
    // 找到footer之后，去调用fn，并且把下面的a，b传到函数fn
    // 渲染完成之后，再替换
    // 所以：当前的作用域插槽，渲染的位置，是在组件的内部
    // （之前 普通插槽 把_t(xxx)只是做了替换，用的_v("node")
    // 是当前组件的父组件渲染好了的,这里可以理解为，自己执行函数，自己要去渲染）
    "a": "1",
    "b": "2"
  })], 2)
}
