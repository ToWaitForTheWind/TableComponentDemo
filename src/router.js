import Vue from 'vue'
import Router from 'vue-router'
import entrance from './views/index'

import {
  adminPlatformMenu,
  toFilterHavePermissionMenu,
  toFindNextRedirectRouter
} from '@/config/menuConfig'
import { authList } from '@/config/authConfig'

const HomePage = () => import('@/views/home/HomePage')
const UserList = () => import('@/views/userManage/UserList')
const UserOperate = () => import('@/views/userManage/UserOperate')
const LoopholeList = () => import('@/views/loophole/LoopholeList')
const DepartmentList = () => import('@/views/department/DepartmentList')
const NoAuth = () => import('@/views/common/NoAuth')
const test1 = () => import('@/views/forTest/Drag')
const Regexp = () => import('@/views/Regexp')

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/admin'
  },
  {
    path: '/admin',
    name: 'adminPlatForm',
    component: entrance,
    redirect: to => {
      return {
        name: toFindNextRedirectRouter(
          toFilterHavePermissionMenu(adminPlatformMenu, authList)
        ).name
      }
    },
    children: [
      {
        path: 'home',
        name: 'admin_main',
        component: HomePage,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'userList',
        name: 'admin_user',
        component: UserList,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'userList/add',
        name: 'admin_user_add',
        component: UserOperate,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'userList/:id/edit',
        name: 'admin_user_edit',
        component: UserOperate,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'department',
        name: 'admin_department',
        component: DepartmentList,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'loophole',
        name: 'admin_loophole',
        component: LoopholeList,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'regexp',
        name: 'admin_regexp',
        component: Regexp,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'test',
        name: 'admin_test',
        component: test1,
        meta: {
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/noAuth',
    name: 'noAuth',
    component: NoAuth
  }
]

const router = new Router({
  routes,
  strict: process.env.NODE_ENV !== 'production'
})
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (authList[to.name]) next()
    else next({ name: 'noAuth' })
  } else next()
})

export default router
