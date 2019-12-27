<template>
  <div id="Dropdown">
    <Dropdown trigger="click" style="margin-left: 20px">
      <Button type="primary">
        {{title}}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem v-for="u in List">{{u.categorycname}}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>

export default {
  name: 'typeController',
  props: ['List', 'title', 'id'],
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
#Dropdown{
  display:inline-block;
}
</style>
