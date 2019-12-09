<template>
  <div class="test1">
    <TestMdEditor v-model="operateForm.editor"></TestMdEditor>
    <lucky-button @click="toClick">click</lucky-button>
  </div>
</template>

<script>
import TestMdEditor from './TestMdEditor'
export default {
  components: { TestMdEditor },
  props: {},
  data() {
    return {
      operateForm: {
        editor: 'aaa'
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    toClick() {
      console.log(this.operateForm.editor)
    }
  }
}
</script>

<style lang="scss"></style>
