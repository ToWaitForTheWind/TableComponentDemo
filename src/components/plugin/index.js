import Vue from 'vue'
import {
  transferIndex,
  transferIncrease,
} from 'view-design/src/utils/transfer-queue'

const defaultConfigs = {
  zIndex: 999,
}

let instance

const useComponent = function(component, options = {}) {
  if (!instance) {
    const ComponentConstructor = Vue.extend(component)
    instance = new ComponentConstructor({
      el: document.createElement('div'),
    })
    instance.$on('handleConfirm', () => {
      console.log(1111)
    })
  }
  let currentOptions = { ...defaultConfigs, ...options }
  for (let prop in currentOptions) {
    if (currentOptions.hasOwnProperty(prop)) {
      instance[prop] = currentOptions[prop]
    }
  }
  if (!instance.visible) {
    let nextZIndex = getNextZIndex()
    let max = Math.max(nextZIndex, currentOptions.zIndex)
    instance.$el.style.zIndex = max
    document.body.appendChild(instance.$el)

    Vue.nextTick(() => {
      instance.visible = true
    })
  }
}

function getNextZIndex() {
  transferIncrease()
  return transferIndex + 1000
}

export { useComponent, instance }
