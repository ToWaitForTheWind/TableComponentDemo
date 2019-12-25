<template>
  <div class="stretching-column">
    <lucky-lazy-select v-model="testValue" :getOptionFunc="getOptionFunc" @change="handleChange"></lucky-lazy-select>
    <lucky-button @click="toTest">test</lucky-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      testValue: ''
    }
  },
  mounted () {},
  mounted () {},
  methods: {
    handleChange (val) {
      console.log(val)
    },
    toTest () {
      console.log(this.testValue)
    },
    getOptionFunc () {}
  }
}
</script>
<style lang="scss"></style>
