<template>
  <div id="homes">
    <Row>
      <Col span="12">
      <DatePicker type="date" :options="options3" placeholder="开始日期" style="width: 150px"></DatePicker>
      </Col>
      <Col span="12">
      <DatePicker type="date" :options="options4" placeholder="结束日期" style="width: 150px"></DatePicker>
      </Col>
    </Row>
  </div>
</template>

<script>

export default {
  name: 'dateTime',
  components: {

  },
  data () {
    return {

    }
  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style scoped>
div {
  margin-top: -20px;
  display: inline-block;
  clear: right;
}
.ivu-col {
  top: 13px;
}
</style>
