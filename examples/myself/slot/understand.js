<template>
  <app>
    <div slot="a">xxxx</div>
    <div slot="b">xxxx</div>
  </app>
</template>
/* 
  普通插槽：
  创建组件虚拟节点时，会将组件的儿子的虚拟节点保存起来。
  当初始化组件时,通过插槽属性将儿子进行分类 {a:[vnode],b:[vnode]}
  渲染组件时会拿对应的slot属性的节点进行替换操作。！！！！（插槽的作用域为父组件）！！！！
*/

/* 
  会把里面两个slot的div渲染成虚拟节点，存起来（这个过程，在执行app组件外层渲染的时候，就已经渲染好了，
  并不是在app组件里面渲染的，是在外面渲染的）
  div渲染好后，然后会进行分类，{a:[vnode],b:[vnode]}
  后续我们写的 slot name="a"  或者 slot name="b，就会用刚才渲染好的vnode进行替换

  也就是说：
    普通插槽渲染的位置：在app的父组件里面，而不是在app组件里面

  普通插槽对比作用域插槽：
    作用域插槽在解析的时候，不会作为组件的孩子节点。
    会解析成函数，当子组件渲染时，会调用此函数进行渲染。！！！！（插槽的作用域为子组件）！！！！
  区别：
    作用域插槽唯一的区别：他渲染流程是在app组件里面
    （两者差别，就是作用域的问题）
*/