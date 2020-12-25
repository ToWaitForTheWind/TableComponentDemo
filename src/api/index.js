import axios from '@/plugins/axios'

/**
 * 接收请求所需要配置的参数
 * @param { Object } queryParams
 * @param { Object } config
 */
export const testGet1 = (queryParams, config) => {
  return axios.get('/path/path', queryParams, config)
}
export const testGet2 = (queryParams, config) => {
  // 配置特殊情况修改接收返回值类型为blob（多用于下载文件）
  return axios.get('/path/path', queryParams, { ...config, responseType: 'blob' })
}
export const testPost1 = (queryParams, config) => {
  return axios.post('/path/path', queryParams, config)
}
export const testPost2 = (queryParams, config) => {
  // 配置特殊情况延长超时时间（多用于上传大文件）
  return axios.post('/path/path', queryParams, { ...config, timeout: 2 * 60 * 60 * 1000 })
}