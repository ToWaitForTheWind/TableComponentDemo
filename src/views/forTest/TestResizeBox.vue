<template>
  <div class="stretching-column">
    <div class="left">
      <div class="resize-bar"></div>
      <div class="resize-line"></div>
      <div class="true-left"></div>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
export default {
  mounted() {},
  methods: {}
}
</script>
<style lang="scss">
.stretching-column {
  height: 300px;
  display: flex;
  .left {
    position: relative;
    width: max-content;
    height: 100%;
  }
  .right {
    width: 100%;
    height: 100%;
    word-break: break-all;
  }
}
.resize-bar {
  overflow: scroll;
  width: 100%;
  height: 100%;
  opacity: 0;
  resize: horizontal;
  min-width: 250px;
  max-width: 550px;
  &::-webkit-scrollbar {
    width: 100%;
    height: 100%;
  }
  &:hover,
  &:active {
    & ~ .resize-line {
      background: transparent;
      border-left: 1px solid #000;
      border-right: 1px solid #000;
    }
  }
}
.resize-line {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #000;
  border-left: 1px solid #ffffff;
  border-right: 1px solid #ffffff;
  pointer-events: none;
}
.true-left {
  position: absolute;
  left: 0;
  right: 3px;
  top: 0;
  bottom: 0;
  word-break: break-all;
  overflow-x: hidden;
}
</style>
