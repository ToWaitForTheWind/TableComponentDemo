<template>
  <div class="lq-table">
    <div class="lq-table-content">
      <div
        class="lq-table-header"
        :class="{ 'is-sorting': isSorting }"
        :style="headerStyle"
      >
        <div
          class="lq-table-checkbox"
          :class="{ 'if-show': (checkAll || indeterminate) && !isSorting }"
        >
          <Checkbox
            v-model="checkAll"
            :indeterminate="indeterminate"
            size="small"
            @on-change="handleCheckAll"
          ></Checkbox>
        </div>
        <div
          v-for="(item, index) in thead"
          :key="index"
          class="header-item"
          :class="{ 'can-sort': item.sortable && !isSorting }"
          :style="currenyItemStyle(item)"
          @click="toSort(item)"
        >
          <div v-if="index === 0 && checkedList.length > 0 && !isSorting">
            <span>已选 {{ checkedList.length }} 项</span>
          </div>
          <div v-else class="row-name">
            <span>{{ item.label }}</span>
            <i
              v-show="item.sortable && !isSorting"
              class="iconfont sort-icon"
              :class="{
                'iconxia-copy1':
                  sortInfo.status === 'ASC' && sortInfo.prop === item.prop,
                iconxia1:
                  sortInfo.status === 'DESC' && sortInfo.prop === item.prop,
                'iconpaixumoren-2':
                  !sortInfo.status || sortInfo.prop !== item.prop,
              }"
            ></i>
          </div>
        </div>
      </div>
      <div class="lq-table-body">
        <CheckboxGroup
          v-model="checkedList"
          size="small"
          @on-change="checkedChange"
        >
          <LqVirtualList
            :data-list="currentDataList"
            :show-number="10"
            :item-height="60"
            :use-virtual-scroll="useVirtualScroll"
            class="small-scroll-bar"
          >
            <template #listItem="{ listItem, listIndex }">
              <div
                class="body-item"
                :class="{
                  'can-drag': isSorting,
                  'if-checked': checkedList.includes(
                    listItem[currentProps.value],
                  ),
                  isDragging: isDragging && toFindIfDragging(listItem),
                }"
                :style="`grid-template-columns: ${cellWidth};`"
                @mousedown="e => onDragStart(e, listIndex)"
                @mouseup="onDragEnd"
                @mouseover="e => onHover(e, listIndex)"
              >
                <div class="lq-table-checkbox">
                  <Checkbox
                    :key="listItem[currentProps.value]"
                    :label="listItem[currentProps.value]"
                  >
                    <span v-show="false">
                      {{ listItem[currentProps.value] }}
                    </span>
                  </Checkbox>
                </div>
                <div
                  v-for="(hItem, hIndex) in thead"
                  :key="hIndex"
                  class="data-cell-item"
                  :style="currenyItemStyle(hItem)"
                >
                  <div class="omit-box">
                    <slot :name="hItem.prop" :dataItem="listItem">
                      <lq-tooltip
                        v-if="hItem.showTooltip"
                        :content="listItem[hItem.prop]"
                        placement="top-start"
                        :open-delay="currentConfig.tooltipDelay"
                      >
                        <span>{{ listItem[hItem.prop] }}</span>
                      </lq-tooltip>
                      <span v-else>{{ listItem[hItem.prop] }}</span>
                    </slot>
                  </div>
                </div>
                <div v-if="isSorting" class="data-cell-item drag-item">
                  <i class="iconfont icontuozhuai-2"></i>
                </div>
              </div>
            </template>
          </LqVirtualList>
        </CheckboxGroup>
      </div>
    </div>
    <div class="lq-table-footer">
      <LqPagination v-on="$listeners" v-bind="$attrs"></LqPagination>
    </div>
    <div v-if="showMultiOperate" class="bottom-config">
      <div
        v-for="(item, index) in operateConfig"
        :key="index"
        class="operate-item"
        @click="toEmitOperate(item.funcName)"
      >
        <i class="iconfont" :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </div>
    </div>
    <div v-if="isSorting" class="bottom-config">
      <div v-if="isMessage" class="operate-item" style="opacity: 1;">
        拖拽列表内容改变顺序
      </div>
      <template v-else>
        <div class="operate-item" @click="toSaveSort">
          <i class="iconfont iconwancheng"></i>
          <span>保存</span>
        </div>
        <div class="operate-item" @click="toCancelSort">
          <span>取消</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { dragMixins } from './dragMixins'
