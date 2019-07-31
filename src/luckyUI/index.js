import { luckyMessage } from './components/LuckyMessage'
import { luckyNotify } from './components/LuckyNotification'
import LuckyDialog from './components/LuckyDialog'
import LuckyButton from './components/LuckyButton'
import LuckyTag from './components/LuckyTag'
import LuckyMainLayout from './components/LuckyMainLayout'
import LuckyContentLayout from './components/LuckyContentLayout'

export default {
  install(Vue, options) {
    Vue.prototype.luckyNotify = luckyNotify
    Vue.prototype.luckyMessage = luckyMessage
    Vue.component('LuckyMainLayout', LuckyMainLayout)
    Vue.component('LuckyContentLayout', LuckyContentLayout)
    Vue.component('LuckyDialog', LuckyDialog)
    Vue.component('LuckyButton', LuckyButton)
    Vue.component('LuckyTag', LuckyTag)
  }
}