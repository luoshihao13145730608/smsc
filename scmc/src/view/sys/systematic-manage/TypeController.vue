<template>
  <div id="homes">
    <DropdownMenus @getcateData="getcateData" :List="this.xtypeList[0].children"
      :title="this.xtypeList[0].categorycname" :id='this.xtypeList[0].categoryid'></DropdownMenus>
    <DropdownMenus @getcateData="getcateData" :List="this.ctypeList[0].children"
      :title="this.ctypeList[0].categorycname" :id='this.ctypeList[0].categoryid'></DropdownMenus>
    <Input v-model="this.showcategoryname" placeholder="请输入内容" clearable style="width: 200px;margin-left:20px" />
    &nbsp;<Button type="primary" v-on:click="update">修改</Button>&nbsp;<Button type="primary"
      v-on:click="deletes">删除</Button>
    <div class="content">
      <form>
        <table>
          <tr>
            <td></td>
            <td class="title">分类添加</td>
          </tr>
          <br>
          <tr>
            <td class="tips">选择父分类:</td>
            <td>
              <DropdownSelect v-model="pid" :staticList='this.staticList' />
            </td>
          </tr>
          <tr>
            <td class="tips">添加类型:</td>
            <td>
              <Input v-model="this.categoryname" placeholder="请输入内容" clearable style="width: 200px" />
            </td>
          </tr>
          <tr>
            <td class="tips"></td>
            <td>
              <Button type="primary" v-on:click="submit">添加</Button>
            </td>
          </tr>
        </table>
      </form>
    </div>
  </div>

</template>

<script>
import DropdownMenu from '_c/util/DropdownMenu.vue'
import DropdownSelect from '_c/util/DropdownSelect.vue'
export default {
  name: 'typeController',
  components: {
    'DropdownMenus': DropdownMenu,
    DropdownSelect

  },
  data () {
    return {
      xtypeList: [], // 新鲜菜品子分类
      ctypeList: [], // 存仓商品子分类
      staticList: [],
      children: [],
      disable: true,
      categoryid: null,
      categoryname: null,
      pid: null,
      value: {
        'categorycname': null,
        'pid': null
      },
      showcategoryname: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getxtypeList()
      this.getctypeList()
      this.setstaticList()
    },
    getxtypeList () {
      this.$api.sys.getxtypeList().then(res => { // 读取新鲜菜品
        if (res) {
          console.log(res)
          this.xtypeList = res
          this.staticList.push({
            'categorycname': this.xtypeList[0].categorycname,
            'categoryid': this.xtypeList[0].categoryid
          })
        }
      })
    },
    getctypeList () {
      this.$api.sys.getstaticList().then(res => { // 读取新鲜菜品
        if (res) {
          console.log(res)
          this.ctypeList = res
          this.staticList.push({
            'categorycname': this.ctypeList[0].categorycname,
            'categoryid': this.ctypeList[0].categoryid
          })
        }
      })
    },
    submit () { // 点击添加分类信息
      this.value.categorycname = this.categoryname
      this.value.pid = this.pid
      alert(this.value.categorycname)
      alert(this.value.pid)
      this.$api.sys.addtype(this.value).then(res => {
        if (res) {
          if (res.ok === 1) {
            alert('添加成功')
          } else if (res.ok === -1) {
            alert('添加失败，已经存在该分类')
          }
        }
      })
    },
    getcateData: function (name, ids) {
      this.categoryid = name
      this.pid = ids
      if (this.pid == 1) {
        this.xtypeList[0].children.map((item, index, ary) => {
          if (this.xtypeList[0].children[index].categoryid == name) {
            this.showcategoryname = this.xtypeList[0].children[index].categorycname
          }
        })
      } else {
        this.ctypeList[0].children.map((item, index, ary) => {
          if (this.ctypeList[0].children[index].categoryid == name) {
            this.showcategoryname = this.ctypeList[0].children[index].categorycname
          }
        })
      }
    },
    deletes () {
      this.$api.sys.deletetype(1).then(res => { // 读取新鲜菜品
        if (res) {
          // console.log(res)
          alert(res)
        }
      })
    },
    update () {

    }
  }
}
</script>

<style scoped>
div.content {
  margin: 0 auto;
  width: 500px;
}
.title {
  font-size: 30px;
}
.tips {
  font-size: 16px;
}
tr {
  line-height: 50px;
}
</style>
