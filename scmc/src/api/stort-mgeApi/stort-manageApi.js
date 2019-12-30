import { postRequest, postFormRequest, getRequest } from '@/libs/api.request'
export default {
  /**
   * 分类查询
   * @param params
   * @returns {*}
   */
  getxtypeList: (param) => { // 获取新鲜菜品分类数据
    return postRequest('/api/category/json/xtypeList', param)
  },
  getpageinfo: (param) => { // 获取所有领料单列表
    return postRequest('/api/picking/json/checklist', param)
  }
}
