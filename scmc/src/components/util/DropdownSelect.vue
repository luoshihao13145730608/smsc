<template>
  <div>
    <Select style="width:200px" @on-change="getValue" v-model="pids">
      <Option :key="id" v-for="v in staticList" :value="v.categoryid">{{v.categorycname}}</Option>
    </Select>
  </div>
</template>
<script>

export default {
  name: 'DropdownSelect',
  props: ['staticList', 'value'],
  data () {
    return {
      pids: null
    }
  },
  methods: {
    getValue () {
      this.$emit('input',this.pids)
    }
  }
}
</script>
