import axios from '@/plugins/axios'

/**
 * 接收请求所需要配置的参数
 * @param { Object } queryParams
 */
export const testGet1 = queryParams => {
  return axios.get('/path/path', queryParams)
}
export const testGet2 = queryParams => {
  // 配置特殊情况修改接收返回值类型为blob（多用于下载文件）
  return axios.get('/path/path', queryParams, { responseType: 'blob' })
}
export const testPost1 = queryParams => {
  return axios.post('/path/path', queryParams)
}
export const testPost2 = queryParams => {
  // 配置特殊情况延长超时时间（多用于上传大文件）
  return axios.post('/path/path', queryParams, { timeout: 2 * 60 * 60 * 1000 })
}