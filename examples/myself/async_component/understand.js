/* 
为什么使用异步组件？
    如果组件功能多，打包出的结果会变大，我可以采用异步的方式来加载组件。
    主要依赖 import() 这个语法，可以实现文件的分割加载，而且采用jsonp的方式进行加载
    （分开打包）可以有效解决一个文件过大的问题
异步组件的核心是什么？
    可以把组件的定义变成函数，函数中可以用import语法：
    import('../components/xxx组件')    ----这个语法webpack提供的（原理就是jsonp）
    返回一个promise，所以：
    components: {
      组件名: (resolve) => import("../components/组件文件")
    }

*/