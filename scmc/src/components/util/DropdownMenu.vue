<template>
  <div id="homes">
    <Dropdown trigger="click">
      <a href="javascript:void(0)">
        {{xtypeList.categorycname}}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem>驴打滚</DropdownItem>
        <DropdownItem>炸酱面</DropdownItem>
        <DropdownItem disabled>豆汁儿</DropdownItem>
        <DropdownItem>冰糖葫芦</DropdownItem>
        <DropdownItem divided>北京烤鸭</DropdownItem>
      </DropdownMenu>
    </Dropdown>

  </div>
</template>

<script>

export default {
  name: 'typeController',
  props: ['xtypeList'],
  data () {
    return {
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    // init () {
    //   this.getxtypeList()
    // },
    // getxtypeList () {
    //   this.$api.sys.getList().then(res => {
    //     if (res) {
    //       this.xtypeList = res
    //     }
    //   })
    // }
  }
}
</script>

<style scoped>
</style>
