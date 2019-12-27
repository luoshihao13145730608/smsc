import { postRequest, postFormRequest } from '@/libs/api.request'

export default {
  /**
   * 登录
   * @param params
   * @returns {*}
   */
  login: (params) => {
    return postRequest('/api/auth/login', params)
  },
  /**
   * 注销登录
   * @returns {*}
   */
  logout: () => {
    return postRequest('/api/auth/logout')
  },
  /**
   * 添加用户
   * @param params
   * @returns {*}
   */
  add: (params) => {
    return postRequest('/api/appuser/add', params)
  },
  /**
   * 编辑用户
   * @param params
   * @returns {*}
   */
  edit: (params) => {
    return postRequest('/api/appuser/edit', params)
  },
  /**
   * 批量删除用户
   * @param params
   * @returns {*}
   */
  del: (params) => {
    console.log(params)
    return postFormRequest('/api/appuser/del', params)
  },
  /**
   * 根据条件查询用户列表
   * @param params
   * @returns {*}
   */
  list: (params) => {
    return postRequest('/api/appuser/list', params)
  },
  /**
   * 根据用户编号获取用户信息
   * @param params
   * @returns {*}
   */
  fetchone: (params) => {
    return postFormRequest('/api/appuser/fetchone', params)
  },
  /**
   * 解除用户的微信绑定
   * @param params
   * @returns {*}
   */
  cancelopenid: (params) => {
    return postFormRequest('/api/appuser/cancelopenid', params)
  },
  /**
   * 加载所有角色
   * @param params
   */
  loadRoles: () => {
    return postRequest('/api/role/list')
  }
}
