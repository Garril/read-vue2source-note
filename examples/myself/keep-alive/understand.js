/*  keep-alive重点知道：
  include/exclude 两属性

      include - 字符串或正则表达式。只有匹配的组件会被缓存。
          // 保持 name为a和b的组件
          <keep-alive include="a,b">
              <router-view/>
          </keep-alive>

      exclude - 字符串或正则表达式。任何匹配的组件都不会被缓存。
          <keep-alive exclude="test-keep-alive">
            <!-- 将不缓存name为test-keep-alive的组件 -->
            <component></component>
          </keep-alive>

  activated,deactivated 两生命周期

  keep-alive其实就是个组件（抽象组件）：
  src/core/components/keep-alive.js  ---- export default


  keep-alive的其他补充：
  
  动态判断
  <keep-alive :include="includedComponents">

  正则表达式也要v-bind：
  <keep-alive :include="/a|b/">

  将缓存name为a或者b的组件，结合动态组件使用
  <keep-alive include="a,b">
    <component :is="view"></component>
  </keep-alive>
  
*/