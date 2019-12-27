<style scoped lang="less">
  @import "avatar-preview";
</style>
<template>
  <div  class="avatar-preview" :style="sizeStype">
    <template v-if="urls instanceof Array">
      <div v-for="(url,index) in urls" :key="index">
        <img :src="url" @error="onError" v-if="!!url">
        <img :src="defaultImage" v-else>
        <div class="avatar-preview-cover" v-if="!!url">
          <Icon type="ios-eye-outline" @click.native="handleView(url)"></Icon>
        </div>
      </div>
    </template>
    <template v-else>
      <img :src="urls" @error="onError" v-if="!!urls">
      <img :src="defaultImage" v-else>
      <div class="avatar-preview-cover" v-if="!!urls">
        <Icon type="ios-eye-outline" @click.native="handleView(urls)"></Icon>
      </div>
    </template>
    <Modal title="View Image" v-model="visible">
      <img :src="imgUrl" v-if="visible" style="width: 100%" @error="onError">
    </Modal>
  </div>
</template>

<script>
import defaultImage from '@/assets/images/default.jpeg'
export default {
  props: {
    urls: {
      type: [String, Array],
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    },
    shape: {
      default: 'circle',
      validator: (value) => {
        return ['circle', 'square', 'rectangle'].includes(value)
      }
    }
  },
  data () {
    return {
      defaultImage,
      imgUrl: '',
      visible: false
    }
  },
  methods: {
    handleView (name) {
      this.imgUrl = name
      this.visible = true
    },
    onError (e) {
      e.target.src = this.defaultImage
    }
  },
  computed: {
    sizeStype () {
      return this.size === 'large' ? { width: '60px', height: this.shape === 'rectangle' ? '38px' : '60px', 'line-height': this.shape === 'rectangle' ? '38px' : '60px', 'border-radius': this.shape === 'circle' ? '30px' : '' } : { width: '40px', height: this.shape === 'rectangle' ? '22px' : '40px', 'line-height': this.shape === 'rectangle' ? '22px' : '40px', 'border-radius': this.shape === 'circle' ? '20px' : '' }
    }
  }
}
</script>
