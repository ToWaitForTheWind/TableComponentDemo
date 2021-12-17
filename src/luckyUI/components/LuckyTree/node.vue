<template>
  <collapse-transition :appear="appear">
    <ul class="easy-tree-children">
      <li
        @contextmenu.stop="handleContextmenu(data, $event)"
        @selectstart.stop="handlePreventSelect(data, $event)"
      >
        <div
          class="node-item"
          :class="{
            'is-disabled': data[defaultProps.disabled],
            'is-multiple': multiple
          }"
        >
          <span :class="arrowClasses" @click="handleExpand">
            <i v-if="showArrow" class="iconfont iconln_sanjiaoyou"></i>
          </span>
          <span
            class="easy-tree-label"
            :class="{ 'easy-tree-label-checked': ifCurrentChecked }"
            :title="data[defaultProps.label]"
            @click="handleSelect"
          >
            <slot name="listItem" :listItem="data">
              <span
                v-html="filterShowName(data[defaultProps.label], searchValue)"
              ></span>
            </slot>
          </span>
          <i
            v-if="multiple"
            :class="{ 'is-show': ifCurrentChecked }"
            class="iconfont iconxuanzhong tree-node-checked-icon"
          ></i>
        </div>
        <template v-if="data.expand">
          <template v-for="(item, i) in children">
            <Tree-node
              v-if="!item[defaultProps.delete]"
              :key="i"
              :appear="appearByClickArrow"
              :data="item"
              :multiple="multiple"
              :default-props="defaultProps"
              :checked-values="checkedValues"
              :search-value="searchValue"
            >
              <template #listItem="{ listItem }">
                <slot name="listItem" :listItem="listItem"></slot>
              </template>
            </Tree-node>
          </template>
        </template>
      </li>
    </ul>
  </collapse-transition>
</template>
<script>
import CollapseTransition from './utils/collapse-transition'
import Emitter from './mixins/emitter'

export default {
  name: 'TreeNode',
  components: { CollapseTransition },
  mixins: [Emitter],
  props: {
    data: { type: Object, default: () => {} },
    multiple: { type: Boolean, default: false },
    defaultProps: { type: Object, default: () => {} }, // 可以选择性设置，不要求全部传递
    appear: { type: Boolean, default: false },
    checkedValues: { type: Array, default: () => [] }, // 当前选中项
    searchValue: { type: String, default: '' } // 筛选字段
  },
  data() {
    return {
      appearByClickArrow: false
    }
  },
  computed: {
    arrowClasses() {
      return [
        'easy-tree-arrow',
        {
          ['easy-tree-arrow-disabled']: this.data[this.defaultProps.disabled],
          ['easy-tree-arrow-open']: this.data.expand
        }
      ]
    },
    showArrow() {
      return (
        (this.data[this.defaultProps.children] &&
          this.data[this.defaultProps.children].length) ||
        ('loading' in this.data && !this.data.loading)
      )
    },
    children() {
      return this.data[this.defaultProps.children]
    },
    ifCurrentChecked() {
      return (
        this.checkedValues.findIndex(
          item => item == this.data[this.defaultProps.value]
        ) > -1
      )
    }
  },
  methods: {
    handleExpand() {
      const item = this.data
      this.appearByClickArrow = true

      if (
        item[this.defaultProps.children] &&
        item[this.defaultProps.children].length
      ) {
        this.$set(this.data, 'expand', !this.data.expand)
        this.dispatch('Tree', 'toggle-expand', this.data)
      }
    },
    handleSelect() {
      this.dispatch('Tree', 'on-checked', this.data.easyNodeKey)
    },
    handleContextmenu(data, event) {
      if (data.contextmenu) {
        event.preventDefault()
        this.dispatch('Tree', 'contextmenu', { data, event })
      }
    },
    handlePreventSelect(data, event) {
      if (data.contextmenu) {
        event.preventDefault()
      }
    },
    // 高亮筛选字段
    filterShowName(val, searchKey) {
      if (!searchKey || !val) return val
      let keyValueCopy = searchKey
      // 一些特殊符号，需要进行转义，如| 要转成\|
      keyValueCopy = keyValueCopy
        .replace(/(\||\\|\^|\/|\$|\*|\+|\?)/, $ => `\\${$}`)
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
      let reg = new RegExp(keyValueCopy, 'g')
      return String(val).replace(
        reg,
        `<span class='danger-color'>${searchKey}</span>`
      )
    }
  }
}
</script>
