<template>
  <div id="homes">
    <DropdownMenus v-bind:xtypeList="this.datas"></DropdownMenus>
    <p v-for="u in this.xtypeList">
      {{u.categorycname}}
    </p>
  </div>
</template>

<script>
import DropdownMenu from '_c/util/DropdownMenu.vue'
export default {
  name: 'typeController',
  components: {
    'DropdownMenus': DropdownMenu
  },
  data () {
    return {
      xtypeList: [], // 新鲜菜品子分类
      ctypeList: [], // 存仓商品子分类
      staticList: [],
      disable: true,
      categoryid: null,
      categoryname: null,
      datas: {}
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getxtypeList()
    },
    getxtypeList () {
      this.$api.sys.getList().then(res => {
        if (res) {
          this.datas = res
          this.xtypeList = res
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
