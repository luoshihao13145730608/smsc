import { postRequest, postFormRequest } from '@/libs/api.request'
export default {
  /**
   * 分类查询
   * @param params
   * @returns {*}
   */
  getxtypeList: (param) => { // 获取新鲜菜品分类数据
    return postRequest('/api/category/json/xtypeList', param)
  },
  getstaticList: (param) => { // 获取仓库菜品分类数据
    return postRequest('/api/category/json/ctypeList', param)
  },
  addtype: (param) => {
    return postRequest('/api/category/json/addtype', param)
  }
}
