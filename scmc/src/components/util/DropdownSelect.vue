<template>
  <div>
    <Select :style="'width:'+this.size+'px'" @on-change="getValue" v-model="pids">
      <Option :key="id" v-for="v in staticList" :value="v.categoryid">{{v.categorycname}}</Option>
    </Select>
  </div>
</template>
<script>

export default {
  name: 'DropdownSelect',
  props: ['staticList', 'value', 'size'],
  data () {
    return {
      pids: null
    }
  },
  methods: {
    getValue () {
      this.$emit('input', this.pids)
    }
  }
}
</script>
<style scoped>
div {
  display: inline-block;
}
</style>
