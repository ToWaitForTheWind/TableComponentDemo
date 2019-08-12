<template>
  <div class="lucky-special-input">
    <input
      ref="luckyInput"
      class="lucky-input"
      :class="activeClass"
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
    valueLimit: String,
    maxlength: Number,
    validateEvent: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    size: String
  },
  data () {
    return {
      trueInputValue: ''
    }
  },
  computed: {
    nativeInputValue () {
      return this.value === null || this.value === undefined ? '' : String(this.value)
    },
    activeClass () {
      let activeClass = ''
      if (this.sizeClass !== '') activeClass = `${activeClass} ${this.sizeClass}`
      if (this.disabledClass !== '') activeClass = `${activeClass} ${this.disabledClass}`
      return activeClass
    },
    sizeClass () {
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
    disabledClass () {
      let disabledClass = ''
      if (this.disabled === '' || this.disabled === true) disabledClass = 'is-disabled'
      return disabledClass
    }
  },
  watch: {
    'trueInputValue' (newVal, oldVal) {
      let that = this
      if (newVal.length > oldVal.length) {
        let reg = new RegExp(oldVal)
        let inputValue = newVal.replace(reg, '')
        let inputValueArr = inputValue.split('')
        let valueStr = ''
        inputValueArr.forEach(item => {
          if (that.valueLimit.indexOf(item) !== -1) {
            valueStr += item
          }
        })
        that.$emit('input', oldVal + valueStr)
        that.trueInputValue = oldVal + valueStr
        that.$refs['luckyInput'].value = oldVal + valueStr
      }
    }
  },
  created () {},
  mounted () {
    this.setNativeInputValue()
  },
  methods: {
    handleInput (event) {
      // console.log(event.target.value, 'handleInput')
      // this.trueInputValue = event.target.value
      // this.$nextTick(this.setNativeInputValue)
    },
    handleBlur(event) {
      this.$emit('blur', event)
      if (this.validateEvent) {
        // this.dispatch('ElFormItem', 'el.form.blur', [this.trueInputValue])
      }
    },
    handleFocus(event) {
      this.$emit('focus', event)
    },
    handleChange(event) {
      this.trueInputValue = event.target.value
      this.$emit('change', event.target.value);
    },
    setNativeInputValue() {
      const input = this.$refs['luckyInput']
      if (!input) return
      input.value = this.value
      this.trueInputValue = this.value
    }
  }
}
</script>

<style lang="scss">
.lucky-special-input {
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
  .lucky-input {
    width: 248px;
    height: 36px;
    background: #ffffff;
    border: 1px solid #dcdee6;
    border-radius: 4px;
    font: 14px "Microsoft Yahei";
    padding: 8px 12px;
    color: #5a5b5f;
    line-height: 20px;
    box-sizing: border-box;
    outline: none;
    &:hover,
    &:focus {
      border-color: #1c92ff;
    }
    &.large-lucky-input {
      height: 40px;
      padding: 10px 12px;
    }
    &.small-lucky-input {
      height: 28px;
      font-size: 12px;
      line-height: 18px;
      padding: 5px 12px;
    }
    &.is-disabled {
      background: #f7fafc;
      border: 1px solid rgba(220, 222, 230, 0.9);
      cursor: not-allowed;
    }
  }
}
</style>
