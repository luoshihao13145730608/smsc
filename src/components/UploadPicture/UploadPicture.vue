<style lang="less">
@import "upload-picture.less";
</style>
<template>
    <div class="upload-picture">
      <div class="upload-list"  v-for="(item, index) in uploadList" :key="index">
        <img :src="item.url" >
        <div class="upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </div>
      <template>
        <Upload
          ref="upload"
          :show-upload-list="false"
          :max-size="maxSize"
          :before-upload="handleUpload"
          type="drag"
          action=""
          style="display: inline-block;width:58px;">
          <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>
        <Modal title="图片预览" v-model="visible">
          <img :src="imgName" v-if="visible" style="width: 100%">
        </Modal>
      </template>
    </div>
</template>

<script>
export default {
  name: 'UploadPicture',
  props: {
    quantity: {
      type: Number
    },
    value: {
      default: () => [],
      type: Array
    },
    maxSize: {
      default: 10000
    },
    initImages: {
      default: () => [],
      type: Array
    },
    format: {
      default: () => ['jpg', 'jpeg', 'png'],
      type: Array
    },
    isBase: {
      default: false,
      type: Boolean
    },
    isReturnObject: { // 是否删除返回对象  默认返回ID
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      delImg: [],
      visible: false,
      imgName: '',
      uploadList: [],
      fileList: this.value.concat()
    }
  },
  methods: {
    handleUpload (e) {
      if (this.quantity && this.uploadList.length >= Number(this.quantity)) {
        this.$Notice.warning({
          title: `只能上传${this.quantity}张图片`
        })
        return false
      }
      var filextension = e.name.substring(e.name.lastIndexOf('.') + 1)
      filextension = filextension.toLowerCase()
      if (!this.format.includes(filextension)) {
        this.handleFormatError(e)
        return false
      }
      var size = 0
      size = e.size// byte
      size = (size / 1024).toFixed(3)// kb
      if (size > this.maxSize) {
        this.handleMaxSize(e)
        return false
      }
      let imgUrl = this.getObjectURL(e)
      if (!this.isBase) {
        this.fileList.push(e)
      } else {
        let reader = new FileReader()
        let that = this
        reader.readAsDataURL(e)
        reader.onload = function (m) {
          that.fileList.push(this.result)
        }
      }
      this.uploadList.push({ url: imgUrl, name: e.name, type: 'local' })
      this.$emit('input', this.fileList)
      this.$emit('onChange', this.fileList, this.uploadList)
      return false
    },
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove (file) {
      this.uploadList.splice(this.uploadList.indexOf(file), 1)
      this.fileList = this.fileList.filter((item) => item.name !== file.name)
      if (this.isReturnObject) { // 是否返回对象（id，图片服务器路径）
        this.$emit('on-remove', file.id ? { id: file.id, path: file.name } : { id: 0, path: file.name })
      } else {
        if (file.type === 'online') {
          this.$emit('on-remove', file.id ? file.id : file.name)
        }
      }
      this.$emit('input', this.fileList)
      this.$emit('onChange', this.fileList, this.uploadList)
    },
    getObjectURL (file) {
      let url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    handleFormatError () {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: ` 对不起，系统仅支持${this.format.toString()}格式的文件.`
      })
    },
    handleMaxSize () {
      this.$Notice.warning({
        title: '图片大小限制',
        desc: `图片大小上限为${this.maxSize}kb`
      })
    }
  },
  watch: {
    initImages (newValue) {
      this.uploadList = []
      this.fileList = []
      this.delImg = []
      this.delIds = []
      if (newValue) {
        newValue.forEach((image) => {
          if (typeof image === 'string') {
            this.uploadList.push({ url: image, name: image.substring(image.lastIndexOf('/') + 1), type: 'online' })
          } else {
            this.uploadList.push({ id: image.id ? image.id : 0, url: image.picPath, name: image.picPath.substring(image.picPath.lastIndexOf('/') + 1) })
          }
        })
      }
      this.$emit('input', this.fileList)
      this.$emit('onChange', this.fileList, this.uploadList)
    }
  }
}
</script>
