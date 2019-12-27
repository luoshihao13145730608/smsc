import { postRequest, postFormRequest } from '@/libs/api.request'
export default {
  /**
   * 分类查询
   * @param params
   * @returns {*}
   */
  getList: (param) => {
    return postRequest('/api/category/json/xtypeList', param)
  }

}
