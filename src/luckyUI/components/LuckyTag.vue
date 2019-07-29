/**
* 版本号：v1.0
* 创建人：林浩
* 创建时间：2019/07/29
* 描述：
    type: String, 标签类型（默认, text）
    color: String, 标签主颜色（default, primary, success, danger, warning, cyan, orange, pink, purple）
    closable: Boolean, 是否可关闭，为true时暴露close事件
*/
<template>
  <span v-if="type && type === 'text'" class="lucky-text-tag" :class="colorClass" @click.prevent="tagClick">
    <slot></slot>
  </span>
  <span v-else class="lucky-tag" :class="colorClass" @click.prevent="tagClick">
    <slot></slot>
    <i v-if="closable || closable === ''" class="el-icon-close" @click.stop="closeClick"></i>
  </span>
</template>

<script>
export default {
  components: {},
  props: ['type', 'color', 'closable'],
  data () {
    return {}
  },
  computed: {
    colorClass () {
      let color = this.color
      let colorClass = ''
      switch (color) {
        case 'primary':
          colorClass = 'primary-lucky-tag'
          break
        case 'danger':
          colorClass = 'danger-lucky-tag'
          break
        case 'success':
          colorClass = 'success-lucky-tag'
          break
        case 'warning':
          colorClass = 'warning-lucky-tag'
          break
        case 'cyan':
          colorClass = 'cyan-lucky-tag'
          break
        case 'orange':
          colorClass = 'orange-lucky-tag'
          break
        case 'pink':
          colorClass = 'pink-lucky-tag'
          break
        case 'purple':
          colorClass = 'purple-lucky-tag'
          break
        default:
          colorClass = 'default-lucky-tag'
      }
      return colorClass
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    tagClick () {
      this.$emit('click')
    },
    closeClick () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.lucky-tag {
  display: inline-block;
  height: 22px;
  font-size: 12px;
  line-height: 20px;
  border: 1px solid;
  border-radius: 4px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0 8px;
  & + .lucky-tag {
    margin-left: 10px;
  }
  &.default-lucky-tag {
    color: rgba(0, 0, 0, 0.65);
    background: #f5f5f5;
    border-color: #d9d9d9;
  }
  &.primary-lucky-tag {
    color: #1c92ff;
    background: #e6f7ff;
    border-color: #91d5ff;
  }
  &.success-lucky-tag {
    color: #67c23a;
    background: #f6ffed;
    border-color: #b7eb8f;
  }
  &.warning-lucky-tag {
    color: #faad15;
    background: #fffbe6;
    border-color: #ffe58f;
  }
  &.danger-lucky-tag {
    color: #f52250;
    background: #fff1f0;
    border-color: #ffa39e;
  }
  &.cyan-lucky-tag {
    color: #13c2c2;
    background: #e6fffb;
    border-color: #87e8de;
  }
  &.orange-lucky-tag {
    color: #fa541c;
    background: #fff2e8;
    border-color: #ffbb96;
  }
  &.pink-lucky-tag {
    color: #eb2f96;
    background: #fff0f6;
    border-color: #ffadd2;
  }
  &.purple-lucky-tag {
    color: #722ed1;
    background: #f9f0ff;
    border-color: #d3adf7;
  }
  i.el-icon-close {
    margin-left: 8px;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
  }
}
.lucky-text-tag {
  display: inline-block;
  height: 22px;
  font-size: 14px;
  line-height: 22px;
  color: #5a5b5f;
  & + .lucky-text-tag {
    margin-left: 10px;
  }
  &::before {
    content: "";
    float: left;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.25);
    margin-top: 8px;
    margin-right: 8px;
  }
  &.default-lucky-tag {
    &::before {
      background: rgba(0, 0, 0, 0.25);
    }
  }
  &.primary-lucky-tag {
    &::before {
      background: #1c92ff;
    }
  }
  &.success-lucky-tag {
    &::before {
      background: #67c23a;
    }
  }
  &.danger-lucky-tag {
    &::before {
      background: #f52250;
    }
  }
  &.warning-lucky-tag {
    &::before {
      background: #faad14;
    }
  }
}
</style>
