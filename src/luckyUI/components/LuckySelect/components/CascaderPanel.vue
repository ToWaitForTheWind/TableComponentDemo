<template>
  <div class="lucky-cascader-panel">
    <div
      class="lucky-cascader-data small-scroll-bar"
      :style="
        `${
          list.length > currentConfig.dropdownMaxLength ? 'width: 139px;' : ''
        } height: ${27 * currentConfig.dropdownMaxLength}px;`
      "
    >
      <template v-for="(item, index) in list">
        <div
          v-if="!item[currentProps.delete]"
          class="lucky-cascader-item"
          :class="[
            {
              'is-checked': ifChecked(item),
              'is-disabled': isDisabled(item),
              'is-hover': isHover(item)
            },
            item[currentProps.className]
          ]"
          :key="index"
          :title="item[currentProps.label]"
          @click.stop="handleClickItem(item)"
          @mouseenter.stop="handleHoverItem(item)"
        >
          <div class="data-label">
            <slot name="listItem" :listItem="item">
              <span v-if="!searchValue">{{ item[currentProps.label] }}</span>
              <template v-else>
                <span
                  v-for="(filterItem, filterIndex) in filterShowName(
                    item[currentProps.label],
                    searchValue
                  )"
                  :key="filterIndex"
                  :class="{ 'danger-color': filterItem.type === 'matched' }"
                >
                  {{ filterItem.val }}
                </span>
              </template>
            </slot>
          </div>
          <i v-if="showArrow(item)" class="iconfont iconln_sanjiaoyou"></i>
        </div>
      </template>
    </div>
    <template v-if="nextList.length > 0">
      <div
        class="split-solid-line"
        :style="`height: ${27 * currentConfig.dropdownMaxLength}px;`"
      ></div>
      <CascaderPanel
        :list="nextList"
        :all-data="allData"
        :search-value="searchValue"
        :checked-datas="checkedDatas"
        :parent-nodes="parentNodes"
        :level="level + 1"
        :visible="visible"
        @toEmitChecked="toEmitChecked"
        @changePathInfo="changePathInfo"
      ></CascaderPanel>
    </template>
  </div>
</template>

<script>
export default {
  name: 'CascaderPanel',
  components: {},
  inject: [
    'currentConfig',
    'currentProps',
    'filterShowName',
    'toGetNodeParents'
  ],
  props: {
    list: { type: Array, default: () => [] },
    allData: { type: Array, default: () => [] },
    searchValue: { type: String, default: '' }, // 筛选字段
    checkedDatas: { type: Array, default: () => [] }, // 当前选中项
    parentNodes: { type: Array, default: () => [] }, // 父节点集合
    level: { type: Number, default: 0 }, // 当前处于第几层级
    visible: { type: Boolean, default: false } // 下拉是否展开
  },
  data() {
    return {
      nextList: [],
      currentCheckedItem: {},
      currentHoverItem: {}, // 标记hover
      hoverItems: [] // 标记path的item
    }
  },
  computed: {},
  watch: {
    list: {
      handler() {
        this.nextList = []
        this.currentCheckedItem = {}
        this.currentHoverItem = {}
      },
      deep: true
    },
    visible: {
      handler(val) {
        if (!val) {
          this.nextList = []
          this.currentCheckedItem = {}
          this.currentHoverItem = {}
        } else this.toSetDefault()
      }
    }
  },
  created() {},
  mounted() {
    this.toSetDefault()
  },
  beforeDestroyed() {},
  methods: {
    toSetDefault() {
      if (!this.currentCheckedItem[this.currentProps.value]) {
        if (!this.parentNodes.length || !this.parentNodes[this.level]) return
        if (
          this.list.findIndex(
            item =>
              item[this.currentProps.value] ==
              this.parentNodes[this.level][this.currentProps.value]
          ) > -1
        ) {
          // 切换到其他数据的时候不在parentNodes中就不往下触发
          this.toTriggerNext(this.parentNodes[this.level])
        }
      } else this.toTriggerNext(this.currentCheckedItem)
    },
    handleClickItem(item) {
      if (this.isDisabled(item) || item[this.currentProps.canNotSelect]) return
      // 触发点击有两种情况，一种是触发方式是click，一种是最后一级进行选择
      if (
        this.currentConfig.trigger === 'click' &&
        item[this.currentProps.children] &&
        item[this.currentProps.children].length
      ) {
        this.toTriggerNext(item)
      } else this.handleSelect(item)
    },
    handleHoverItem(item) {
      this.currentHoverItem = item
      if (this.isDisabled(item) || item[this.currentProps.canNotSelect]) return
      if (this.currentConfig.trigger !== 'hover') return
      this.toTriggerNext(item)
    },
    toTriggerNext(item) {
      if (item[this.currentProps.delete]) return // 当前项被删除则不触发下一级展示
      this.currentCheckedItem = item
      this.changePathInfo(item, this.level)
      if (
        item[this.currentProps.children] &&
        item[this.currentProps.children].length
      ) {
        this.nextList = item[this.currentProps.children]
      } else this.nextList = []
    },
    handleSelect(item) {
      if (this.isDisabled(item) || item[this.currentProps.canNotSelect]) return
      if (
        item[this.currentProps.children] &&
        item[this.currentProps.children].length
      )
        return
      this.currentCheckedItem = item
      this.toEmitChecked(item, this.level)
    },
    ifChecked(item) {
      let res = false
      if (
        item[this.currentProps.value] ==
        this.currentCheckedItem[this.currentProps.value]
      )
        res = true
      return res
    },
    isHover(item) {
      let res = false
      if (
        item[this.currentProps.value] ==
        this.currentHoverItem[this.currentProps.value]
      )
        res = true
      return res
    },
    isDisabled(item) {
      // 判断当前节点是否disabled（如果父节点时disabled那个该节点也是disabled）
      let res = false
      if (item[this.currentProps.disabled]) res = true
      this.toGetNodeParents(
        item[this.currentProps.value],
        this.allData
      ).forEach(node => {
        if (node[this.currentProps.disabled]) res = true
      })
      return res
    },
    showArrow(item) {
      return (
        item[this.currentProps.children] &&
        item[this.currentProps.children].length
      )
    },
    toEmitChecked(item, level) {
      this.$emit('toEmitChecked', item, level)
    },
    changePathInfo(item, level) {
      this.$emit('changePathInfo', item, level)
    }
  }
}
</script>

<style lang="scss" scoped>
.lucky-cascader-panel {
  display: flex;

  .lucky-cascader-data {
    overflow: auto;
  }

  .lucky-cascader-item {
    width: 136px;
    height: 27px;
    line-height: 27px;
    display: flex;
    align-items: center;
    padding: 0 22px 0 12px;
    cursor: pointer;
    position: relative;
    color: #262b39;

    .data-label {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex-shrink: 0;
    }

    &.is-checked {
      color: #4084ff;
    }

    &.is-hover {
      background-color: #f6f6f6;
    }

    &.is-disabled {
      color: rgba(25, 34, 74, 0.4);
      cursor: not-allowed;
    }

    .iconln_sanjiaoyou {
      position: absolute;
      right: 10px;
      transition: all 0.2s ease-in;
      transform: scale(0.7);
      font-size: 12px;
      color: #c7ccd4;
    }
  }

  .split-solid-line {
    background-color: #f3f5f8;
    width: 1px;
  }
}
</style>
