<template>
  <div id="Dropdown">
    <Dropdown @on-click="changeMenu" trigger="click" style="margin-left: 20px">
      <Button type="primary">
        {{title}}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list" :value="id">
        <DropdownItem v-for="u in List" :value="u.categoryid" :name="u.categoryid" :key="id">
          {{u.categorycname}}
        </DropdownItem>
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
      categoryid: null
    }
  },
  mounted () {
  },
  methods: {
    changeMenu (name) {

      this.$emit('getcateData', name, this.id)
    }
  }
}
</script>

<style scoped>
#Dropdown {
  display: inline-block;
}
</style>
