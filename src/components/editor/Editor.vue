<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
  </div>
</template>

<script>
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'
import { oneOf } from '@/libs/tools'
export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        return oneOf(val, ['html', 'text'])
      }
    }
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  mounted () {
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.customConfig.onchange = (html) => {
      let text = this.editor.txt.text()
      this.$emit('input', this.valueType === 'html' ? html : text)
    }
    // this.editor.customConfig.showLinkImg = false
    this.editor.customConfig.customUploadImg = (files, insert) => {
      let data = new FormData()
      let imgUrl = []
      data.append('file', files[0])
      this.uploadFileRequest('/api/oss/upload', data).then(res => {
        if (res.code === 200) {
          imgUrl.push(res.data)
          insert(imgUrl)
        } else {
          this.$Message.error(res.msg)
        }
      })
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法

      // 上传代码返回结果之后，将图片插入到编辑器中
    }
    this.editor.customConfig.uploadImgParams = {
      isConvert: 1
    }
    this.editor.create()
  },
  methods: {
    setHtml (val) {
      this.editor.txt.html(val)
    },
    getText () {
      return this.editor.txt.text()
    },
    isNotEmpty () {
      return !!this.editor.txt.text() || (!!this.editor.txt.html() && this.editor.txt.html().indexOf('<img') > -1)
    },
    isEmpty () {
      return !this.isNotEmpty()
    }
  }
}
</script>

<style lang="less"></style>
