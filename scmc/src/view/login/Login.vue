<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="食堂管理系统" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="login"></login-form>
          <p class="login-tip">请输入登录名和密码</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { localSave } from '@/libs/util'
export default {
  components: {
    LoginForm
  },
  methods: {
    login ({ username, password }) {
      this.$api.appuser.login({ username, password }).then(res => {
        if (res && !res.errorCode) {
          localSave('token', res.token)
          localSave('access', res.authorities)
          localSave('refreshToken', res.refreshToken)
          localSave('nickname', res.nickname)
          this.$router.push({
            name: 'home'
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
