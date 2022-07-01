<template>
  <div class="home_page">
    <div
      class="test-event"
      @click="onClick"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    ></div>
  </div>
</template>

<script>
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
    onClick() {
      console.log('onClick')
    },
    onMouseDown() {
      console.log('onMouseDown')
    },
    onMouseUp() {
      console.log('onMouseUp')
    },
  },
}
</script>

<style lang="scss">
.test-event {
  width: 100px;
  height: 100px;
  background-color: cyan;
}
</style>
