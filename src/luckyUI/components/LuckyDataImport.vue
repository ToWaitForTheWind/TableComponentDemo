/**
* 版本号：v1.0
* 创建人：zoom
* 创建时间：2020/02/04
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
  <div class="lucky_data_import">

  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style lang="scss">
</style>
