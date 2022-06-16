<template>
  <div
    :ref="`listContainer${randomNum}`"
    class="lucky-virtual-list"
    :class="{ 'use-virtual-scroll': useVirtualScroll }"
    :style="
      `height: ${(dataList.length > showNumber ? showNumber : dataList.length) *
        itemHeight}px;`
    "
  >
    <div
      v-if="useVirtualScroll"
      class="scroll-blank"
      :style="`height: ${dataList.length * itemHeight}px;`"
    ></div>
    <div
      class="scroll-data"
      :style="useVirtualScroll ? `margin-top: ${positionTop}px;` : ''"
    >
      <div
        v-for="(item, index) in useVirtualScroll ? activeList : dataList"
        :key="index"
        class="scroll-item"
        :style="`height: ${itemHeight}px;`"
      >
        <slot
          name="listItem"
          :listItem="item"
          :listIndex="useVirtualScroll ? index + startNum : index"
        ></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    showNumber: { type: Number, default: 8 }, // 当前视窗展示条数
    itemHeight: { type: Number, default: 20 }, // 每一条内容的高度
    dataList: { type: Array, default: () => [] },
    useVirtualScroll: { type: Boolean, default: false },
  },
  data() {
    return {
      startNum: 0, // 当前视窗范围内第一个元素下标
      positionTop: 0, // 当前视窗范围内第一个元素偏移量
      randomNum: '', // 一个随机数
    }
  },
  computed: {
    activeList() {
      const start = this.startNum
      return this.dataList.slice(start, start + this.showNumber)
    },
  },
  watch: {},
  created() {
    this.randomNum = Math.random()
  },
  mounted() {
    this.$refs[`listContainer${this.randomNum}`].addEventListener(
      'scroll',
      this.scrollEvent,
    )
  },
  beforeDestroyed() {
    this.$refs[`listContainer${this.randomNum}`].removeEventListener('scroll')
  },
  methods: {
    scrollEvent(event) {
      const { scrollTop } = event.target
      this.startNum = parseInt(scrollTop / this.itemHeight)
      this.positionTop = scrollTop
    },
  },
}
</script>

<style lang="scss" scoped>
.lucky-virtual-list {
  display: flex;

  &.use-virtual-scroll {
    overflow-y: auto;
  }

  .scroll-data {
    width: 100%;
  }
}
</style>
