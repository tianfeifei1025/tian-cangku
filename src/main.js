import Vue from 'vue'
import App from './App.vue'

// 仅保留Vue 2的初始化方式
new Vue({
  render: h => h(App) // 正确挂载根组件App.vue
}).$mount('#app')

// new Vue({
//     render: h => h(GraphComponent)
// }).$mount('#app')
