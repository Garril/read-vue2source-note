/*
v-html可能导致的问题
  1、xss攻击
  2、v-html会替换掉标签内部的元素（用了v-html的标签内部写的innerHtml都无效）
例子如下：
  input type="text" v-model="msg"
  div v-html="msg"
因为用户输入什么都不可信，那会出问题
如果：<img src="" onerror="alert(1)">
你会发现alert执行了，那如果是去获取用户的cookie呢？
会造成安全性问题

核心代码如下：（platforms/web/runtime/modules/dom-props.js）
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