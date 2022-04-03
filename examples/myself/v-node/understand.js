<div id="container"><p></p></div>

let obj = { // 大概如此：描述dom的对象，描述上面html的结构 ---- vdom
  tag: 'div',
  data: {
    id:"container"
  },
  children: [
    {
      tag: 'p',
      data: {},
      children: []
    }
  ]
}

render() {  // 通过 render去产生上面的obj对象
  //  -- js语法转换为对象，而不是直接把字符串集成为一个树
  return _c('div',{id: container},_c('p',{}))
}

/**
 * 从 template 到 v-dom。
 * 流程： template模板转为AST语法树，(AST通过codegen，代码生成，生成我们的render函数)，render函数里面放的是
 *  _c('div',{id: container},_c('p',{})) 类似的这种方法 --- 书签 installRenderHelpers
 * 内部调用了这样的方法，拿到了v-dom（简易版看example.js）
 * 
 * 为什么不直接把template直接转化为v-dom？
 * --- template为字符串，做不到直接把字符串转换为vdom（一个对象）
 * 所以有了中间的生成ast树，生成代码，转换为对象，这样的流程
 * 
 * 数据变化是v-dom的变化，v-dom一变，就触发watcher，进行重新渲染
 * 这时候会进行一个diff
 */