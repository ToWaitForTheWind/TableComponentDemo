<template>
  <div class="TestHtml2Canvas">
    <el-button type="primary" @click="toDownload">下载</el-button>
    <div class="box">
      <div class="download-area" ref="downloadArea">
        <div v-for="i in 100" :key="`clo-${i}`" class="col-item">
          <div v-for="j in 20" :key="`row${j}`" class="row-item">
            {{ Math.random() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
export default {
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    toDownload() {
      this.saveImage('downloadArea')
    },
    dataURLToBlob(dataurl) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    saveImage(domRef) {
      let canvasID = this.$refs[domRef]
      let that = this
      let a = document.createElement('a')
      html2canvas(canvasID).then(canvas => {
        console.log(canvas)
        let dom = document.body.appendChild(canvas)
        dom.style.display = 'none'
        a.style.display = 'none'
        document.body.removeChild(dom)
        let blob = that.dataURLToBlob(dom.toDataURL('image/png'))
        a.setAttribute('href', URL.createObjectURL(blob))
        //这块是保存图片操作  可以设置保存的图片的信息
        a.setAttribute('download', 'test.png')
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(blob)
        document.body.removeChild(a)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.TestHtml2Canvas {
  .col-item {
    display: flex;
  }

  .box {
    position: fixed;
    z-index: -99;
    opacity: 0;
  }
}
</style>
