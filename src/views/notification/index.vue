<template>
  <div>
    <lucky-button type="danger" plain round disabled size="large" :loading="true" @click="testBtn">
      <i class="el-icon-delete"></i>ccccccc
    </lucky-button>
    <lucky-button type="danger" plain size="small" @click="testBtn">ccccccc</lucky-button>
    <lucky-tag closable color="success" @click="testBtn" @close="testClose">张三</lucky-tag>
    <lucky-dialog :visible.sync="test" :title="'测试'">
      vasvasva
      <template slot="operate">
        <el-button>aaa</el-button>
        <el-button type="primary">aaaaaa</el-button>
      </template>
    </lucky-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      test: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.luckyMessage()
    this.luckyNotify()
  },
  methods: {
    testBtn () {
      console.log(1111)
    },
    testClose () {
      console.log(2222)
    }
  }
}
</script>

<style lang="scss">
</style>