import { cloneDeep } from 'lodash-es'
export default {
  components: {},
  mixins: [dragMixins],
  props: {
    thead: { type: Array, default: () => [] }, // 表头数据
    dataList: { type: Array, default: () => [] }, // 表格主体数据
    defaultProps: { type: Object, default: () => {} }, // 可以选择性设置，不要求全部传递
    basicConfig: { type: Object, default: () => {} }, // 可以选择性设置，不要求全部传递
    isSorting: { type: Boolean, default: false }, // 是否处于排序状态
    operateConfig: { type: Array, default: () => [] }, // 批量操作的配置
  },
  data() {
    return {
      currentDataList: [],
      sortInfo: {},
      checkedList: [], // 选中项key值
      checkAll: false,
      showMessageTimer: null,
      isMessage: false, // 由于拖拽排序刚出来要显示5s message，隐藏添加标识控制
    }
  },
  computed: {
    currentConfig() {
      let config = {
        useVirtualScrollNumber: 20, // 使用虚拟滚动的临界值
        tooltipDelay: 500, // tooltip的延时展示
        useHeaderSticky: false, // 是否表头吸顶
        headerStickyOffset: 0, // 吸顶相对偏移量
      }
      return { ...config, ...this.basicConfig }
    },
    currentProps() {
      let props = {
        value: 'value',
      }
      return { ...props, ...this.defaultProps }
    },
    // 当设置表头吸顶的时候需要特殊样式
    headerStyle() {
      let res = `grid-template-columns: ${this.cellWidth};`
      if (this.currentConfig.useHeaderSticky)
        res += ` position: sticky; top: ${
          this.currentConfig.headerStickyOffset
        }px;`
      return res
    },
    // 根据表头传入的width计算每一列宽度
    cellWidth() {
      let res = '22px '
      this.thead.forEach(head => {
        if (head.width) {
          res += `${head.width}px `
        } else res += '1fr '
      })
      if (this.isSorting) res += '48px'
      return res.trim()
    },
    // 根据表头信息判断判断是否有悬浮列
    // 如果有悬浮列则要求传入的每一列必要设置width
    ifHaveColSticky() {
      let res = false
      this.thead.forEach(head => {
        if (head.sticky) res = true
      })
      return res
    },
    // 非全选状态的CheckBox
    indeterminate() {
      if (
        this.checkedList.length > 0 &&
        this.checkedList.length < this.currentDataList.length
      )
        return true
      else return false
    },
    useVirtualScroll() {
      return this.dataList.length > this.currentConfig.useVirtualScrollNumber
    },
    // 是否展示多选操作项
    showMultiOperate() {
      let res = false
      if (
        !this.isSorting &&
        this.checkedList.length > 0 &&
        this.operateConfig.length > 0
      )
        res = true
      return res
    },
  },
  watch: {
    dataList: {
      handler() {
        this.initData()
      },
      deep: true,
    },
    isSorting(val) {
      this.checkedList = []
      this.checkAll = false
      if (val) {
        this.isMessage = true
        clearTimeout(this.showMessageTimer)
        this.showMessageTimer = null
        this.showMessageTimer = setTimeout(() => {
          this.isMessage = false
        }, 3000)
      }
    },
  },
  created() {},
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.currentDataList = cloneDeep(this.dataList)
    },
    // 点击排序触发
    toSort(item) {
      if (this.sortInfo.prop !== item.prop) {
        this.$set(this.sortInfo, 'prop', item.prop)
        this.$set(this.sortInfo, 'status', 'ASC')
      } else {
        let currentSortStatus = this.sortInfo.status
        if (!currentSortStatus) currentSortStatus = 'ASC'
        else if (currentSortStatus === 'ASC') currentSortStatus = 'DESC'
        else currentSortStatus = ''
        this.$set(this.sortInfo, 'status', currentSortStatus)
      }
      this.$emit('handleSort', this.sortInfo)
    },
    // 点击全选触发
    handleCheckAll() {
      this.$nextTick(() => {
        if (this.checkAll) {
          this.checkedList = this.currentDataList.map(
            item => item[this.currentProps.value],
          )
        } else {
          this.checkedList = []
        }
      })
    },
    checkedChange() {
      if (this.checkedList.length === this.currentDataList.length)
        this.checkAll = true
      else this.checkAll = false
    },
    toEmitOperate(funcName) {
      this.$emit(funcName, this.checkedList)
    },
    toSaveSort() {
      this.$emit('toSaveSort', cloneDeep(this.currentDataList))
      this.$emit('update:isSorting', false)
      this.checkedList = []
    },
    toCancelSort() {
      this.$emit('toCancelSort')
      this.$emit('update:isSorting', false)
      this.initData()
      this.checkedList = []
    },
    // 计算悬浮列的偏移量并设置style
    currenyItemStyle(item) {
      if (!item.sticky) return ''
      let offset = 22 // 初始偏移量（左侧CheckBox的宽度）
      for (let i = 0; i < this.thead.length; i++) {
        if (this.thead[i].prop === item.prop) break
        else if (this.thead[i].width) offset += this.thead[i].width
      }
      return `position: sticky; left: ${offset}px;`
    },
  },
}
</script>

