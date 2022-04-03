/* 
组件的渲染和更新过程

组件是如何渲染出来的？
  h => h(App)
  这个App是组件通过parse变成.vue文件，最后解析成的 对象（！！！App是对象,看图！！！）
  h就createElement方法，他会把这个 对象 渲染成 vNode   ---- 1、这里要知道怎么渲染成 vNode 的
  最后调用update去更新成真实 node 


  1、如果App最后不是解析成对象，而是string，就创建普通dom
    如果是对象，不是string，就认为你是一个组件了
    会去调用createComponent方法

  2、创建组件的时候会干什么？
    会调一个 Vue.extend 方法，他的功能是，你传入一个对象，
    他帮你生成一个，该对象的构造函数Ctor
    现在这个构造函数就是当前App组件的构造函数Ctor -- 之后创建组件就是new 构造函数
    （初始化完后，会给组件加hook---组件内部的钩子函数eg：init、patch、insert、destory）
    拿到构造函数Ctor后，会返回组件 vNode

  3、去调用vm_update()的方法的时候，会根据虚拟节点vNode去创建元素
  （vNode的样子看图片：组件渲染和更新过程.png左下角，对象中可以拿到 Ctor）
  创建元素时，如果看出是组件类型，就会去调用组件的init方法，组件内部就会自己去new Ctor
  因为他new了，所以回去执行vue原有的渲染逻辑（给当前组件加个watcher去渲染）
  
  总结：
  渲染组件时，我们会调用 Vue.extend方法，产生一个构造函数，
  当我们实例化完后（new Ctor），他会自己去调用$mount()进行挂载
  更新组件时，会进行patchVnode流程，核心就是diff算法
*/


// 组件的复用：
/* 
  （简略）每个对象会创建一个父类，组件要复用的话，通过父类，new多个组件
*/

/* 
vue.extend 和 component
组件创建的过程，都要基于vue.extend,
render函数可以帮助我们，渲染当前的组件，通过vnode创建真实的dom
核心： vue.extend -> new -> $mount
*/

