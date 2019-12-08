import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import Home from './views/index'
const UserList = () => import('@/views/userManage/UserList')
const Notification = () => import('@/views/notification')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'userList',
          name: 'admin_user',
          component: UserList,
          meta: {
            requireAuth: true
          }
        }
      ]
    }, {
      path: '/notification',
      name: 'notification',
      component: Notification
    }
  ]
})
