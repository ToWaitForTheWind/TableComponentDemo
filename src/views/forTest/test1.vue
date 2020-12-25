<template>
  <div class="test" id="aaa">
    <el-button @click="toTest">测试请求取消功能</el-button>
  </div>
</template>

<script>
import { getUserList } from '@/api/test'
export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async toTest() {
      let res
      res = await getUserList({}, { loadingOptions: { target: '#aaa' } })
      if (res) {
      }
    }
  }
}
</script>

<style lang="scss"></style>
