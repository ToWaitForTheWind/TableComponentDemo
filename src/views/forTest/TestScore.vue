<template>
  <div class="test_score">
    <div class="score_item" v-for="i in 5" :key="i" @click="toScore(i)">
      <img class="bg" :src="bg_point" alt="" />
      <img class="rate" v-if="score >= i" :src="scoreImgMap[score]" alt="" />
    </div>
  </div>
</template>

<script>
const one_point = require('../../assets/one_point.png')
const two_point = require('../../assets/two_point.png')
const three_point = require('../../assets/three_point.png')
const four_point = require('../../assets/four_point.png')
const five_point = require('../../assets/five_point.png')
const bg_point = require('../../assets/bg_point.png')
export default {
  components: {},
  props: {},
  data() {
    return {
      score: 0,
      scoreImgMap: {
        1: one_point,
        2: two_point,
        3: three_point,
        4: four_point,
        5: five_point
      },
      bg_point: bg_point
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    toScore(index) {
      this.score = index
    }
  }
}
</script>

<style lang="scss">
.test_score {
  display: flex;
  img {
    width: 100px;
    height: 100px;
  }
  .score_item {
    position: relative;
    & + .score_item {
      margin-left: 20px;
    }
  }
  .rate {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
