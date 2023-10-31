<template>
  <el-dialog title="提示" :visible.sync="visible" width="30%">
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      visible: false,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleConfirm() {
      this.$emit('handleConfirm')
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>
