<template>
  <div class="regexp-test">
    <div class="left">
      <div class="item">
        <label>正则表达式</label>
        <el-input v-model="regexp" placeholder="请输入正则表达式"></el-input>
        <el-button type="primary" @click="toTest('test')">test</el-button>
        <el-button type="primary" @click="toTest('exec')">exec</el-button>
      </div>
      <div class="item">
        <label>测试字符串</label>
        <el-input v-model="testValue" placeholder="请输入测试字符串"></el-input>
        <el-button type="primary" @click="toTest('match')">match</el-button>
      </div>
    </div>
    <div class="right">
      {{ res }}
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      regexp: '',
      testValue: '',
      res: ''
    };
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    toTest (type) {
      if (!this.regexp) {
        this.$message({ message: '正则表达式不能为空', type: 'warning' })
        return
      }
      if (!this.testValue) {
        this.$message({ message: '测试字符串不能为空', type: 'warning' })
        return
      }
      let reg = new RegExp(this.regexp)
      if (type === 'test') {
        this.res = reg.test(this.testValue)
      } else if (type === 'exec') {
        this.res = reg.exec(this.testValue)
      } else if (type === 'match') {
        this.res = this.testValue.match(reg)
      }
    }
  },
};
</script>

<style lang="scss">
.regexp-test {
  display: flex;
  .left {
    width: 50%;
  }
  .right {
    width: 50%;
  }
}
</style>
