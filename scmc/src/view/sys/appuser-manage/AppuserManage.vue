<style lang="less">
@import "appuser-manage.less";
</style>
<template>
  <div class="search">
    <Row>
      <i-col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="48" class="search-form">
              <Form-item label="昵称：" prop="nickname">
                <Input type="text" v-model="searchForm.sname" clearable placeholder="请输入昵称" style="width: 200px" />
              </Form-item>
              <Form-item style="margin-left:-35px;">
                <Button @click="handleSearch" type="primary" icon="md-search">搜索</Button>
              </Form-item>
            </Form>
          </Row>
          <Row class="operation">
            <Button @click="addUser" type="primary" icon="md-add">添加用户</Button>
            <Dropdown @on-click="handleDropdown">
              <Button>
                更多操作
                <Icon type="md-arrow-dropdown" />
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="refresh">刷新</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Row>
          <Row class="margin-top-10 searchable-table-con1">
            <Table :loading="loading" border :columns="columns" :data="data" sortable="custom" ref="table"></Table>
          </Row>
          <Row type="flex" justify="end" class="code-row-bg page">
            <Page :current="this.searchForm.pageIndex" :total="total" @on-change="changePage" size="small" show-total
              show-elevator></Page>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Modal :title="modalTitle" v-model="userModalVisible" :mask-closable='false' :width="500"
      @on-visible-change="handleModalVisibleChange">
      <Form ref="userForm" :model="userForm" :label-width="100" :rules="userFormValidate">
        <FormItem label="登录名" prop="username">
          <Input v-model="userForm.username" />
        </FormItem>
        <FormItem label="昵称" prop="nickname">
          <Input v-model="userForm.nickname" />
        </FormItem>
        <FormItem label="修改密码" prop="isModifyPwd" v-if="userForm.userid">
          <i-switch v-model="isModifyPwd" />
        </FormItem>
        <FormItem label="密码" prop="password" :error="errorPass" v-if="!userForm.userid || isModifyPwd">
          <Input type="password" v-model="userForm.password" />
        </FormItem>
        <FormItem label="确认密码" prop="confirm" :error="errorPass" v-if="!userForm.userid || isModifyPwd">
          <Input type="password" v-model="userForm.confirm" />
        </FormItem>
        <FormItem label="角色" prop="roles">
          <Select v-model="userForm.roles" multiple>
            <Option v-for="item in rolesList" :value="item.remake" :key="item.roleid">{{ item.remake }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelUser">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitUser">提交</Button>
      </div>
    </Modal>
    <Modal v-model="rolevisible" title="权限" footer-hide>
      <div v-for="item in showrolelist" :key="item.roleid" style="font-size: 14px"> {{item.remake}}&nbsp;</div>
    </Modal>
  </div>
</template>

<script>
import AvatarPreview from '_c/AvatarPreview'
export default {
  name: 'user-manage',
  components: {
    AvatarPreview
  },
  data () {
    const validatePassword = (rule, value, callback) => {
      if (this.modalType === 0) {
        if (!value) {
          callback(new Error('密码不能为空'))
        } else if (value.length < 5) {
          callback(new Error('密码长度不得小于5位'))
        } else if (!!this.userForm.confirm && value !== this.userForm.confirm) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      } else {
        if (value) {
          if (value.length < 5) {
            callback(new Error('密码长度不得小于5位'))
          } else {
            if (!this.userForm.confirm) {
              callback(new Error('确认密码不能为空'))
            } else if (value !== this.userForm.confirm) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }
    }
    const validateRepeatPassword = (rule, value, callback) => {
      if (this.modalType === 0) {
        if (!value) {
          callback(new Error('密码不能为空'))
        } else if (value.length < 5) {
          callback(new Error('密码长度不得小于5位'))
        } else if (!!this.userForm.password && value !== this.userForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      } else {
        if (value) {
          if (value.length < 5) {
            callback(new Error('密码长度不得小于5位'))
          } else {
            if (!this.userForm.password) {
              callback(new Error('第一次输入的密码不能为空'))
            } else if (value !== this.userForm.password) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }
    }
    return {
      loading: true,
      drop: false,
      searchForm: {
        sname: '',
        pageIndex: 1
      },
      face: '',
      modalType: 0,
      userModalVisible: false,
      modalTitle: '',
      userForm: {
        roles: [],
        nickname: '',
        password: '',
        confirm: '',
        username: '',
        id: 0
      },
      file: {},
      userRoles: [],
      errorPass: '',
      userFormValidate: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirm: [
          { validator: validateRepeatPassword, trigger: 'blur' }
        ],
        roles: [
          { required: true, message: '请选择用户角色' }
        ]
      },
      submitLoading: false,
      columns: [
        {
          title: '登录名',
          key: 'username'
        },
        {
          title: '昵称',
          key: 'nickname',
          align: 'center',
          render: (h, params) => {
            if (!params.row.nickname) {
              return h('div', '—')
            } else {
              return h('div', params.row.nickname)
            }
          }
        },
        {
          title: '绑定对象',
          key: 'nickname',
          align: 'center',
          render: (h, params) => {
            if (params.row.shopname) {
              return h('div', params.row.shopname)
            } else if (params.row.suppliername) {
              return h('div', params.row.suppliername)
            } else {
              return h('div', '—')
            }
          }
        },
        {
          title: '权限',
          key: 'role',
          align: 'center',
          render: (h, params) => {
            return h('Icon', {
              props: {
                type: 'ios-eye',
                size: 20
              },
              style: {
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.handleShowRolesModal(params.row.userid)
                }
              }
            })
          }
        },
        {
          title: '绑定操作',
          key: 'bind',
          align: 'center',
          render: (h, params) => {
            if (params.row.openid) {
              return h('div', h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.handleCancelWechatBind(params.row.userid)
                    }
                  }
                },
                '解除绑定'
              ))
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row.userid)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      data: [],
      total: 0,
      imgName: '',
      visible: false,
      rolesList: [],
      rolevisible: false,
      showrolelist: [],
      isModifyPwd: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getUserList()
    },
    changePage (v) {
      this.searchForm.pageIndex = v
      this.getUserList()
    },
    getUserList () {
      // 多条件搜索用户列表
      this.loading = true
      this.$api.appuser.list(this.searchForm).then(res => {
        this.loading = false
        if (res && res.list) {
          this.data = res.list
          this.total = res.dataCount
        }
      })
    },
    handleSearch () {
      this.searchForm.pageIndex = 1
      this.init()
    },
    handleDropdown (name) {
      if (name === 'refresh') {
        this.getUserList()
      }
    },
    cancelUser () {
      this.userModalVisible = false
    },
    submitUser () {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (this.userForm.roles.length === 0) {
            this.$Message.error('请选择角色')
            return
          }
          let method = this.$api.appuser.add
          if (this.modalType === 1) {
            // 编辑用户
            method = this.$api.appuser.edit
          }
          this.submitLoading = true
          method(this.userForm).then(res => {
            this.submitLoading = false
            if (res.code === 200) {
              this.$Message.success(this.modalType === 0 ? '添加成功' : '编辑成功')
              this.init()
              this.userModalVisible = false
            }
          })
        }
      })
    },
    addUser () {
      this.handleGetRoles()
      this.modalType = 0
      this.modalTitle = '添加用户'
      this.userForm = {}
      this.userModalVisible = true
    },
    async edit (userid) {
      this.modalType = 1
      this.modalTitle = '编辑用户'
      await this.handleGetRoles()
      this.$api.appuser.fetchone({ id: userid }).then(res => {
        if (res && Object.keys(res).length) {
          this.userForm = res
          if (this.userForm.roles.length) {
            this.userForm.roles = this.userForm.roles.map(role => role.remake)
          }
        } else {
          this.userForm = {}
        }
      })
      this.userModalVisible = true
    },
    remove (v) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除用户 ' + v.username + ' ?',
        onOk: () => {
          this.$api.appuser.del({ id: v.userid }).then(res => {
            if (res.code === 200) {
              this.$Message.success('删除成功')
              this.searchForm.pageIndex = 1
              this.init()
            }
          })
        }
      })
    },
    handleGetRoles () {
      return new Promise((resolve, reject) => {
        this.$api.appuser.loadRoles().then(res => {
          if (res && res.length) {
            this.rolesList = res
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleCancelWechatBind (id) {
      this.$Modal.confirm({
        title: '注意',
        content: '确定解除微信绑定么?',
        onOk: () => {
          this.$api.appuser.cancelopenid({ id }).then((res) => {
            if (res) {
              this.getUserList()
              this.$Message.success('解除成功')
            }
          })
        }
      })
    },
    handleShowRolesModal (id) {
      this.$api.appuser.fetchone({ id }).then((ret) => {
        if (ret && ret.code !== 500) {
          this.rolevisible = true
          this.showrolelist = ret.roles
        }
      })
    },
    handleModalVisibleChange () {
      this.$refs.userForm.resetFields()
      this.isModifyPwd = false
    }
  }
}
</script>

<style>
</style>
