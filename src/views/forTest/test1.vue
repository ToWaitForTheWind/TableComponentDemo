<template>
  <div class="test">
    <LuckyTableBetter></LuckyTableBetter>
    <el-button @click="toOpenMessage">open</el-button>
    <el-button @click="toCloseMessage">close</el-button>
  </div>
</template>

<script>
import LuckyTableBetter from '@/luckyUI/components/LuckyTableBetter'
export default {
  components: { LuckyTableBetter },
  props: {},
  data() {
    return {
      message: null
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    toOpenMessage() {
      this.message = this.$message({
        message: '这是一条消息提示',
        duration: 0
      })
    },
    toCloseMessage() {
      this.message.close()
    }
  }
}
</script>

<style lang="scss"></style>
