/**
* 版本号：v1.0
* 创建人：林浩
* 创建时间：2019/08/07
* 描述：
    uploadBtnIcon: String  上传按钮图标
    uploadBtnText: String  上传按钮文案
    multiple: Boolean  是否支持上传多选，默认false
    accept: String  接收文件类型，默认所有
    limit: Number  上传文件数量限制，默认1，如果为1超出时为替换，若大于1超出时会有message提示
    fileList: Array  文件列表格式：[{ name: '', url: '', code: '' }]
    params: Object  请求所需携带的额外参数
    autoUpload: Boolean  是否自动上传
    httpRequest: Function  上传的axios方法，必填
    beforeUpload: Function  执行上传之前的钩子函数
    onRemove: Function  操作删除的回调方法，参数：被删除项的下标，当前文件列表
    onSuccess: Function  上传成功的回调方法，参数：成功的返回值，当前文件列表
    onError: Function  上传失败的回调方法，参数：失败的返回值
*/
<template>
  <div class="lucky-file-upload">
    <div class="upload-btn">
      <lucky-button type="primary" size="small" plain @click="toOpenUploadFile">
        <i :class="uploadBtnIcon"></i>
        {{uploadBtnText}}
      </lucky-button>
    </div>
    <input
      type="file"
      name="lucky-upload"
      ref="lucky-upload"
      :multiple="multiple"
      :accept="accept"
      style="display: none;"
      @change="handleFileChange"
    />
    <div class="file-lists">
      <div
        v-for="(item, index) in currentFileList"
        :key="index"
        class="file-item"
        @mouseover="showRemove = true"
        @mouseleave="showRemove = false"
      >
        <i class="lucky-icon el-icon-document" style="margin-right: 8px;"></i>
        <span class="file-name">{{item.name}}</span>
        <i v-if="!showRemove" class="lucky-icon el-icon-success" style="float: right; color: #67c23a;"></i>
        <i v-if="showRemove" class="lucky-icon el-icon-close" @click="toRemove(index)"></i>
      </div>
      <div v-if="showProgress" class="uploading-item">
        <i class="lucky-icon el-icon-document" style="margin-right: 8px;"></i>
        <span class="file-name">{{currentFileName}}</span>
        <span style="float: right">{{progressRate}}%</span>
      </div>
      <el-progress v-if="showProgress" :percentage="progressRate" :show-text="false" color="#1c92ff" :stroke-width="4"></el-progress>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    uploadBtnIcon: { type: String, default: 'el-icon-upload2' },
    uploadBtnText: { type: String, default: '上传文件' },
    multiple: { type: Boolean, default: false },
    accept: { type: String, default: '*' },
    limit: { type: Number, default: 1 },
    fileList: { type: Array, default: () => { return [] } },
    params: { type: Object, default: () => { return {} } },
    autoUpload: { type: Boolean, default: true },
    httpRequest: { type: Function, required: true },
    onRemove: Function,
    beforeUpload: Function,
    onSuccess: { type: Function, required: true },
    onError: Function
  },
  data () {
    return {
      currentFileList: [],
      progressRate: 0,
      showProgress: false,
      currentFileName: '',
      showRemove: false
    }
  },
  computed: {},
  watch: {
    fileList: {
      immediate: true,
      handler (fileList) {
        this.currentFileList = fileList.map(item => {
          item.status = item.status || 'success'
          return item
        })
      }
    }
  },
  created () {},
  mounted () {
    // this.currentFileList = JSON.parse(JSON.stringify(this.fileList))
  },
  methods: {
    toOpenUploadFile () {
      let luckyUpload = this.$refs['lucky-upload']
      if (luckyUpload) {
        luckyUpload.click()
      }
    },
    handleFileChange (val) {
      const files = val.target.files
      if (!files) return
      this.uploadFiles(files)
    },
    uploadFiles (files) {
      let postFiles = Array.prototype.slice.call(files)
      if (!this.multiple) { postFiles = postFiles.slice(0, 1) }
      if (postFiles.length === 0) { return }
      postFiles.forEach(file => {
        if (this.autoUpload) this.toUpload(file)
      })
    },
    toUpload (file) {
      this.$refs['lucky-upload'].value = null

      if (!this.beforeUpload) {
        return this.toPost(file)
      }

      const before = this.beforeUpload(file)
      if (before && before.then) {
        before.then(processedFile => {
          const fileType = Object.prototype.toString.call(processedFile)
          if (fileType === '[object File]' || fileType === '[object Blob]') {
            if (fileType === '[object Blob]') {
              processedFile = new File([processedFile], file.name, {
                type: file.type
              })
            }
            for (const p in file) {
              if (file.hasOwnProperty(p)) {
                processedFile[p] = file[p]
              }
            }
            this.toPost(processedFile)
          } else {
            this.toPost(file)
          }
        }, () => {
          this.onRemove(null, file)
        })
      } else if (before !== false) {
        this.toPost(file)
      } else {
        this.onRemove(null, file)
      }
    },
    async toPost (file) {
      let that = this
      if (that.limit !== 1 && that.currentFileList.length >= that.limit) {
        that.luckyMessage({ type: 'warning', message: '上传已超出最大数量' })
        return
      }
      that.currentFileName = file.name
      let res = {}
      let formData = new FormData()
      formData.append('file', file)
      let params = that.params
      for (let key in params) {
        formData.append(key, params[key])
      }
      res = await that.httpRequest(formData, { onUploadProgress: function (progressEvent) {
        that.showProgress = true
        let rate = parseInt((progressEvent.loaded / progressEvent.total * 100).toFixed(0))
        if (rate - 2 > 0) that.progressRate = rate - 2
        else that.progressRate = rate
      } })
      if (res.code) {
        if (res.code === '00000') {
          if (that.limit === 1) that.currentFileList = [{ name: res.data.name, url: res.data.url, code: res.data.code, status: 'success' }]
          else if (that.currentFileList.length < that.limit) that.currentFileList.push({ name: res.data.name, url: res.data.url, code: res.data.code, status: 'success' })
        }
        that.onSuccess(res, that.currentFileList)
      } else {
        that.onError(res)
      }
      that.showProgress = false
      that.progressRate = 0
    },
    toRemove (index) {
      this.currentFileList.splice(index, 1)
      this.onRemove(index, this.currentFileList)
      this.showRemove = false
    }
  }
}
</script>

<style lang="scss">
.lucky-file-upload {
  min-height: 128px;
  background: #ffffff;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 16px;
  .upload-btn {
    overflow: hidden;
    margin-bottom: 8px;
    .lucky-button {
      float: left;
    }
  }
  .file-lists {
    .file-item {
      box-sizing: border-box;
      height: 25px;
      line-height: 25px;
      color: #5a5b5f;
      font-size: 12px;
      padding: 0 6px;
      margin-bottom: 2px;
      .lucky-icon {
        font-size: 14px;
        line-height: 25px;
      }
      &:hover {
        background: #eef1f6;
        border-radius: 4px;
        cursor: pointer;
        .file-name {
          color: #1c92ff;
        }
      }
      .el-icon-close {
        float: right;
        color: #c3c5cc;
        &:hover {
          opacity: 0.6;
        }
      }
    }
    .uploading-item {
      box-sizing: border-box;
      height: 25px;
      line-height: 25px;
      color: #909199;
      font-size: 12px;
      padding: 0 6px;
      margin-bottom: 2px;
      .lucky-icon {
        font-size: 14px;
        line-height: 25px;
      }
    }
    .el-progress-bar__outer {
      background: #eaecf5;
    }
  }
}
</style>
