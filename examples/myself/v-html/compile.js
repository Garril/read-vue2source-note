let template = require('vue-template-compiler');
let r = template.compile(`<div v-html="'<span>hello</span>'"></div>`)
console.log(r.render)
/* 
  with(this) {
    return _c('div',{
      domProps: {
        "innerHTML":_s('<span>hello</span>')
      }
    })
  }

_c 定义在core/instance/render.js
_s 定义在core/instance/render-helpers/index,js
*/

if (key === 'textContent' || key === 'innerHTML') {
  if (vnode.children) vnode.children.length = 0
  if (cur === oldProps[key]) continue
  // #6601 work around Chrome version <= 55 bug where single textNode
  // replaced by innerHTML/textContent retains its parentNode property
  if (elm.childNodes.length === 1) {
  elm.removeChild(elm.childNodes[0])
  }
}