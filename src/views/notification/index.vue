<template>
  <div>
    <lucky-special-input v-model="value1" size="small" :valueLimit="valueLimit"></lucky-special-input>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      test: false,
      value1: 'aaaa',
      valueLimit: '0123456789a'
    }
  },
  computed: {},
  watch: {
    value1: (val) => {
      // console.log(val)
    }
  },
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
