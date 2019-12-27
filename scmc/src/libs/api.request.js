import request from '@/libs/request'
export const getRequest = (url, params) => {
  let ret = transacionParamsToUrl(params)
  return request(url + (ret ? '?' + ret : ret), {
    method: 'GET'
  })
}

export const postRequest = (url, params) => {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}
export const postFormRequest = (url, params) => {
  return request(url, {
    method: 'POST',
    body: params ? transacionParamsToUrl(params) : params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const uploadFileRequest = (url, params) => {
  if (!(params instanceof FormData)) {
    throw new Error('传递的参数需要使用FormData')
  }
  return request(url, {
    method: 'POST',
    body: params
  })
}

export const downloadRequest = (url, params) => {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(params),
    responseType: 'blob'
  })
}

const transacionParamsToUrl = (params) => {
  let ret = ''
  if (params && Object.keys(params)) {
    let keys = Object.keys(params)
    for (let key of keys) {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        ret += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
      }
    }
    if (ret.length > 0 && ret.lastIndexOf('&') === ret.length - 1) {
      ret = ret.substring(0, ret.length - 1)
    }
  }
  return ret
}
