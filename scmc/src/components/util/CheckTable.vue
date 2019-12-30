<template>
  <div id="homes">
    <Table border ref="selection" :columns="clos" :data="this.List.list"></Table>
  </div>
</template>

<script>

export default {
  props: ['List', 'clos'],
  name: 'joinOrder',
  components: {

  },
  data () {
    return {

    }
  },
  mounted () {
  },
  methods: {
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    }
  }
}
</script>

<style scoped>
</style>
