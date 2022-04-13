// Test组件
<template id ='test'>
  <div class="container">

      <header>
        <slot name = "header"></slot>
      </header>

      <section>
        主体内容部分
      </section>

      <footer>
        <slot name = 'footer'></slot>
      </footer>

  </div>
</template>

// 使用
<div id="app">
  <Test>
    <template v-slot:header>
      <h2>slot头部内容</h2>
    </template>
    
    <p>直接插入组件的内容</p>
    
    <template v-slot:footer>
      <h2>slot尾部内容</h2>
    </template>
  </Test>
</div>  

<script>
  Vue.component('Test',{
    template:"#test",
  });
  new Vue({
    el:"#app"
  })
</script>
