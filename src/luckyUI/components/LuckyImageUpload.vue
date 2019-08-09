/**
* 版本号：v1.0
* 创建人：林浩
* 创建时间：2019/08/07
* 描述：
    uploadBtnIcon: String  上传按钮图标
    uploadBtnText: String  上传按钮文案
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
  <div class="lucky-image-upload">
    <div class="image-lists clearfix">
      <div class="image-item" v-for="(item, index) in currentFileList" :key="index" :style="`min-height: ${height}px;`">
        <div
          class="have-data"
          v-if="item.url"
          :style="`width: ${width}px; height: ${height}px;`"
          @mouseover="handleHover(index)"
          @mouseleave="showRemove = false"
        >
          <img :src="item.url" :alt="item.name" :style="`width: ${width}px; height: ${height}px;`" />
          <div v-if="showRemove && layerIndex === index" class="layer">
            <div class="operate-icon">
              <i class="el-icon-zoom-in" @click="handlePreview(index)"></i>
              <i class="el-icon-delete" @click="toRemove(index)"></i>
            </div>
          </div>
        </div>
        <el-progress
          v-if="!item.url && showProgress"
          type="circle"
          :percentage="progressRate"
          color="#1c92ff"
          :stroke-width="4"
          :width="width"
        ></el-progress>
      </div>
      <div
        v-if="showUpload"
        class="upload-btn"
        @click="toOpenUploadFile"
        :style="`width: ${width}px; height: ${height}px;`"
      >
        <div class="upload-icon">
          <i :class="uploadBtnIcon"></i>
        </div>
        <div class="upload-text">{{uploadBtnText}}</div>
      </div>
    </div>
    <input
      type="file"
      name="lucky-upload"
      ref="lucky-upload"
      :accept="accept"
      style="display: none;"
      @change="handleFileChange"
    />
    <lucky-dialog :visible.sync="showPreview" :showTitle="false" :closeByModal="true">
      <img :src="currentImg" style="width: 100%;" />
    </lucky-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    width: { type: Number, default: 90 },
    height: { type: Number, default: 90 },
    uploadBtnIcon: { type: String, default: 'el-icon-plus' },
    uploadBtnText: { type: String, default: '上传图片' },
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
      showUpload: true,
      currentFileList: [],
      progressRate: 0,
      showProgress: false,
      showRemove: false,
      layerIndex: 0,
      currentImg: '',
      showPreview: false
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
    },
    'currentFileList.length' (val) {
      if (val < this.limit) {
        this.showUpload = true
      } else {
        this.showUpload = false
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
      let res = {}

      let formData = new FormData()
      formData.append('file', file)

      let params = that.params
      for (let key in params) {
        formData.append(key, params[key])
      }

      if (that.limit !== 1) that.currentFileList.push({})
      else that.currentFileList = [{}]
      res = await that.httpRequest(formData, { onUploadProgress: function (progressEvent) {
        that.showProgress = true
        let rate = parseInt((progressEvent.loaded / progressEvent.total * 100).toFixed(0))
        if (rate - 2 > 0) that.progressRate = rate - 2
        else that.progressRate = rate
      } })
      if (res.code) {
        if (res.code === '00000') {
          if (that.limit === 1) that.currentFileList = [{ name: res.data.name, url: res.data.url, code: res.data.code, status: 'success' }]
          else if (that.currentFileList.length <= that.limit) that.currentFileList[that.currentFileList.length - 1] = { name: res.data.name, url: res.data.url, code: res.data.code, status: 'success' }
        } else {
          that.currentFileList.splice(that.currentFileList.length - 1, 1)
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
    },
    handleHover (index) {
      this.showRemove = true
      this.layerIndex = index
    },
    handlePreview (index) {
      this.currentImg = this.currentFileList[index].url
      this.showPreview = true
    }
  }
}
</script>

<style lang="scss">
.lucky-image-upload {
  .image-lists {
    .upload-btn {
      float: left;
      background: #fafbfc;
      border: 1px dashed #dcdee6;
      border-radius: 4px;
      box-sizing: border-box;
      padding-top: 20px;
      cursor: pointer;
      margin-bottom: 10px;
      &:hover {
        border-color: #1c92ff;
      }
      .upload-icon {
        font-size: 22px;
        line-height: 22px;
        color: #909199;
        text-align: center;
        margin-bottom: 8px;
      }
      .upload-text {
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        color: #909199;
      }
    }
    .image-item {
      position: relative;
      float: left;
      border-radius: 4px;
      overflow: hidden;
      margin: 0 18px 10px 0;
      .have-data {
        position: relative;
        .layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba($color: #000000, $alpha: 0.5);
          border-radius: 4px;
          color: #ffffff;
          cursor: pointer;
          .operate-icon {
            font-size: 18px;
            line-height: 18px;
            text-align: center;
            margin: 36px 0;
            i {
              &:hover {
                opacity: 0.6;
              }
              & + i {
                margin-left: 14px;
              }
            }
          }
        }
      }
      .el-progress {
        float: left;
      }
    }
  }
}
</style>
