<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { localRemove } from '@/libs/util'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  methods: {
    logout () {
      this.$api.appuser.logout().then(() => {
        localRemove('access')
        localRemove('nickname')
        localRemove('refreshToken')
        localRemove('token')
        localRemove('local')
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
      }
    }
  }
}
</script>
