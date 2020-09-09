<template>
  <div class="test_resize_new">
    <div class="left_part" id="left_part">
      <slot name="left"></slot>
    </div>
    <div id="devided_line"></div>
    <div class="right_part" id="right_part">
      <slot name="right"></slot>
    </div>
    <slot name="main"></slot>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    minWidth: { type: Number, default: 333 }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.moveFun()
  },
  methods: {
    moveFun() {
      let that = this
      let leftPart = document.getElementById('left_part')
      let devidedLine = document.getElementById('devided_line')
      let rightPart = document.getElementById('right_part')
      devidedLine.onmousedown = function(ev) {
        let iEvent = ev || event
        let dx = iEvent.clientX //当你第一次单击的时候，存储x轴的坐标。//相对于浏览器窗口
        let leftWidth = leftPart.offsetWidth
        let rightWidth = rightPart.offsetWidth
        document.onmousemove = function(ev) {
          let iEvent = ev || event
          let diff = iEvent.clientX - dx //移动的距离（向左滑时为负数,右滑时为正数）
          if (that.minWidth < leftWidth + diff && that.minWidth < rightWidth - diff) {
            //两个div的最小宽度均为100px
            leftPart.style.width = leftWidth + diff + 'px'
            rightPart.style.width = rightWidth - diff + 'px'
          }
        }
        document.onmouseup = function() {
          document.onmousedown = null
          document.onmousemove = null
        }
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.test_resize_new {
  height: 100%;
  .left_part {
    float: left;
    height: 100%;
    width: 30%;
    background-color: rgb(123, 231, 235);
    resize: horizontal;
    box-sizing: border-box;
  }
  .right_part {
    float: left;
    height: 100%;
    width: calc(70% - 5px);
    background-color: coral;
    box-sizing: border-box;
  }
  #devided_line {
    width: 5px;
    height: 100%;
    background-color: black;
    float: left;
    cursor: e-resize;
  }
}
</style>
