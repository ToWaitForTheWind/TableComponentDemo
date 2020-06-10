<template>
  <LuckyRuleInput v-model="value" limitType="custom" :limitValue="formatFunc" size="small"></LuckyRuleInput>
</template>

<script>
export default {
  data() {
    return {
      value: ''
    }
  },
  watch: {
    value (val) {
      console.log(val)
    }
  },
  created() {},
  mounted() {},
  methods: {
    formatFunc (aaa) {
      let valArr = aaa.split('')
      let resStr = ''
      valArr.forEach(item => {
        if (item !== 'a') resStr += item
      })
      return resStr
    }
  },
}
</script>
<style lang="scss">
.test1 {
  widows: 400px;
  height: 400px;
}
</style>
