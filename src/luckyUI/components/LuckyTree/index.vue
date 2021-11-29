<template>
  <div class="easy-tree" ref="treeWrap">
    <Tree-node
      v-for="(item, i) in stateTree"
      :key="i"
      :data="item"
      visible
      :multiple="multiple"
      :default-props="currentProps"
      :checked-values="checkedValues"
      :search-value="searchValue"
    >
      <template #listItem="{ listItem }">
        <slot name="listItem" :listItem="listItem"></slot>
      </template>
    </Tree-node>
    <div v-if="!stateTree.length" class="ivu-tree-empty">
      {{ emptyText }}
    </div>
  </div>
</template>

<script>
import TreeNode from './node.vue'
import Emitter from './mixins/emitter'
import _ from 'lodash'

export default {
  name: 'Tree',
  components: { TreeNode },
  mixins: [Emitter],
  props: {
    data: { type: Array, default: () => [] },
    defaultProps: { type: Object, default: () => {} }, // 可以选择性设置，不要求全部传递
    multiple: { type: Boolean, default: false },
    emptyText: { type: String, default: '暂无数据' },
    checkedValues: { type: Array, default: () => [] }, // 当前选中项
    searchValue: { type: String, default: '' } // 筛选字段
  },
  data() {
    return {
      stateTree: _.cloneDeep(this.data),
      flatState: []
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
    }
  },
  watch: {
    data: {
      handler(val) {
        this.stateTree = _.cloneDeep(val)
        this.flatState = this.compileFlatState()
        this.setDefaultExpand(val)
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  mounted() {
    this.$on('on-checked', this.handleSelect)
    this.$on('toggle-expand', node => this.$emit('on-toggle-expand', node))
  },
  methods: {
    compileFlatState() {
      let that = this
      let keyCounter = 0
      let childrenKey = that.currentProps.children
      let flatTree = []
      function flattenChildren(node, parent) {
        node.easyNodeKey = keyCounter++
        flatTree[node.easyNodeKey] = { node, easyNodeKey: node.easyNodeKey }
        if (typeof parent !== 'undefined') {
          flatTree[node.easyNodeKey].parent = parent.easyNodeKey
          flatTree[parent.easyNodeKey][childrenKey].push(node.easyNodeKey)
        }

        if (node[childrenKey]) {
          flatTree[node.easyNodeKey][childrenKey] = []
          node[childrenKey].forEach(child => flattenChildren(child, node))
        }
      }
      that.stateTree.forEach(rootNode => {
        flattenChildren(rootNode)
      })
      return flatTree
    },
    handleSelect(nodeKey) {
      if (!this.flatState[nodeKey]) return
      const node = this.flatState[nodeKey].node
      this.$emit('change', node)
    },
    setDefaultExpand(array) {
      let res = array
      res.forEach(item => {
        this.$set(item, 'expand', true) // 设置树节点默认全部展开
        if (
          item[this.currentProps.children] &&
          item[this.currentProps.children].length > 0
        )
          this.setDefaultExpand(item[this.currentProps.children])
      })
    }
  }
}
</script>
<style lang="scss">
.easy-tree {
  position: relative;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 12px;

    &.easy-dropdown-menu {
      padding: 0;
    }

    li {
      list-style: none;
      margin: 0;
      padding: 0;
      white-space: nowrap;
      outline: none;
    }
  }

  li {
    ul {
      margin: 0;
      padding: 0 0 0 18px;
    }
  }

  .node-item {
    height: 27px;
    line-height: 27px;
    display: flex;

    &:hover {
      background: #f6f6f6;
    }

    &.is-disabled {
      cursor: not-allowed;

      &:hover {
        background: transparent;
      }

      .easy-tree-label {
        cursor: not-allowed;
        color: rgba(25, 34, 74, 0.4);
      }
    }
  }

  .easy-tree-label {
    display: inline-block;
    margin: 0;
    padding: 0 4px;
    width: calc(100% - 12px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #262b39;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &-checked {
      color: #4084ff;
    }
  }

  .easy-tree-arrow {
    cursor: pointer;
    width: 12px;
    text-align: center;
    display: inline-block;

    i {
      transition: all 0.2s ease-in;
      transform: scale(0.7);
      font-size: 12px;
      color: #c7ccd4;
      display: inline-block;
    }

    &-open {
      i {
        transform: scale(0.7) rotate(90deg);
      }
    }
  }

  .is-multiple {
    padding-right: 4px;

    .easy-tree-label {
      width: calc(100% - 28px);
    }

    .tree-node-checked-icon {
      transform: scale(0.7);
      width: 12px;
      font-size: 12px;
      color: #4084ff;
    }
  }
}
</style>
