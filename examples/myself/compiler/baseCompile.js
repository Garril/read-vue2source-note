function baseCompile(
  template: string,
  options: CompilerOptions
) {
  const ast = parse(template.trim(), options) // 1.将模板转化成ast语法树
  if (options.optimize !== false) {
    // 2.优化树
    optimize(ast, options)
  }
  const code = generate(ast, options) // 3.生成树
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
}


const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名 （拿到的整体eg：<div ）
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 '>'
let root;
let currentParent;
let stack = []



function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    type: 1,
    children: [],
    attrs,
    parent: nul
  }
}



function start(tagName, attrs) {
  let element = createASTElement(tagName, attrs);
  if (!root) {
    root = element;
  }
  currentParent = element;
  stack.push(element);
}



function chars(text) {
  currentParent.children.push({
    type: 3,
    text
  })
}



function end(tagName) {
  const element = stack[stack.length - 1];
  stack.length--;
  currentParent = stack[stack.length - 1];
  if (currentParent) {
    element.parent = currentParent;
    currentParent.children.push(element)
  }
}



function parseHTML(html) { // <div id="container"><p>hello<span>zf</span></p></div>
  while (html) {
    let textEnd = html.indexOf('<'); //  < 开头，textEnd 为 0
    // 是 '<' 开头
    if (textEnd == 0) {
      const startTagMatch = parseStartTag(); // <p>hello<span>zf</span></p></div>
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs); // div 和 属性id="container"
        continue;
      }
      // </p>闭合标签的处理
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1])
      }
    }
    let text;
    // 不是 '<' 开头，比如到了 hello<span>zf</span></p></div>
    if (textEnd >= 0) {
      text = html.substring(0, textEnd) // 删掉并且拿到字符串，剩下 <span>zf</span></p></div>
    }
    if (text) {
      advance(text.length);
      chars(text); // hello存到chars中
    }
  }


  function advance(n) {
    html = html.substring(n);
  }


  // html: <div id="container"><p>hello<span>zf</span></p></div>
  function parseStartTag() {
    const start = html.match(startTagOpen); // 拿到 <div
    if (start) {
      const match = {
        tagName: start[1], // 拿到 'div'，保存到tagName
        attrs: []
      }
      advance(start[0].length); // 截掉头部，剩下： id="container"><p>hello<span>zf</span></p></div>
      let attr, end
      while (!(end = html.match(startTagClose)) && // 匹配 '>'或 '/>'
        (attr = html.match(attribute))) { // 匹配属性。&&确认有属性，而不是直接关闭div标签
        advance(attr[0].length); // 裁剪掉属性长度，剩下： ><p>hello<span>zf</span></p></div>
        match.attrs.push({ // 把属性添加到 attrs属性数组
          name: attr[1],
          value: attr[3]
        })
      }
      // 去掉'>', 剩下：<p>hello<span>zf</span></p></div>
      if (end) {
        advance(end[0].length);
        return match // 返回刚刚收集的 标签名和属性 的对象
      }
    }
  }
}


// 生成语法树
parseHTML(`<div id="container"><p>hello<span>zf</span></p></div>`);

// 最后阶段： 把ast树变成render方法（遍历对象生成字符串）
function gen(node) {
  if (node.type == 1) {
    return generate(node);
  } else {
    return `_v(${JSON.stringify(node.text)})`
  }
}

function genChildren(el) {
  const children = el.children;
  if (el.children) {
    return `[${children.map(c=>gen(c)).join(',')}]`
  } else {
    return false;
  }
}

function genProps(attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    str += `${attr.name}:${attr.value},`;
  }
  return `{attrs:{${str.slice(0,-1)}}}`
}

function generate(el) {
  let children = genChildren(el);
  let code = `_c('${el.tag}'${
    el.attrs.length? `,${genProps(el.attrs)}`:''
  }${
    children? `,${children}`:''
  })`;
  return code;
}
// 根据语法树生成新的代码 --- root就是我们生成的语法树的根节点，是createASTElement函数return的对象
let code = generate(root); // code:string
let render = `with(this){return ${code}}`; // render: string

// 包装成函数
let renderFn = new Function(render); // 模板引擎的实现
console.log(renderFn.toString());
/**
 * 
 * function anonymous() { -- 这个就是render函数(我们写的是template模板，最后会变成这样一个函数)
 *    with(this) {
 *      return _c('div',{attrs:{id:container}},[_c('p',[_v("hello"),_c('span',[_v("zf")])])])   
 *      以前html标签，现在变成了js语法,_c是工具方法，用于生成虚拟节点
 *    }
 * }
 * 
 * 
 * 3、为什么用with？
 * 
 * with虽然不安全，但是他帮我们解决作用域的问题
 * 比如上面return的字符串中，如果有用到data数据，不可能通过vm.xxx去引用吧
 * 只要通过with，让其身处vm作用域内，就可以直接用属性了，而不用前面加个vm.
 *   eg: with(obj) {
 *        console.log(a);  // 等价于外边的obj.a
 *       }
 * 
 * 
 * 4、v-if 如何通过true和false来控制是否渲染？
 * 
 * 实际是在上面render函数的基础上，对return做了一个修饰
 * 
 * 例子如下：
 * 安装 vue-template-compiler
 * const VueTemplateCompiler = require('vue-template-compiler');
 * let r1 = VueTemplateCompiler.compiler(`<div v-if="true"><span v-for="i in 3">hello</span></div>`);
 * with(this) {
 *    return (true)? _c('div',_l(3), function(i) {
 *        return _c('span', [_v("hello")])
 *    },0) : e()
 * }
 * 
 * 5、v-show 呢？
 * 
 * 例子如下：
 * let r2 = VueTemplateCompiler.compiler(`<div v-show="true"></div>`);
 * with(this) {
 *    return _c('div',{
 *        directives: [{
 *            name: "show",
 *            rawName: "v-show",
 *            value: (true),
 *            expression: "true"
 *        }]
 *    })
 * }
 * directives说明用了一个指令，名字，rawName，就是v-show
 * 在运行阶段，会去运行这个指令，到 src/platforms/web/runtime/directives/show.js
 * 
 * 
 * 
 * 6、为什么v-for和v-if不能连着用？
 * 
 * （v-for优先级大于v-if）
 * 例子如下：
 * const VueTemplateCompiler = require('vue-template-compiler');
 * let r1 = VueTemplateCompiler.compile(`<div v-if="false" v-for="i in 3">hello</div>`);
 * with(this) {
 *    return _l((3), function (i) {
 *        return (false) ? _c('div', [_v("hello")]) : _e()
 *    })
 * }
 * console.log(r1.render);
 * 
 * 上面div中，v-if和v-show都用了，但是render函数中的内容，可以看出
 * 他是先循环v-for，再在每一个div加上判断v-if
 * 元素一多，每个元素都要判断，就很耗性能。--- 一般外层套个templat v-if
 * 不让放外层，还想让v-for和v-if连用，怎么处理？ --- 计算属性
 * computed: {
 *    arr() {
 *      return xxx.filter(...)
 *    }
 * }
 * 
 */

/**
 * 
 * 1、为什么vue2的 template下面只能有一个节点？
 * 
 * diff算法---是树的比对，把树的根节点root传入
 * 
 * 
 * 2、vdom和ast
 * 
 * vdom：描述真实节点
 * ast：描述html/js语法
 * ast树不是vdom，他不能表现出dom来，虽然展示都是对象，
 * 但是他只能表现出html语法来，算是 vNode+data
 * 
 */