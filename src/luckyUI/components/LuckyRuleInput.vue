<template>
  <div class="lucky-rule-input clearfix" :class="[$slots.prepend ? 'show-prepend' : '', activeClass]">
    <div class="lucky-prepend" v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </div>
    <input
      ref="luckyRuleInput"
      class="lucky-input"
      :class="{ 'prepend-input': $slots.prepend }"
      type="text"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :disabled="disabled"
      @change="handleChange"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: [String, Number],
    limitType: { type: String, default: '' }, // 可选:canLimit(通过限制可输入内容限制),canNotLitmit(通过限制不可输入内容限制),custom(用户自定义限制function)
    limitValue: [String, Function], // limitType为对应的限制方案
    maxlength: Number,
    validateEvent: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    size: String,
  },
  data() {
    return {
      trueInputValue: '',
    }
  },
  computed: {
    nativeInputValue() {
      return this.value === null || this.value === undefined ? '' : String(this.value)
    },
    activeClass() {
      let activeClass = ''
      if (this.sizeClass !== '') activeClass = this.sizeClass
      if (this.disabledClass !== '') activeClass = `${activeClass} ${this.disabledClass}`
      return activeClass
    },
    sizeClass() {
      let size = this.size
      let sizeClass = ''
      switch (size) {
        case 'large':
          sizeClass = 'large-lucky-input'
          break
        case 'small':
          sizeClass = 'small-lucky-input'
          break
        default:
          sizeClass = ''
      }
      return sizeClass
    },
    disabledClass() {
      let disabledClass = ''
      if (this.disabled === '' || this.disabled === true) disabledClass = 'is-disabled'
      return disabledClass
    },
  },
  watch: {
    trueInputValue(newVal, oldVal) {
      let that = this
      let valueStr = ''
      if (that.limitType === 'custom') {
        valueStr = that.limitValue(newVal)
      } else return
      that.$emit('input', valueStr)
      that.trueInputValue = valueStr
      that.$refs['luckyRuleInput'].value = valueStr
    },
    value() {
      this.setNativeInputValue()
    },
  },
  created() {},
  mounted() {
    this.setNativeInputValue()
  },
  methods: {
    handleInput(event) {
      let that = this
      if (that.limitType === 'canLimit' || that.limitType === 'canNotLimit') {
        let valueStr = ''
        let newVal = event.target.value
        let inputValueArr = newVal.split('')
        if (that.limitValue) {
          if (that.limitType === 'canLimit') {
            inputValueArr.forEach((item) => {
              if (that.limitValue.indexOf(item) !== -1) valueStr += item
            })
          } else if (that.limitType === 'canNotLimit') {
            inputValueArr.forEach((item) => {
              if (that.limitValue.indexOf(item) === -1) valueStr += item
            })
          }
        } else valueStr = newVal
        that.$emit('input', valueStr)
        that.trueInputValue = valueStr
        that.$refs['luckyRuleInput'].value = valueStr
      }
    },
    handleBlur(event) {
      this.$nextTick(function() {
        this.$emit('blur', event)
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.blur', [this.trueInputValue])
        }
      })
    },
    handleFocus(event) {
      this.$emit('focus', event)
    },
    handleChange(event) {
      this.trueInputValue = event.target.value
      this.$emit('change', event.target.value)
    },
    setNativeInputValue() {
      const input = this.$refs['luckyRuleInput']
      if (!input) return
      input.value = this.value
      this.trueInputValue = this.value
    },
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root
      var name = parent.$options.componentName

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent
        if (parent) name = parent.$options.componentName
      }
      if (parent) parent.$emit.apply(parent, [eventName].concat(params))
    },
  },
}
</script>

<style lang="scss">
.lucky-rule-input {
  display: inline-block;
  width: 248px;
  height: 36px;
  font: 14px 'Microsoft Yahei';
  &.large-lucky-input {
    height: 40px;
    .lucky-input {
      padding: 10px 12px;
    }
    .lucky-prepend {
      padding: 10px 12px;
    }
  }
  &.small-lucky-input {
    height: 28px;
    font-size: 12px;
    .lucky-input {
      font-size: 12px;
      line-height: 18px;
      padding: 5px 12px;
    }
    .lucky-prepend {
      line-height: 18px;
      padding: 5px 12px;
    }
  }
  &.is-disabled {
    cursor: not-allowed;
    .lucky-input {
      background: #f7fafc;
      border: 1px solid rgba(220, 222, 230, 0.9);
    }
    .lucky-prepend {
      border: 1px solid rgba(220, 222, 230, 0.9);
      border-right: 0;
    }
  }
  &.show-prepend {
    display: inline-table;
    .lucky-input {
      display: table-cell;
      vertical-align: middle;
    }
  }
  .lucky-prepend {
    display: table-cell;
    vertical-align: middle;
    padding: 8px 12px;
    line-height: 20px;
    border-radius: 4px 0 0 4px;
    border: 1px solid #dcdee6;
    border-right: 0;
    background: #f5f7fa;
    color: #909399;
    width: 1px;
    white-space: nowrap;
  }
  .lucky-input {
    width: 100%;
    background: #ffffff;
    border: 1px solid #dcdee6;
    border-radius: 4px;
    padding: 8px 12px;
    color: #5a5b5f;
    line-height: 20px;
    box-sizing: border-box;
    outline: none;
    &:hover,
    &:focus {
      border-color: #1c92ff;
    }
    &.prepend-input {
      border-radius: 0 4px 4px 0;
    }
  }
  ::-webkit-input-placeholder {
    color: #c0c1cc;
  }
  ::-moz-placeholder {
    color: #c0c1cc;
  }
  :-ms-input-placeholder {
    color: #c0c1cc;
  }
  :-moz-placeholder {
    color: #c0c1cc;
  }
}
.el-form-item.is-error .lucky-input {
  border-color: #f55353;
}
</style>
