import { Notification } from 'element-ui'

export const luckyNotify = (params = { title: '标题', message: '通知信息' }) => {
  Notification(params)
}