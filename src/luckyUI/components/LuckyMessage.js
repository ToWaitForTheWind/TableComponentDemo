import { Message } from 'element-ui'

export const luckyMessage = (params = {}) => {
  let typeClass = ''
  let iconClass = ''
  let typeList = ['primary', 'warning', 'danger', 'success']
  let iconMap = {
    primary: 'iconInfo',
    success: 'iconSuccess',
    danger: 'iconError',
    warning: 'iconWarning',
  }
  if (!params.type || !typeList.includes(params.type)) {
    iconClass = 'iconfont iconInfo'
    typeClass = 'lucky-primary-message'
  } else {
    iconClass = `iconfont ${iconMap[params.type]}`
    typeClass = `lucky-${params.type}-message`
  }
  let defaultParams = {
    message: '通知信息aa',
    showClose: false,
    iconClass: iconClass,
    customClass: `lucky-message ${typeClass}`
  }
  params.customClass && (params.customClass += ` ${defaultParams.customClass}`)
  Message({ ...defaultParams, ...params })
}