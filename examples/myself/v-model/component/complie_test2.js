/* 第二种情况：传了model
  这也是一道题： 我们怎么去自定义 v-model？（自定义v-model是什么事件、什么属性）
*/
// <el-checkbox :value="" @input=""></el-checkbox>
<el-checkbox v-model="check"></el-checkbox>

Vue.component('el-checkbox',{
  template:`<input type="checkbox" 
                  :checked="check" 
                  @change="$emit('change',$event.target.checked)">`,
  model: {
    prop: 'check', // 更改默认的value的名字
    event: 'change' // 更改默认的方法名字
    /* 
      那么上面就相当于给 data.attrs.check 赋值 data.model.value
      ( 下面写了个props去接受check属性)
      给 on[change] = callback --- 这里的change是$emit('change',...)的change
    */
  },
  props: {
    check: Boolean
  }
})

/* 
补充：
  为什么checkbox用的是@change，而不是@click? 
  情景描述：
  <template>
    <div id="secert-main">
        <label for="label" @click.stop="clickMe">
          <input type="checkbox" id="label" v-model="ckeckVal" >点我
        </label>
        <p>复选框没有被选中</p>
    </div>
  </template>
  然后，ckeckVal在data中默认为false
  methods： cilckMe内容为：
    var that=this;
    console.log(that.ckeckVal);
  
  上述发现，如果用的是 @click，你checkbox选中后，打印出来的ckeckVal还是false。
  为什么？（下面两条官方话）
  1、可以用v-on指令监听click事件，并在触发时运行console.log(that.ckeckVal);
  2、可以用v-on指令监听change事件，并在状态改变后运行console.log(that.ckeckVal);

  注意点：
    v-on监听click --- 触发时，那个时候，ckeckVal确实，是false
    而v-on监听change就是checkbox状态改变后
  总结：
    很明显，用@change
*/