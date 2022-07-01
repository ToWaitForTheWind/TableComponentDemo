import Vue from 'vue'
import luckyLoading from './index.vue'
import { addClass, removeClass, getStyle } from '@/utils/dom'
import { PopupManager } from '@/utils/popup'
import afterLeave from '@/utils/after-leave'
const LuckyLoading = Vue.extend(luckyLoading)

const loadingDirective = {}
loadingDirective.install = Vue => {
  if (Vue.prototype.$isServer) return
  const toggleLoading = (el, binding) => {
    if (binding.value) {
      Vue.nextTick(() => {
        if (binding.modifiers.fullscreen) {
          el.originalPosition = getStyle(document.body, 'position')
          el.originalOverflow = getStyle(document.body, 'overflow')
          el.maskStyle.zIndex = PopupManager.nextZIndex()

          addClass(el.mask, 'is-fullscreen')
          insertDom(document.body, el, binding)
        } else {
          removeClass(el.mask, 'is-fullscreen')

          if (binding.modifiers.body) {
            el.originalPosition = getStyle(document.body, 'position')
            ;['top', 'left'].forEach(property => {
              const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft'
              el.maskStyle[property] =
                el.getBoundingClientRect()[property] +
                document.body[scroll] +
                document.documentElement[scroll] -
                parseInt(getStyle(document.body, `margin-${property}`), 10) +
                'px'
            })
            ;['height', 'width'].forEach(property => {
              el.maskStyle[property] =
                el.getBoundingClientRect()[property] + 'px'
            })

            insertDom(document.body, el, binding)
          } else {
            el.originalPosition = getStyle(el, 'position')
            insertDom(el, el, binding)
          }
        }
      })
    } else {
      afterLeave(
        el.instance,
        _ => {
          if (!el.instance.hiding) return
          el.domVisible = false
          const target =
            binding.modifiers.fullscreen || binding.modifiers.body
              ? document.body
              : el
          removeClass(target, 'lucky-loading-parent--relative')
          removeClass(target, 'lucky-loading-parent--hidden')
          el.instance.hiding = false
        },
        300,
        true,
      )
      el.instance.visible = false
      el.instance.hiding = true
    }
  }
  const insertDom = (parent, el, binding) => {
    if (
      !el.domVisible &&
      getStyle(el, 'display') !== 'none' &&
      getStyle(el, 'visibility') !== 'hidden'
    ) {
      Object.keys(el.maskStyle).forEach(property => {
        el.mask.style[property] = el.maskStyle[property]
      })

      if (
        el.originalPosition !== 'absolute' &&
        el.originalPosition !== 'fixed'
      ) {
        addClass(parent, 'lucky-loading-parent--relative')
      }
      if (binding.modifiers.fullscreen && binding.modifiers.lock) {
        addClass(parent, 'lucky-loading-parent--hidden')
      }
      el.domVisible = true

      parent.appendChild(el.mask)
      Vue.nextTick(() => {
        if (el.instance.hiding) {
          el.instance.$emit('after-leave')
        } else {
          el.instance.visible = true
        }
      })
      el.domInserted = true
    } else if (el.domVisible && el.instance.hiding === true) {
      el.instance.visible = true
      el.instance.hiding = false
    }
  }

  Vue.directive('luckyLoading', {
    bind: function(el, binding, vnode) {
      let loadingText = el.getAttribute('lucky-loading-text')
      let loadingBg = el.getAttribute('lucky-loading-bg')
      let loadingCustomClass = el.getAttribute('lucky-loading-custom-class')
      const loading = new LuckyLoading({
        el: document.createElement('div'),
        data: {
          text: loadingText,
          background: loadingBg,
          customClass: loadingCustomClass,
          fullscreen: !!binding.modifiers.fullscreen,
        },
      })
      el.instance = loading
      el.mask = loading.$el
      el.maskStyle = {}

      binding.value && toggleLoading(el, binding)
    },

    update: function(el, binding) {
      el.instance.setText(el.getAttribute('lucky-loading-text'))
      if (binding.oldValue !== binding.value) {
        toggleLoading(el, binding)
      }
    },

    unbind: function(el, binding) {
      if (el.domInserted) {
        el.mask && el.mask.parentNode && el.mask.parentNode.removeChild(el.mask)
        toggleLoading(el, { value: false, modifiers: binding.modifiers })
      }
      el.instance && el.instance.$destroy()
    },
  })
}

export default loadingDirective
