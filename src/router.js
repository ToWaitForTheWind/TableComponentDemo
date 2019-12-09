import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import Home from './views/index'
const UserList = () => import('@/views/userManage/UserList')
// const TestMdEditor = () => import('@/views/forTest/TestMdEditor')
const test1 = () => import('@/views/forTest/test1')

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
        }, {
          path: 'test',
          name: 'test',
          component: test1,
          meta: {
            requireAuth: true
          }
        }
      ]
    }
  ]
})
