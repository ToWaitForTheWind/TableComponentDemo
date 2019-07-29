/**
* 版本号：v1.0
* 创建人：林浩
* 创建时间：2019/07/24
* 描述：
    type: String, 按钮类型（默认, text, primary, warning, success, danger）
    size: String, 按钮大小（默认36px, large 40px, small 28px）
    plain: Boolean, 按钮风格是否为朴素
    round: Boolean, 按钮风格是否为圆角
    disabled: Boolean, 是否禁用按钮
    debounce: Boolean, 是否启用防抖
*/
<template>
  <button class="lucky-button" :class="activeClass" @click="emitClick">
    <span class="inline-text">
      <slot></slot>
    </span>
  </button>
</template>

<script>
import { debounce } from '../utils/debounce'
export default {
  components: {},
  props: ['type', 'size', 'plain', 'round', 'disabled', 'debounce'],
  data () {
    return {}
  },
  computed: {
    activeClass () {
      let activeClass = this.typeClass
      if (this.sizeClass !== '') activeClass = `${activeClass} ${this.sizeClass}`
      if (this.plainClass !== '') activeClass = `${activeClass} ${this.plainClass}`
      if (this.roundClass !== '') activeClass = `${activeClass} ${this.roundClass}`
      if (this.disabledClass !== '') activeClass = `${activeClass} ${this.disabledClass}`
      return activeClass
    },
    typeClass () {
      let type = this.type
      let typeClass = ''
      switch (type) {
        case 'primary':
          typeClass = 'primary-lucky-button'
          break
        case 'warning':
          typeClass = 'warning-lucky-button'
          break
        case 'success':
          typeClass = 'success-lucky-button'
          break
        case 'danger':
          typeClass = 'danger-lucky-button'
          break
        case 'text':
          typeClass = 'text-lucky-button'
          break
        default:
          typeClass = 'default-lucky-button'
      }
      return typeClass
    },
    sizeClass () {
      let size = this.size
      let sizeClass = ''
      switch (size) {
        case 'large':
          sizeClass = 'large-lucky-button'
          break
        case 'small':
          sizeClass = 'small-lucky-button'
          break
        default:
          sizeClass = ''
      }
      return sizeClass
    },
    plainClass () {
      let plainClass = ''
      if (this.plain === '' || this.plain === true) plainClass = 'is-plain'
      return plainClass
    },
    roundClass () {
      let roundClass = ''
      if (this.round === '' || this.round === true) roundClass = 'is-round'
      return roundClass
    },
    disabledClass () {
      let disabledClass = ''
      if (this.disabled === '' || this.disabled === true) disabledClass = 'is-disabled'
      return disabledClass
    }
  },
  watch: {},
  created () {},
  mounted () {
  },
  methods: {
    emitClick () {
      if (this.disabled === '' || this.disabled === true) {
        return false
      } else {
        if (this.debounce === '' || this.debounce === true) {
          this.debounceEmit()
        } else {
          this.$emit('click')
        }
      }
    },
    debounceEmit: debounce(function () {
      this.$emit('click')
    }, 800)
  }
}
</script>

<style lang="scss" scoped>
.lucky-button {
  white-space: nowrap;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #dcdee6;
  border-radius: 4px;
  color: #5a5b5f;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  font-size: 14px;
  padding: 7px 16px;
  margin: 0;
  -webkit-appearance: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  .inline-text {
    display: inline-block;
    line-height: 20px;
  }
  i {
    margin-right: 8px;
    &.icon-right {
      margin-right: 0;
      margin-left: 8px;
    }
  }
  & + .lucky-button {
    margin-left: 10px;
  }
  &:hover {
    background: #ffffff;
    border: 1px solid #1c92ff;
    color: #1c92ff;
  }
  &.is-round {
    border-radius: 18px;
  }
  &.is-disabled {
    border-color: #dcdee6;
    color: #babcc4;
    cursor: not-allowed;
  }
  &.large-lucky-button {
    font-size: 16px;
    padding: 8px 16px;
    &.is-round {
      border-radius: 20px;
    }
    .inline-text {
      line-height: 22px;
    }
  }
  &.small-lucky-button {
    font-size: 12px;
    padding: 5px 8px;
    &.is-round {
      border-radius: 14px;
    }
    .inline-text {
      line-height: 16px;
    }
  }
  &.text-lucky-button {
    background: transparent;
    border-color: transparent;
    color: #1c92ff;
    padding-left: 0;
    padding-right: 0;
    &:hover {
      color: #66b1ff;
    }
    &.is-disabled {
      color: #c0c1cc;
      cursor: not-allowed;
    }
  }
  &.primary-lucky-button {
    background: #1c92ff;
    border-color: #1c92ff;
    color: #ffffff;
    &:hover {
      background: #66b1ff;
      border-color: #66b1ff;
    }
    &.is-disabled {
      background: #7dc1ff;
      border-color: #7dc1ff;
      cursor: not-allowed;
    }
    &.is-plain {
      color: #1c92ff;
      background: #e8f8ff;
      border-color: #96ccff;
      &:hover {
        background: #1c92ff;
        border-color: #1c92ff;
        color: #ffffff;
      }
      &.is-disabled {
        background: #e8f8ff;
        border-color: #b1d8fc;
        color: #70baff;
        cursor: not-allowed;
      }
    }
  }
  &.warning-lucky-button {
    background: #faad14;
    border-color: #faad14;
    color: #ffffff;
    &:hover {
      background: #fcbd3f;
      border-color: #fcbd3f;
    }
    &.is-disabled {
      background: #ffd37a;
      border-color: #ffd37a;
      cursor: not-allowed;
    }
    &.is-plain {
      background: #fffbe6;
      border-color: #ffe58f;
      color: #faad14;
      &:hover {
        background: #faad14;
        border-color: #faad14;
        color: #ffffff;
      }
      &.is-disabled {
        background: #fffbe6;
        border-color: #ffedb0;
        color: #ffcd69;
        cursor: not-allowed;
      }
    }
  }
  &.success-lucky-button {
    background: #67c23a;
    border-color: #67c23a;
    color: #ffffff;
    &:hover {
      background: #85ce61;
      border-color: #85ce61;
    }
    &.is-disabled {
      background: #b3e09d;
      border-color: #b3e09d;
      cursor: not-allowed;
    }
    &.is-plain {
      background: #f6ffed;
      border-color: #b7eb8f;
      color: #67c23a;
      &:hover {
        background: #67c23a;
        border-color: #67c23a;
        color: #ffffff;
      }
      &.is-disabled {
        background: #f6ffed;
        border-color: #d1f5b5;
        color: #a4da89;
        cursor: not-allowed;
      }
    }
  }
  &.danger-lucky-button {
    background: #f55353;
    border-color: #f55353;
    color: #ffffff;
    &:hover {
      background: #fa7f7f;
      border-color: #fa7f7f;
    }
    &.is-disabled {
      background: #fcbbbb;
      border-color: #fcbbbb;
      cursor: not-allowed;
    }
    &.is-plain {
      background: #fef0f0;
      border-color: #fbc4c4;
      color: #f55353;
      &:hover {
        background: #f55353;
        border-color: #f55353;
        color: #ffffff;
      }
      &.is-disabled {
        background: #fef0f0;
        border-color: #fde2e2;
        color: #faa7a7;
        cursor: not-allowed;
      }
    }
  }
}
</style>
