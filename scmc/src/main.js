// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Api from '@/api'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import { getRequest, postRequest, uploadFileRequest, downloadRequest } from '@/libs/api.request.js'
import './index.less'
import '@/assets/icons/iconfont.css'
import { closeCurrentTag, util } from '@/libs/util'
// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)
Vue.prototype.$api = Api
Vue.prototype.closeCurrentTag = closeCurrentTag
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.uploadFileRequest = uploadFileRequest
Vue.prototype.downloadRequest = downloadRequest
Vue.prototype.GLOBAL = util
/* eslint-disable no-new */
const that = new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
export default that
