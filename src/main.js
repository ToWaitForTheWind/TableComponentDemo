import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import store from './store/index'

import formatFn from '@/utils/format'
import luckyUI from '@/luckyUI/index'

import './luckyUI/assets/commom.scss'
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
