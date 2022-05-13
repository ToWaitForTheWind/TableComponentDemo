<template>
  <div class="lucky-drag">
    <div
      class="lucky-drag-item"
      v-for="(item, index) in currentDataList"
      :key="index"
      :class="{ 'is-selected': toFindIfSelected(item) > -1 }"
      draggable
      @dragstart="e => onDragStart(e, index)"
      @drag="e => onDrag(e, index)"
      @dragend="e => onDragEnd(e, index)"
      @dragover="e => onDragOver(e, index)"
      @mousedown="e => onMouseDown(e, index)"
      @click="e => onClick(e, index)"
    >
      <slot name="listItem" :listItem="item"></slot>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash-es'
export default {
  components: {},
  props: {
    value: { type: Array, default: () => [] }, // v-model绑定的值
    defaultProps: { type: Object, default: () => {} } // 可以选择性设置，不要求全部传递
  },
  data() {
    return {
      currentDataList: [],
      selectedList: [],
      dragItem: {}
    }
  },
  computed: {
    currentProps() {
      let props = {
        value: 'value',
        disabled: 'disabled', // 下拉节点置灰不可选
        canNotSelect: 'canNotSelect' // 下拉节点正常显示，但是不可选
      }
      return { ...props, ...this.defaultProps }
    }
  },
  watch: {
    value: {
      handler() {
        this.initData()
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.currentDataList = cloneDeep(this.value)
    },
    toEmitValue() {
      // 修改双向绑定的值
      this.$emit('input', cloneDeep(currentDataList))
    },
    onDragStart(e, index) {
      this.dragItem = this.currentDataList[index]
      this.startIndex = index
    },
    onDrag(e) {
      console.log(e)
    },
    onDragEnd(e) {
      this.dragItem = null
      this.startIndex = -1
    },
    onDragOver(e, index) {
      let hoverItem = this.currentDataList[index]
      if (
        this.dragItem[this.currentProps.value] ===
        hoverItem[this.currentProps.value]
      )
        return
      let findIndex = this.toFindIfSelected(hoverItem)
      if (findIndex > -1) {
        // hover的是已勾选的
        if (this.startIndex < index) {
          // 从上往下拖拽
          // 位置调换
          this.removeSelectedData()
          this.currentDataList.splice(index, 0, ...this.selectedList)
        } else if (this.startIndex > index) {
          // 从下往上拖拽
        }
      } else {
        // hover的是未勾选的
        if (this.startIndex < index) {
          // 从上往下拖拽
        } else if (this.startIndex > index) {
          // 从下往上拖拽
        }
      }
      // if (
      //   // findIndex === -1 &&
      //   this.dragItem[this.currentProps.value] !==
      //   hoverItem[this.currentProps.value]
      // ) {
      //   let domHeight = e.target.offsetHeight
      //   if (this.startIndex < index) {
      //     // 从上往下拖拽
      //     if (e.offsetY > domHeight / 2) {
      //       // 位置调换
      //       this.removeSelectedData()
      //       let indexAfterDelete = this.currentDataList.findIndex(
      //         item =>
      //           item[this.currentProps.value] ===
      //           hoverItem[this.currentProps.value]
      //       )
      //       this.currentDataList.splice(
      //         ++indexAfterDelete,
      //         0,
      //         ...this.selectedList
      //       )
      //       this.startIndex =
      //         indexAfterDelete + this.toFindIfSelected(this.dragItem)
      //     }
      //   } else if (this.startIndex > index) {
      //     // 从下往上拖拽
      //     if (e.offsetY < domHeight / 2) {
      //       // 位置调换
      //       this.removeSelectedData()
      //       let indexAfterDelete = this.currentDataList.findIndex(
      //         item =>
      //           item[this.currentProps.value] ===
      //           hoverItem[this.currentProps.value]
      //       )
      //       this.currentDataList.splice(
      //         indexAfterDelete,
      //         0,
      //         ...this.selectedList
      //       )
      //       this.startIndex =
      //         indexAfterDelete + this.toFindIfSelected(this.dragItem)
      //     }
      //   }
      // }
    },
    onMouseDown(e, index) {},
    toFindIfSelected(item) {
      let findIndex = this.selectedList.findIndex(
        data => data[this.currentProps.value] == item[this.currentProps.value]
      )
      return findIndex
    },
    onClick(e, index) {
      if (e.button === 0 && e.ctrlKey) {
        // 左键 + ctrl
        let findIndex = this.toFindIfSelected(this.currentDataList[index])
        if (findIndex > -1) {
          this.selectedList.splice(findIndex, 1)
        } else this.selectedList.push({ ...this.currentDataList[index], index })
      } else {
        this.selectedList = []
        this.selectedList.push({ ...this.currentDataList[index], index })
      }
      this.selectedList.sort((a, b) => a.index - b.index) // 排序
    },
    removeSelectedData() {
      this.selectedList.forEach(item => {
        let findIndex = this.currentDataList.findIndex(
          data => data[this.currentProps.value] == item[this.currentProps.value]
        )
        if (findIndex > -1) this.currentDataList.splice(findIndex, 1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.lucky-drag {
  .is-selected {
    border: 1px solid red;
  }
}
</style>
