import axios from 'axios'
import { Loading } from 'element-ui'

// 设置baseURL，判断当前环境是否为生产环境，若不是需设置自己的apiURL
let baseURL = process.env.NODE_ENV !== 'production' ? '/' : '/'
let config = {
  baseURL,
  timeout: 60 * 1000 // 请求超时时间
}

let loadingInstance

const _axios = axios.create(config)

let pendingQueue = new Map()
let CancelToken = axios.CancelToken
// http request 拦截器
_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (config.loadingOptions) loadingInstance = Loading.service(config.loadingOptions)
    // 请求发起之前先检验该请求是否在队列中，如果在就把队列中pending的请求cancel掉
    judgePendingFunc(config)
    // 将pending队列中的请求设置为当前
    config.cancelToken = new CancelToken(cb => {
      pendingQueue.set(`${config.method}->${config.url}`, cb)
    })
    if (config.method === 'get') {
      let res = handleGetUrl(config.url, config.params)
      config.url = res.url
      config.params = res.params
    }
    config.headers.authorization =
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC91c2VyXC9yYW5nZS11c2VyXC9hcGlcL2xvZ2luIiwiaWF0IjoxNTkzNTcwOTEzLCJleHAiOjE1OTM3ODY5MTMsIm5iZiI6MTU5MzU3MDkxMywianRpIjoiTmRyQWRXd1lqOXZtWGhXSCIsInN1YiI6NSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyIsImxvZ2luX3Rva2VuIjoiMmJlZTg4YTFmNDAxOThkNjdiZjViYjE5M2I2OTY3YmUiLCJndWFyZCI6InVzZXIifQ.FWqvo45bf_FKN0eTZ3MlBST43OhRNCoA1PIjXcXyfGc'
    return config
  },
  function (error) {
    // Do something with request error
    console.log(error)
    if (loadingInstance) loadingInstance.close()
    return Promise.reject(error)
  }
)

// http response 拦截器
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    if (loadingInstance) loadingInstance.close()
    removeResolvedFunc(response.config)
    console.log(response)
    return response.data
  },
  function (error) {
    // Do something with response error
    console.log(error)
    if (loadingInstance) loadingInstance.close()
    return Promise.reject(error)
  }
)

// 二次封装方法
/**
 * 接收三个参数，配置参数config可不传
 * @param {String} url
 * @param {Object} data
 * @param {Object} config
 */
const getFn = async (url, data, config = {}) => {
  let params = { params: data, ...config }
  try {
    return _axios.get(url, params)
  } catch (error) {
    return handleError(error)
  }
}
/**
 * 接收三个参数，配置参数config可不传
 * @param {String} url
 * @param {Object} data
 * @param {Object} config
 */
const postFn = async (url, data, config = {}) => {
  try {
    return _axios.post(url, data, config)
  } catch (error) {
    return handleError(error)
  }
}
const deleteFn = async (url, data) => {
  try {
    return _axios.delete(url, data)
  } catch (error) {
    return handleError(error)
  }
}
// 捕获请求错误
function handleError(error) {
  Promise.reject(error)
}
// 判断请求是否在队列中，如果在就执行取消请求
const judgePendingFunc = function (config) {
  if (pendingQueue.has(`${config.method}->${config.url}`)) {
    pendingQueue.get(`${config.method}->${config.url}`)()
  }
}
// 删除队列中对应已执行的请求
const removeResolvedFunc = function (config) {
  if (pendingQueue.has(`${config.method}->${config.url}`)) {
    pendingQueue.delete(`${config.method}->${config.url}`)
  }
}
// 处理get请求功能性字符和非功能性字符被转换导致的问题
const handleGetUrl = function (url, params) {
  if (!params) return { url: url, params: params }
  let parts = []
  let resUrl = url
  let resParams = params
  let keys = Object.keys(params)
  if (keys.length > 0) {
    for (let key of keys) {
      let values = []
      if (Array.isArray(params[key])) {
        values = params[key]
        key += '[]'
      } else values = [params[key]]
      values.forEach(val => {
        if (val || val === 0)
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
      })
    }
    let serializedParams = parts.join('&')
    if (serializedParams) {
      resUrl += (resUrl.includes('?') ? '&' : '?') + serializedParams
    }
  }
  return { url: resUrl, params: resParams }
}

export default {
  get: getFn,
  post: postFn,
  delete: deleteFn
}
