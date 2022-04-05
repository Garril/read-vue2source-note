/* 
简单理解：
  v-model是 value+input的语法糖
eg：
  <div :value="" @input=""></div>
  <div v-model=""></div>
但具体，要分情况：input + v-model、checkbox + v-model、select + v-model
而组件的v-model，就是value+input的语法糖
看其他js文件

补充：
  例子，
  input v-model="yyy" @change="xxx"
  span {{yyy}}
  当v-model添加了.lazy修饰符后，
  双向绑定的数据就不同步了，
  相当于在input输入框失去焦点后触发的change事件中同步

  看源码：src/platform/web/compiler/directives/model.js
  默认是input事件，加了.lazy变为change事件
*/