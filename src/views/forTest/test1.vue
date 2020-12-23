<template>
  <div class="test">
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
      res = await getUserList()
      if (res) {
      }
    }
  }
}
</script>

<style lang="scss"></style>
