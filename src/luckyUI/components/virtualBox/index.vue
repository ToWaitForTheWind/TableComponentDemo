<!--
    * @Author: your name
    * @Date: 2022-01-10 14:12:58
    * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
    * @FilePath: \easybi.front\src\views\Pages\Authority\approvalStrategy\virtual-box\index.vue
-->
<template>
  <section class="virtual-box" :style="virtualBoxStyle">
    <section
      class="virtual-box-fake"
      :style="{
        height: `${dynamic ? dynamicListHeight : data.length * itemSize}px`,
      }"
    ></section>
    <section
      class="virtual-box-true"
      :style="{
        transform: `translate3d(0,${startOffset}px,0)`,
      }"
    >
      <div
        v-for="item in showDataList"
        :id="item._index"
        :key="item._index"
        ref="items"
        class="virtual-box-item"
        :style="virtualBoxItemStyle"
        @click="$emit('click-item', item)"
      >
        <slot name="listItem" :listItem="item">
          {{ item[defaultProps.label] }}
        </slot>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  name: "VirtualBox",
  props: {
    height: {
      //想要的盒子高度 不设置的话就是itemSize *  virtualCount
      type: [Number, String],
      default: 0,
    },
    width: {
      //盒子的宽度 没有设置的话就是100%
      type: [Number, String],
      default: 0,
    },
    maxWidth: {
      //最大宽度
      type: [Number, String],
      default: 0,
    },
    minWidth: {
      //最小宽度
      type: [Number, String],
      default: 0,
    },
    itemSize: {
      //每行的高度
      type: [Number, String],
      default: 0,
    },
    virtualCount: {
      //展示的项数
      type: [Number, String],
      default: 0,
    },
    data: {
      //传入的数据
      type: Array,
      default() {
        return [];
      },
    },
    dynamic: {
      //是否是动态高度盒子
      type: Boolean,
      default() {
        return true;
      },
    },
    estimatedItemSize: {
      //动态高度时的预估高度
      type: Number,
      default() {
        return 40;
      },
    },
    preRenderCount: {
      //预渲染的行数
      type: [Number, String],
      default: 1,
    },
    defaultProps: {
      type: Object,
      default() {
        return {
          label: "label",
          value: "id",
        };
      },
    },
  },
  data() {
    return {
      startOffset: 0, //偏移量
      showCount: 0, //展示的数目
      dynamicListHeight: 0,
    };
  },
  computed: {
    virtualBoxStyle() {
      //盒子整体的样式
      let actualHeight = this.data.length * this.itemSize;
      let maxHeight = this.virtualCount * this.itemSize;
      let userHeight = this.height;
      return this.dynamic
        ? {height: `${actualHeight < maxHeight ? actualHeight : maxHeight}px`}
        : {
            maxHeight: `${userHeight ? userHeight : maxHeight}px`,
            height: `${actualHeight < maxHeight ? actualHeight : maxHeight}px`,
            width: this.width ? `${this.width}px` : "100%",
          };
    },
    virtualBoxItemStyle() {
      //每一行的样式
      return this.dynamic
        ? {}
        : {
            height: this.itemSize ? `${this.itemSize}px` : "100%",
            maxHeight: this.itemSize ? `${this.itemSize}px` : "",
            maxWidth: this.maxWidth ? `${this.maxWidth}px` : "",
            minWidth: this.minWidth ? `${this.minWidth}px` : "",
          };
    },
    showDataList() {
      //展示的列表
      let count = Math.min(this.showCount, this.preRenderCount);
      return this.data
        .map((item, idx) => {
          return {
            _index: idx,
            ...item,
          };
        })
        .slice(
          this.showCount - count,
          parseInt(this.showCount) +
            parseInt(this.virtualCount) +
            parseInt(this.preRenderCount)
        );
    },
  },
  watch: {
    data() {
      //一旦传入的数据发生变化就初始化一下
      this.startOffset = 0;
      this.showCount = 0;
      this.$el.scrollTop = 0;
    },
  },
  created() {
    if (this.dynamic) {

      this.positions = this.data.map((item, index) => {
        return {
          index,
          height: this.estimatedItemSize,
          top: index * this.estimatedItemSize,
          bottom: (index + 1) * this.estimatedItemSize,
        };
      });
       if(this.positions.length){
      this.dynamicListHeight = this.positions[this.positions.length - 1].bottom;}
    }
  },
  mounted() {
    //监听一下盒子的滚动事件
    if(this.dynamic){
    this.updateItemsSize()}
    this.$el.onscroll = (e) => {
      let scrollTop = e.target.scrollTop;
      if(this.dynamic){
         this.showCount = this.getStartIndex(scrollTop)
           console.log(this.showCount)
         this.startOffset =   (this.showCount >= 1 && this.showCount >this.preRenderCount) ? this.positions[this.showCount-this.preRenderCount- 1].bottom : 0;
            console.log(this.startOffset)
      }else{
        this.showCount = Math.floor(scrollTop / this.itemSize);
        let a = Math.min(this.showCount, this.preRenderCount);
      this.startOffset =
        scrollTop - (scrollTop % this.itemSize) - a * this.itemSize;

      }
    };
    this.io = new IntersectionObserver((e) => {
      if (e[0].intersectionRatio === 0) {
        this.startOffset = 0;
        this.showCount = 0;
        this.$el.scrollTop = 0;
      }
    });
    this.io.observe(this.$el);
  },
  updated() {
    if(this.dynamic){
     this.$nextTick(()=>{
         this.updateItemsSize()
     })

    }
  },
  methods: {
    getStartIndex(scrollTop = 0){
      let start = 0;
      let end = this.positions.length - 1;
      let tempIndex = null;
      while (start <= end) {
        let midIndex = parseInt((start + end) / 2);
        let midValue = this.positions[midIndex].bottom;
        if (midValue === scrollTop) {
          return midIndex + 1;
        } else if (midValue < scrollTop) {
          start = midIndex + 1;
        } else if (midValue > scrollTop) {
          if (tempIndex === null || tempIndex > midIndex) {
            tempIndex = midIndex;
          }
          end = end - 1;
        }
      }
      return tempIndex;
    },
    updateItemsSize() {
      let nodes = this.$refs.items;
      if (!nodes?.length) {
        return;
      }
      let diffSum = 0
      nodes.forEach((node) => {
        let { height } = node.getBoundingClientRect();
        let index = Number(node.id);
        let diffHeight = height - this.positions[index].height;
        diffSum += diffHeight;
        //存在差值
        this.positions[index].height = height;
        this.positions[index].bottom = this.positions[index].top + height;
        if (index > 0) {
          this.positions[index].top = this.positions[index - 1].bottom;
          this.positions[index].bottom = this.positions[index].top + height;
        }
      });
      let index = Number(nodes[nodes.length - 1].id);
      for (let k = index + 1; k < this.positions.length; k++) {
        this.positions[k].top += diffSum;
        this.positions[k].bottom += diffSum;
      }
      this.dynamicListHeight = this.positions[this.positions.length - 1].bottom;
    },
  },
  beforeDestroy() {
    this.$el.onscroll = null;
    this.io.unobserve(this.$el);
    this.io.disconnect();
  },
};
</script>

<style scoped lang="scss" >
@import "./index.scss";
</style>
