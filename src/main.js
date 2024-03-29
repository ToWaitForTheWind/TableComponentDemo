import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import ElementUI from 'element-ui'
import ViewUI from 'view-design'
// import LuckyUi from 'lucky-ui-rain'

import formatFn from '@/utils/format'
import luckyUI from '@/luckyUI/index'

import './styles.scss'
import 'view-design/dist/styles/iview.css'

import { authList } from '@/config/authConfig'

Vue.use(ElementUI)
  // .use(LuckyUi)
  .use(formatFn)
  .use(luckyUI)
  .use(ViewUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
