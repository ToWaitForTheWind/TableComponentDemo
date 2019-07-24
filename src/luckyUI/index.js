import { luckyMessage } from './components/LuckyMessage'
import { luckyNotify } from './components/LuckyNotification'
import LuckyDialog from './components/LuckyDialog'
import LuckyButton from './components/LuckyButton'

export default {
  install(Vue, options) {
    Vue.prototype.luckyNotify = luckyNotify
    Vue.prototype.luckyMessage = luckyMessage
    Vue.component('LuckyDialog', LuckyDialog)
    Vue.component('LuckyButton', LuckyButton)
  }
}