<template>
  <div id="homes">
    <h2>领料单管理</h2>
    <div class="picking-sreen">
      <span class="font">领料类型:</span>
      <DropdownSelect :size="100" />
      <span class="font">出仓状态:</span>
      <DropdownSelect :size="100" />
      <span class="font">出仓日期:</span>
      <DateTimeSelectEndAndBegin />
      <div class="hideDiv">
        <div :class="{hide:this.showSelect}">
          <span class="font">领料单号:</span>
          <Input v-model="categoryname" placeholder="请输入领料单号" clearable style="width: 200px" />
          <span class="font">下单日期:</span>
          <DateTimeSelectEndAndBegin />
        </div>
      </div>
      <Button type="primary" v-on:click="submit">查找</Button>
      <Button type="primary" v-on:click="submit">重置</Button>
      <span class="select">高级搜索
        <i-Switch size="large" @on-change="changeSelect">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-Switch>
      </span>
    </div>
    <CheckTable :List="this.pageinfo" :clos="this.clos" />
  </div>
</template>

<script>
import DropdownSelect from '_c/util/DropdownSelect.vue'
import DateTimeSelectEndAndBegin from '_c/util/DateTimeSelectEndAndBegin.vue'
import CheckTable from '_c/util/CheckTable.vue'
import moment from 'moment'
export default {
  name: 'joinOrder',
  components: {
    DropdownSelect,
    DateTimeSelectEndAndBegin,
    CheckTable
  },
  data () {
    return {
      data: '2009-1-1',
      pageinfo: [],
      shops: [],
      loading: true,
      selectedRowKeys: [],
      disabledShopExportBtn: false,
      disabledCanteenExportBtn: false,
      condition: { // 保存查询条件

      },
      expand: false,
      showSelect: true,
      clos: [
        { title: '领料单号', dataIndex: 'id', key: 'id' },
        {
          title: '领料状态',

          dataIndex: 'ispick',
          key: 'ispick',
          className: 'ispick',
          render: (h, data) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('normal', data.row.ispick === false ? '未出仓' : '出仓')
            ])
          }
        },
        {
          title: '计算状态',
          dataIndex: 'ispay',
          key: 'ispay',
          render: (h, data) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('normal', data.row.ispay === false ? '待结算' : '已结算')
            ])
          }
        },
        {
          title: '类型',
          dataIndex: 'usertype',
          key: 'usertype',
          render: function (h, data) {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('normal', this.row.usertype === 1 ? '总厨(' + (this.row.classes === 1 ? '早班' : '日班') + ')' + '-' + this.row.combotype.combotypename : '档口(' + this.row.shop.shopname + ')')
            ])
          }
        },
        {
          title: '下单时间',
          dataIndex: 'time',
          key: 'time',
          // render: (data) => moment(data).format('YYYY年MM月DD日 HH:mm')
          render: (h, data) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('normal', moment(data.row.time).format('YYYY年MM月DD日 HH:mm'))
            ])
          }
        },
        {
          title: '出仓时间',
          dataIndex: 'deliverytime',
          key: 'deliverytime',
          render: (h, data) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('normal', data.row.deliverytime == null ? '' : moment(data.row.deliverytime).format('YYYY年MM月DD日 HH:mm'))
            ])
          }
        },
        { title: '总金额', dataIndex: 'total', key: 'total', width: 100 },
        {
          title: '下单人',
          dataIndex: 'appuser.nickname',
          key: 'appuser',
          width: 100,
          render: function (h, data) {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('normal', this.row.appuser.nickname)
            ])
          }
        },
        {
          title: '操作',
          key: '8',
          dataIndex: 'id',
          width: 200,
          render: function (text, item, index) {
            var compent = this
            const detail = 'd'
            const send = 's'
            return (
              this.row.ispick ? <Link to={{ pathname: 'pickingdetail' + detail + item.id }} >查看明细</Link>
                : <div>
                  <router-link layout="inline" to={{ pathname: 'pickingdetail' + send + item.id }}>选择发货</router-link>
                  &nbsp; &nbsp; <button onClick={() => compent.deletePicking(item.id)} class="ivu-btn ivu-btn-primary">删除</button>
                </div>

            )
          }
        }
      ]

    }
  },
  mounted () {
    this.init()
  },
  methods: {
    changeSelect () {
      this.showSelect = !this.showSelect
    },
    init () {
      this.getpageinfoList()
    },
    getpageinfoList () {
      // 显示所有领料单列表
      // loadList = () => {
      //   this.setState({ loading: true })
      //   const { condition } = this.state
      //   let ret = request('/api/picking/json/checklist', { method: 'POST', body: condition })
      //   ret.then((ret) => {
      //     if (ret) {
      //       this.setState({ pageinfo: ret, loading: false })
      //     }
      //   })
      // }
      this.$api.stortApi.getpageinfo().then(ret => {
        if (ret) {
          this.pageinfo = ret
        }
      })
    },
    customStyleList (row) {
      var nameList = row.key.split(',')
      var nameIDList = row.id.split(',')
      var styleList = []
      for (let i = 0; i < nameList.length; i++) {
        arr = { name: nameList[i], id: nameIDList[i] }
        styleList.push(arr)
      }
      return styleList // 此时组件一个有值数组
    }
  }
}
</script>

<style scoped>
.font {
  font-size: 14px;
  margin: 0 10px;
}
.picking-sreen {
  margin-top: 10px;
  line-height: 20px;
}
div {
  margin-bottom: 10px;
}
.hideDiv {
  display: inline-block;
}
button {
  margin-left: 10px;
}
.select {
  font-size: 14px;
  color: blue;
  display: inline-block;
  margin-left: 5px;
}
.hide {
  display: none;
}
</style>
