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
            'is-disabled': data[currentProps.disabled],
            'is-multiple': multiple
          }"
        >
          <span :class="arrowClasses" @click="handleExpand">
            <i v-if="showArrow" class="iconfont iconln_sanjiaoyou"></i>
          </span>
          <span
            class="easy-tree-label"
            :class="{ 'easy-tree-label-checked': ifCurrentChecked }"
            :title="data[currentProps.label]"
            @click="handleSelect"
          >
            <slot name="listItem" :listItem="data">
              <span
                v-html="filterShowName(data[currentProps.label], searchValue)"
              ></span>
            </slot>
            <!-- <span v-html="filterShowName(data[currentProps.label], searchValue)"></span> -->
          </span>
          <i
            v-if="ifCurrentChecked && multiple"
            class="iconfont iconxuanzhong tree-node-checked-icon"
          ></i>
        </div>
        <template v-if="data.expand">
          <Tree-node
            v-for="(item, i) in children"
            :key="i"
            :appear="appearByClickArrow"
            :data="item"
            :multiple="multiple"
            :default-props="currentProps"
            :checked-values="checkedValues"
            :search-value="searchValue"
          >
            <template #listItem="{ listItem }">
              <slot name="listItem" :listItem="listItem"></slot>
            </template>
          </Tree-node>
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
    currentProps() {
      let props = {
        label: 'label',
        value: 'value',
        children: 'children',
        disabled: 'disabled'
      }
      return { ...props, ...this.defaultProps }
    },
    arrowClasses() {
      return [
        'easy-tree-arrow',
        {
          ['easy-tree-arrow-disabled']: this.data[this.currentProps.disabled],
          ['easy-tree-arrow-open']: this.data.expand
        }
      ]
    },
    showArrow() {
      return (
        (this.data[this.currentProps.children] &&
          this.data[this.currentProps.children].length) ||
        ('loading' in this.data && !this.data.loading)
      )
    },
    children() {
      return this.data[this.currentProps.children]
    },
    ifCurrentChecked() {
      return (
        this.checkedValues.findIndex(
          item => item == this.data[this.currentProps.value]
        ) > -1
      )
    }
  },
  methods: {
    handleExpand() {
      const item = this.data
      // if (item.disabled) return;

      // Vue.js 2.6.9 对 transition 的 appear 进行了调整，导致 iView 初始化时无动画，加此方法来判断通过点击箭头展开时，加 appear，否则初始渲染时 appear 为 false
      this.appearByClickArrow = true

      if (
        item[this.currentProps.children] &&
        item[this.currentProps.children].length
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
