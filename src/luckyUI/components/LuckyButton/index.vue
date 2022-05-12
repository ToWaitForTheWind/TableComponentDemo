<template>
  <button
    class="lucky-button"
    type="button"
    :class="activeClass"
    :style="width ? `width: ${width};` : ''"
    @click="emitClick"
  >
    <i v-if="loading" class="ivu-load-loop ivu-icon ivu-icon-ios-loading"></i>
    <span class="inline-text">
      <slot></slot>
    </span>
  </button>
</template>

<script>
import { debounce } from 'lodash-es'
export default {
  name: 'EasyButton',
  components: {},
  props: {
    type: { type: String, default: '' },
    size: { type: String, default: '' },
    text: { type: Boolean, default: false },
    plain: { type: Boolean, default: false },
    light: { type: Boolean, default: false },
    round: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    debounce: { type: Boolean, default: false },
    width: { type: String, default: '' }
  },
  data() {
    return {}
  },
  computed: {
    activeClass() {
      let activeClass = this.typeClass
      if (this.sizeClass !== '')
        activeClass = `${activeClass} ${this.sizeClass}`
      let types = ['text', 'plain', 'light', 'round', 'disabled']
      types.forEach(type => {
        let specialClass = this.specialClass(type)
        if (specialClass !== '') activeClass = `${activeClass} ${specialClass}`
      })
      return activeClass
    },
    typeClass() {
      let type = this.type ? this.type : 'default'
      return `${type}-lucky-button`
    },
    sizeClass() {
      let sizeClass = ''
      if (this.size) sizeClass = `${this.size}-lucky-button`
      return sizeClass
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    specialClass(type) {
      let resClass = ''
      if (this[type]) resClass = `is-${type}`
      return resClass
    },
    emitClick() {
      if (this.disabled || this.loading) {
        return false
      } else {
        if (this.debounce) {
          this.debounceEmit()
        } else {
          this.$emit('click')
        }
      }
    },
    debounceEmit: debounce(function() {
      this.$emit('click')
    }, 800)
  }
}
</script>

<style lang="scss" scoped>
.lucky-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  cursor: pointer;
  background-color: #f7f7f7;
  border: none;
  border-radius: 4px;
  color: #19224a;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  font-size: 12px;
  line-height: 20px;
  padding: 6px 12px;
  margin: 0;
  -webkit-appearance: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;

  .iconfont,
  .ivu-icon {
    font-size: 12px;
    margin-right: 6px;

    &.icon-right {
      margin-right: 0;
      margin-left: 6px;
    }
  }

  & + .lucky-button {
    margin-left: 8px;
  }

  &:hover {
    background-color: #f2f3f5;
    color: #19224a;
  }

  &.is-round {
    border-radius: 16px;
  }

  &.is-disabled {
    background-color: #f8f8f8;
    color: #a9acb7;
    cursor: not-allowed;
  }

  &.large-lucky-button {
    font-size: 14px;
    padding: 7px 12px;
    line-height: 22px;
    min-width: 86px;

    &.is-round {
      border-radius: 18px;
    }
  }

  &.middle-lucky-button {
    font-size: 12px;
    padding: 4px 12px;
    line-height: 20px;

    &.is-round {
      border-radius: 14px;
    }
  }

  &.small-lucky-button {
    font-size: 12px;
    padding: 2px 12px;
    line-height: 20px;

    &.is-round {
      border-radius: 12px;
    }
  }

  &.primary-lucky-button {
    background-color: #4783ff;
    color: #fff;

    &:hover {
      background-color: #2371ff;
    }

    &.is-disabled {
      background-color: rgba(71, 131, 255, 0.5);
      cursor: not-allowed;
    }

    &.is-plain {
      color: #4783ff;
      background-color: rgba(71, 131, 255, 0.1);

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 200%;
        height: 200%;
        transform-origin: 0 0;
        transform: scale(0.5);
        border: 1px solid #4783ff;
        border-radius: 8px;
        pointer-events: none;
        box-sizing: border-box;
        background-color: transparent;
      }

      &:hover {
        background-color: rgba(200, 218, 255, 0.1);
      }

      &.is-disabled {
        background-color: rgba(71, 131, 255, 0.1);
        color: rgba(71, 131, 255, 0.5);
        cursor: not-allowed;

        &::after {
          border-color: rgba(71, 131, 255, 0.5);
        }
      }
    }

    &.is-light {
      color: #19224a;
      background-color: #eff4fe;

      &:hover {
        background-color: #e6eeff;
      }

      &.is-disabled {
        background-color: #f1f5fe;
        color: rgba(169, 172, 183, 0.8);
        cursor: not-allowed;
      }
    }
  }

  &.warning-lucky-button {
    background-color: #faad14;
    color: #fff;

    &:hover {
      background-color: #fcbd3f;
    }

    &.is-disabled {
      background-color: #ffd37a;
      cursor: not-allowed;
    }

    &.is-plain {
      background-color: #fffbe6;
      color: #faad14;

      &:hover {
        background-color: #faad14;
        color: #fff;
      }

      &.is-disabled {
        background-color: #fffbe6;
        color: #ffcd69;
        cursor: not-allowed;
      }
    }
  }

  &.success-lucky-button {
    background-color: #1bad69;
    color: #fff;

    &:hover {
      background-color: #19965c;
    }

    &.is-disabled {
      opacity: 0.5;
      background-color: #1bad69;
      cursor: not-allowed;
    }

    &.is-plain {
      background-color: #f6ffed;
      color: #67c23a;

      &:hover {
        background-color: #67c23a;
        color: #fff;
      }

      &.is-disabled {
        background-color: #f6ffed;
        color: #a4da89;
        cursor: not-allowed;
      }
    }
  }

  &.danger-lucky-button {
    background-color: #f55353;
    color: #fff;

    &:hover {
      background-color: #fa7f7f;
    }

    &.is-disabled {
      background-color: #fcbbbb;
      cursor: not-allowed;
    }

    &.is-plain {
      background-color: #fef0f0;
      color: #f55353;

      &:hover {
        background-color: #f55353;
        color: #fff;
      }

      &.is-disabled {
        background-color: #fef0f0;
        color: #faa7a7;
        cursor: not-allowed;
      }
    }

    &.is-light {
      color: #19224a;
      background-color: #feefef;

      &:hover {
        background-color: #ffe3e3;
      }

      &.is-disabled {
        background-color: #fef1f1;
        color: rgba(169, 172, 183, 0.8);
        cursor: not-allowed;
      }
    }
  }

  &.is-text {
    background-color: transparent;
    color: #4783ff;
    padding-left: 0;
    padding-right: 0;
    height: 17px;
    line-height: 17px;
    font-size: 12px;

    &:hover {
      background-color: transparent;
      color: #2f73ff;
    }

    &.is-disabled {
      opacity: 0.5;
      color: #4783ff;
      background-color: transparent;
    }

    &.success-lucky-button {
      color: #1bad69;

      &:hover {
        color: #19965c;
      }

      &.is-disabled {
        color: #1bad69;
      }
    }

    &.danger-lucky-button {
      color: #ef604f;

      &:hover {
        color: #ed3621;
      }

      &.is-disabled {
        color: #ef604f;
      }
    }
  }
}
</style>
