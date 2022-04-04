/* 
问题：
  data为什么是一个函数？
  为了防止data被复用，那为什么防止，怎么防止的？
*/

// =========================================================
// ！！！假如data是一个对象！！！

// 组件会转化为对象，传入vue.extend拿到对应的构造函数
function VueComponent() { } // 假设这就是构造函数，每个实例都是new出来的

VueComponent.prototype.$options = { // 把data放到原型上
  data: { name:"hhh" }
}
let vc1 = new VueComponent();
vc1.$options.data = 'www';
let vc2 = new VueComponent();
console.log(vc2.$options.data); // www
// 第二个组件vc2，拿到的值，是vc1修改过的


// =========================================================
// ！！！假如data是一个函数！！！
function VueComponent() { }

VueComponent.prototype.$options = { 
  data()=>({ name:"hhh" })
}
let vc1 = new VueComponent();
vc1.$options.data();
let vc2 = new VueComponent();
console.log(vc2.$options.data());
// 保证每一个组件调用data，拿到的是全新的对象，避免组件间的相互影响
// 但是他怎么知道你组件内传的data是不是函数，传对象就报错呢？
// 源码： core/global-api/extend.js   ----  mergeOptions（vue的合并，都会涉及到的方法）
// 现在函数转到了 src/core/util/options.js  

/* 为什么 要做合并？
  --- Vue.extend函数的定义中，调用了mergeOptions方法
  把父类和子类自己的options做一个合并（包含data）
  因为：
    vue.extend是通过对象，创建了一个构造函数，但是这个构造函数上
    他并没有父类的东西 --- 他是一个新函数
    和之前 Vue的构造函数 （eg： function Vue(){}）没有关系
    但是 Vue.extend 的一个子函数需要有vue上的东西，
    所以进行了一次合并
*/


/* 拓展：为什么new Vue里面的data就可以是一个对象呢？
new Vue({
  data:{...},...
})
因为这个对象的实例不会被公用，你new Vue就一次。
*/