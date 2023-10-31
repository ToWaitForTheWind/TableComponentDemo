<template>
  <div class="test">
    <el-button @click="toOpenMessage">open</el-button>
  </div>
</template>

<script>
import showDemoDialog from '@/components/plugin/demo.js'
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
    toOpenMessage() {
      showDemoDialog()
    },
  },
}
</script>

<style lang="scss"></style>
