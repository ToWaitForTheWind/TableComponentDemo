import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
const Notification = () => import('@/views/notification')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: '/notification',
      name: 'notification',
      component: Notification
    }
  ]
})
