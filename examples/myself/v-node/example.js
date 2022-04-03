function _c(tag,data,...children) {
  let key = data.key;
  delete data.key;
  children = children.map(child => {
    if(typeof child === 'object') { // 如果是对象
      return child // 直接返回
    } else { // 不是对象，包装成对象
      return vnode(undefined,undefined,undefined,undefined,child)
    }
  })
  return vnode(tag,data,key,children);
}

function vnode(tag,data,key,children,text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}
let r = _c('div',{id:'container'},_c('p',{},'hello'),'zf');
console.log(r)
/* 结果如下： v-dom
  {
    tag: 'div',
    data: { id: 'container' },
    key: undefined,
    children: [
      {
        tag: 'p',
        data: {},
        key: undefined,
        children: [Array],
        text: undefined
      },
      {
        tag: undefined,
        data: undefined,
        key: undefined,
        children: undefined,
        text: 'zf'
      }
    ],
    text: undefined
  }
*/