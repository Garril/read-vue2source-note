/* 
为什么使用异步组件？
    如果组件功能多，打包出的结果会变大，我可以采用异步的方式来加载组件。
    主要依赖 import() 这个语法，可以实现文件的分割加载，而且采用jsonp的方式进行加载
    （分开打包）可以有效解决一个文件过大的问题
异步组件的核心是什么？ ---- 异步组件他一定是一个函数!!!
    把组件的定义变成函数，函数中可以用import语法：
    import('../components/xxx组件')    ----这个语法webpack提供的（原理就是jsonp）
    返回一个promise，所以：
    components: {
      组件名: (resolve) => import("../components/组件文件")
    }
*/
// 异步组件
// 1.
Vue.component('async-example', function(resolve,reject) {
  setTimeout(function() {
    // 向 resolve 回调传递组件定义
    resolve({
      template: `<div>I am async!</div>`
    })
  },1000)
})
// 2.
Vue.component('async-webpack-example', function(resolve) {
  /* 
    这个特殊的 require语法会告诉webpack
    自动将你的构建代码切割为多个包，这些包会通过ajax请求加载
  */
  require(['./my-async-component'],resolve)
})
// 3.局部注册的时候，可以直接提供一个返回 Promise的函数：
new Vue({
  components: {
    'my-component': () => import('./my-async-component')
  }
})
// 4.
const AsyncComponent = () => ({
  // 需要加载的组件应该是一个Promise对象
  component: import('./MyComponent.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  delay: 200, // 展示加载组件时的延时时间ms
  timeout: 3000
})