import { unixToTime } from './time'

const accountStatusMaps = {
  status: {
    online: '在线',
    offline: '离线'
  },
  type: {
    online: 'success',
    offline: 'warning'
  }
}

export default {
  install (Vue, options) {
    Vue.prototype.formatFunc = (fnName = 'default', data = '', row = {}) => {
      const fnMap = {
        default: data => data,
        /**
         * 时间戳转换时间
         * 接受两个参数需要格式化的数据
         * 为防止某些格式化的规则需要表格当前行其他数据信息扩展传参row（可不传）
         */
        timeFormat: (data, row) => {
          return unixToTime(data)[0]
        },
        // 用户账号状态转标签
        formatAccountStatus: (data, row) => {
          return `<span class="status-tag ${accountStatusMaps.type[data]}">${accountStatusMaps.status[data]}</span>`
        }
      }
      return fnMap[fnName](data, row)
    }
  }
}
