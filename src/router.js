import Vue from 'vue'
import Router from 'vue-router'
import entrance from './views/index'

import { adminPlatformMenu, toFilterHavePermissionMenu, toFindNextRedirectRouter } from '@/config/menuConfig'
import { authList } from '@/config/authConfig'

const HomePage = () => import('@/views/home/HomePage')
const UserList = () => import('@/views/userManage/UserList')
const UserOperate = () => import('@/views/userManage/UserOperate')
const LoopholeList = () => import('@/views/loophole/LoopholeList')
const DepartmentList = () => import('@/views/department/DepartmentList')
const test1 = () => import('@/views/forTest/test1')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/admin'
    },
    {
      path: '/admin',
      name: 'adminPlatForm',
      component: entrance,
      redirect: to => {
        return { name: toFindNextRedirectRouter(toFilterHavePermissionMenu(adminPlatformMenu, authList)).name }
      },
      children: [
        {
          path: 'home',
          name: 'admin_main',
          component: HomePage,
          meta: {
            requireAuth: true
          }
        }, {
          path: 'userList',
          name: 'admin_user',
          component: UserList,
          meta: {
            requireAuth: true
          }
        }, {
          path: 'userList/add',
          name: 'admin_user_add',
          component: UserOperate,
          meta: {
            requireAuth: true
          }
        }, {
          path: 'userList/:id/edit',
          name: 'admin_user_edit',
          component: UserOperate,
          meta: {
            requireAuth: true
          }
        }, {
          path: 'department',
          name: 'admin_department',
          component: DepartmentList,
          meta: {
            requireAuth: true
          }
        }, {
          path: 'loophole',
          name: 'admin_loophole',
          component: LoopholeList,
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