<style lang="scss" scoped>
.lq-table {
  position: relative;

  .lq-table-content {
    overflow: auto;
  }

  .lq-table-header {
    display: grid;
    font-size: 12px;
    line-height: 20px;
    color: #6e7386;
    font-weight: bold;
    height: 40px;

    &:hover {
      .lq-table-checkbox {
        .ivu-checkbox-wrapper {
          opacity: 1;
        }
      }
    }
  }

  .is-sorting {
    &:hover {
      .lq-table-checkbox {
        .ivu-checkbox-wrapper {
          opacity: 0;
        }
      }
    }
  }

  .header-item {
    padding: 0 16px;
    display: flex;
    align-items: center;
    background-color: #fff;
  }

  .can-sort {
    padding-left: 8px;

    .row-name {
      cursor: pointer;
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;

      &:hover {
        background: #f5f5f5;
      }
    }
  }

  .sort-icon {
    font-size: 12px;
    color: #979aa8;
    font-weight: normal;
  }

  .body-item {
    display: grid;
    font-size: 12px;
    line-height: 20px;
    color: #7b7e8c;
    border-bottom: 1px solid #f2f4f9;
    height: 60px;

    &.if-checked,
    &:hover {
      .lq-table-checkbox {
        background: #f9fafe;

        .ivu-checkbox-wrapper {
          opacity: 1;
        }
      }

      .data-cell-item {
        background: #f9fafe;
      }

      .drag-item {
        opacity: 1;
      }
    }

    &.isDragging {
      opacity: 0.6;
    }
  }

  .drag-item {
    opacity: 0;
  }

  .data-cell-item {
    padding: 0 16px;
    display: flex;
    align-items: center;
    overflow: hidden;
    background-color: #fff;
  }

  .lq-table-checkbox {
    position: sticky;
    left: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;

    .ivu-checkbox-wrapper {
      opacity: 0;
    }
  }

  .if-show {
    opacity: 1;
  }

  .lq-table-footer {
    display: flex;
    justify-content: flex-end;
    height: 90px;
  }

  .ivu-checkbox-wrapper {
    margin-right: 0;
    margin-left: 8px;
    line-height: 14px;
  }

  .can-drag {
    cursor: all-scroll;
  }

  .bottom-config {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(21, 21, 35, 0.9);
    border-radius: 4px;
    display: flex;
    align-items: center;

    .operate-item {
      text-align: center;
      color: #fff;
      font-size: 12px;
      padding: 10px 20px;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }

      & + .operate-item {
        border-left: 1px solid rgba(255, 255, 255, 0.16);
      }

      .iconfont {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }

  .omit-box {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
