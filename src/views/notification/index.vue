<template>
  <div>
    <lucky-content-layout :projectName="'项目名称'"></lucky-content-layout>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      test: false,
      value1: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    // this.luckyMessage()
    // this.luckyNotify()
  },
  methods: {
    testBtn () {
      console.log(1111)
    },
    testClose () {
      console.log(2222)
    },
    testDiv () {
      console.log(333)
    }
  }
}
</script>

<style lang="scss">
</style>
