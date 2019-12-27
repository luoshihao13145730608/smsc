import { localRead, localRemove } from '@/libs/util'
import { Notice } from 'iview'
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
  let status = response.status
  if ((status >= 200 && status < 300) || status === 501) {
    return response
  }
  const errortext = codeMessage[response.status] || response.statusText
  if (!ignoreStatus.includes(response.status)) {
    Notice.error({
      title: 'error',
      desc: errortext
    })
  }
  const error = new Error(errortext)
  error.name = response.status
  error.response = response
  throw error
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request (url, options) {
  const defaultOptions = {
    credentials: 'include'
  }
  const newOptions = { ...defaultOptions, ...options }
  if (!(newOptions.body instanceof FormData)) {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      ...newOptions.headers
    }
  } else {
    // newOptions.body is FormData
    newOptions.headers = {
      Accept: 'application/json',
      // 'Content-Type': 'multipart/form-data',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      ...newOptions.headers
    }
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text()
      }
      const contentType = response.headers.get('Content-Type')
      if (contentType.toLowerCase() === 'application/json;charset=utf-8') {
        return response.json()
      } else if (contentType.toLowerCase() === 'application/vnd.ms-excel;charset=utf-8') {
        return response.blob()
      }
    })
    .then(data => {
      let status = data.status
      if (data.msg && status === 'INTERNAL_SERVER_ERROR' && !ignoreCodeArr.includes(data.code)) {
        Notice.error({
          title: 'error',
          desc: data.msg
        })
      }
      return data
    })
    .catch((e) => {
      const status = e.name
      if (status === 401 || status === 402) {
        if (localRead('token')) {
          localRemove('token')
          localRemove('refreshToken')
          localRemove('nickName')
          localRemove('authorities')
        }
        if (status === 401 || status === 402) {
          if (window.location.pathname !== '/login') {
            router.push('/login')
          }
          return
        }
        // 用户未得到授权
        if (status === 403) {
          router.replace('/401')
        }
      }
    })
}
