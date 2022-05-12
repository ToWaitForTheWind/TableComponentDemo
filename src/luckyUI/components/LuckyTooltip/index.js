import Popper from '../../utils/vue-popper'
import { debounce } from 'lodash-es'
import { addClass, removeClass, on, off } from '../../utils/dom'
import { generateId } from '../../utils/CommonMethods'
import Vue from 'vue'
import './index.scss'

export default {
  name: 'LuckyTooltip',

  mixins: [Popper],

  props: {
    customClass: String,
    content: String,
    disabled: Boolean,
    manual: Boolean,
    enterable: { type: Boolean, default: true },
    openDelay: { type: Number, default: 0 },
    hideAfter: { type: Number, default: 0 },
    arrowOffset: { type: Number, default: 0 }
  },

  data() {
    return {
      tooltipId: `lucky-tooltip-${generateId()}`,
      timeoutPending: null,
      focusing: false
    }
  },
  beforeCreate() {
    if (this.$isServer) return

    this.popperVM = new Vue({
      data: { node: '' },
      render() {
        return this.node
      }
    }).$mount()

    this.debounceClose = debounce(() => this.handleClosePopper(), 200)
  },

  render() {
    if (this.popperVM) {
      this.popperVM.node = (
        <transition name="lucky-fade-in-linear" onAfterLeave={this.doDestroy}>
          <div
            onMouseleave={() => {
              this.setExpectedState(false)
              this.debounceClose()
            }}
            onMouseenter={() => {
              this.setExpectedState(true)
            }}
            ref="popper"
            role="tooltip"
            id={this.tooltipId}
            aria-hidden={this.disabled || !this.showPopper ? 'true' : 'false'}
            v-show={!this.disabled && this.showPopper}
            class={['lucky-tooltip-popper', this.customClass]}
          >
            {this.$slots.content || this.content}
          </div>
        </transition>
      )
    }

    const firstElement = this.getFirstElement()
    if (!firstElement) return null

    firstElement.data = firstElement.data || {}
    const data = firstElement.data
    data.staticClass = this.addTooltipClass(data.staticClass)

    return firstElement
  },

  mounted() {
    this.referenceElm = this.$el
    if (this.$el.nodeType === 1) {
      this.$el.setAttribute('aria-describedby', this.tooltipId)
      on(this.referenceElm, 'mouseenter', this.show)
      on(this.referenceElm, 'mouseleave', this.hide)
      on(this.referenceElm, 'focus', () => {
        if (!this.$slots.default || !this.$slots.default.length) {
          this.handleFocus()
          return
        }
        const instance = this.$slots.default[0].componentInstance
        if (instance && instance.focus) {
          instance.focus()
        } else {
          this.handleFocus()
        }
      })
      on(this.referenceElm, 'blur', this.handleBlur)
      on(this.referenceElm, 'click', this.removeFocusing)
    }
    // fix issue https://github.com/ElemeFE/element/issues/14424
    if (this.value && this.popperVM) {
      this.popperVM.$nextTick(() => {
        if (this.value) {
          this.updatePopper()
        }
      })
    }
  },
  watch: {
    focusing(val) {
      if (val) {
        addClass(this.referenceElm, 'focusing')
      } else {
        removeClass(this.referenceElm, 'focusing')
      }
    }
  },
  methods: {
    show() {
      this.setExpectedState(true)
      this.handleShowPopper()
    },

    hide() {
      this.setExpectedState(false)
      this.debounceClose()
    },
    handleFocus() {
      this.focusing = true
      this.show()
    },
    handleBlur() {
      this.focusing = false
      this.hide()
    },
    removeFocusing() {
      this.focusing = false
    },

    addTooltipClass(prev) {
      if (!prev) {
        return 'lucky-tooltip'
      } else {
        return `lucky-tooltip ${prev.replace('lucky-tooltip', '')}`
      }
    },

    handleShowPopper() {
      if (!this.expectedState || this.manual) return
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.showPopper = true
      }, this.openDelay)

      if (this.hideAfter > 0) {
        this.timeoutPending = setTimeout(() => {
          this.showPopper = false
        }, this.hideAfter)
      }
    },

    handleClosePopper() {
      if ((this.enterable && this.expectedState) || this.manual) return
      clearTimeout(this.timeout)

      if (this.timeoutPending) {
        clearTimeout(this.timeoutPending)
      }
      this.showPopper = false

      if (this.disabled) {
        this.doDestroy()
      }
    },

    setExpectedState(expectedState) {
      if (expectedState === false) {
        clearTimeout(this.timeoutPending)
      }
      this.expectedState = expectedState
    },

    getFirstElement() {
      const slots = this.$slots.default
      if (!Array.isArray(slots)) return null
      let element = null
      for (let index = 0; index < slots.length; index++) {
        if (slots[index] && slots[index].tag) {
          element = slots[index]
        }
      }
      return element
    }
  },

  beforeDestroy() {
    this.popperVM && this.popperVM.$destroy()
  },

  destroyed() {
    const reference = this.referenceElm
    if (reference.nodeType === 1) {
      off(reference, 'mouseenter', this.show)
      off(reference, 'mouseleave', this.hide)
      off(reference, 'focus', this.handleFocus)
      off(reference, 'blur', this.handleBlur)
      off(reference, 'click', this.removeFocusing)
    }
  }
}
