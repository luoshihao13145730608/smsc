import axios from 'axios'
import { Notice } from 'iview'
import { localRead, localRemove, localSave } from '@/libs//util'
import router from '@/router'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  402: '用户名或密码不正确。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}
/* 后台返回错误码时，忽略指定错误码在右上角的弹框 */
const ignoreCodeArr = [
  // 17, /* 数据重复录入 */
  // 27 /* 用户密码不正确 */
  15
]
const ignoreStatus = [
  403 /* 用户未得到授权 */
]
function checkStatus (response) {
  if (!response) return
  const errortext = response.data.msg ? response.data.msg
    : response.data.message ? response.data.message : codeMessage[response.status] || response.statusText
  /* 如果是返回后台处理后的错误代码，则判断里面有没有包含code，如果没包含，则弹出全局异常消息 */
  if (response.data && !ignoreStatus.includes(response.status) && !ignoreCodeArr.includes(response.data.code)) {
    Notice.error({
      title: 'error',
      desc: errortext
    })
  }
  if (response.status === 401 || errortext === '无效的登录凭证') {
    localRemove('access')
    localRemove('nickname')
    localRemove('avatar')
    localRemove('token')
    localRemove('local')
    router.push('/login')
  }
  if (response.status === 403) {
    router.push('/401')
  }
  if (response.status !== 501) {
    const error = new Error(errortext)
    error.name = response.status
    error.response = response
    throw error
  }
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
  }
  getInsideConfig () {
    const config = {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
    return config
  }
  interceptors (instance) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      config.headers['Authorization'] = 'Bearer ' + localRead('token')
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      if (res.headers.token) {
        localSave('token', res.headers.token)
      }
      if (res.data.code === 500) {
        Notice.error({
          title: 'error',
          desc: res.data.msg
        })
      }
      return res.data
    }, error => {
      checkStatus(error.response)
      return Promise.reject(error.response.data)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance)
    return instance(options)
  }
}
export default HttpRequest
