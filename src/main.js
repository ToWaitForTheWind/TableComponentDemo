import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import ElementUI from 'element-ui'

import formatFn from '@/utils/format'
import luckyUI from '@/luckyUI/index'

import './styles.scss'

Vue.use(ElementUI)
  .use(formatFn)
  .use(luckyUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
