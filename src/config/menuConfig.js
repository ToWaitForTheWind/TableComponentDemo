
export const adminPlatformMenu = [
  {
    name: 'admin_main', // 菜单项的index
    desc: '首页', // 菜单项展示的内容
    icon: 'el-icon-s-management' // 菜单项的图标（如果需要的话）
  }, {
    name: 'admin_account', // 这一项有子菜单，所以这项index并不需要进行页面定向，其实可以随意写，但是是必填项
    desc: '账号管理',
    icon: 'el-icon-s-check',
    children: [
      {
        name: 'admin_user',
        desc: '用户管理'
      }, {
        name: 'admin_department',
        desc: '部门管理'
      }, {
        name: 'admin_role',
        desc: '角色管理'
      }, {
        name: 'admin_auth',
        desc: '权限管理'
      }
    ]
  }, {
    name: 'admin_resource', // 通样这项可以随意写，但是必填
    desc: '资源管理',
    icon: 'el-icon-s-management',
    children: [
      {
        name: 'admin_tool',
        desc: '工具库管理'
      }, {
        name: 'admin_knowledge',
        desc: '知识库管理',
        children: [
          {
            name: 'admin_loophole', // 三级菜单
            desc: '漏洞库管理'
          }, {
            name: 'admin_plan',
            desc: '应急预案库管理'
          }
        ]
      }
    ]
  }
]

export const toFilterHavePermissionMenu = function (menuList = [], authList = {}) {
  let newMenu = []
  menuList.forEach(item => {
    if (item.hasOwnProperty('children')) {
      let returnArr = toFilterHavePermissionMenu(item.children, authList)
      returnArr.length > 0 && newMenu.push({ ...item, children: returnArr })
    } else authList[item.name] && newMenu.push(item)
  })
  return newMenu
}

export const toFindNextRedirectRouter = function (hasPermissionMenu = []) {
  if (hasPermissionMenu.length > 0) {
    for (let item of hasPermissionMenu) {
      if (item.hasOwnProperty('children')) return toFindNextRedirectRouter(item.children)
      else return item
    }
  }
}
