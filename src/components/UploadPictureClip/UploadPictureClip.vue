<style lang="less" scoped>
@import "upload-pictureclip.less";
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

      <div class="uploadCss" v-if="this.quantity && this.uploadList.length < Number(this.quantity)">
        <div  style="width: 58px; height: 58px; line-height: 58px;border: 1px dashed #dcdee2;" @click="handleUpload()">
          <i class="ivu-icon ivu-icon-ios-camera" style="font-size: 20px;"></i>
        </div>
      </div>

        <Modal title="图片预览" v-model="visible">
          <img :src="imgName" v-if="visible" style="width: 100%">
        </Modal>
      </template>

        <my-upload v-if="show" field="img"
        @crop-success="cropSuccess"
        v-model="show"
        :width="width"
        :height="height"
        ref="myUplod"
        imgFormat='png'
        url=""></my-upload>

    </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
export default {
  components: {
    'my-upload': myUpload
  },
  name: 'UploadPicture',
  props: {
    quantity: {
      type: Number
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    value: {
      default: () => [],
      type: Array
    },
    maxSize: {
      default: 2048
    },
    initImages: {
      default: () => [],
      type: Array
    },
    format: {
      default: () => ['jpg', 'jpeg', 'png'],
      type: Array
    },
    isReturnObject: { // 是否删除返回对象  默认返回ID
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      show: false,
      delImg: [],
      visible: false,
      imgName: '',
      uploadList: [],
      fileList: this.value.concat()
    }
  },
  methods: {
    handleUpload () {
      this.show = true
    },
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    srcFileSet (fileName, fileType, fileSize) {
      alert(fileName)
    },
    handleRemove (file) {
      this.uploadList.splice(this.uploadList.indexOf(file), 1)
      this.fileList.splice(this.fileList.indexOf(file), 1)
      if (this.isReturnObject) { // 是否返回对象（id，图片服务器路径）
        this.$emit('on-remove', file.name)
      } else {
        this.$emit('on-remove', file.id ? file.id : file.name)
      }
      this.$emit('input', this.fileList)
      this.$emit('onChange', this.fileList, this.uploadList)
    },
    cropSuccess (imgDataUrl, field) {
      this.fileList.push(imgDataUrl) // 获得img的url 并赋值
      this.uploadList.push({ url: imgDataUrl, name: 'aa' })
      this.$emit('input', this.fileList)
      this.$emit('onChange', this.fileList, this.uploadList)
    },
    clearUploadList () {
      this.uploadList.splice(0, this.quantity)
      this.fileList.splice(0, this.quantity)
      this.$emit('input', this.fileList)
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
            this.uploadList.push({ url: image, name: image.substring(image.lastIndexOf('/') + 1) })
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
