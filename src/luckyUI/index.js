import { luckyMessage } from './components/LuckyMessage'
import { luckyNotify } from './components/LuckyNotification'
import LuckyDialog from './components/LuckyDialog'
import LuckyButton from './components/LuckyButton'
import LuckyTag from './components/LuckyTag'
import LuckyFileUpload from './components/LuckyFileUpload'
import LuckyImageUpload from './components/LuckyImageUpload'
import LuckySpecialInput from './components/LuckySpecialInput'
import LuckyMainLayout from './components/LuckyMainLayout'
import LuckyContentLayout from './components/LuckyContentLayout'
import LuckyLazySelect from './components/LuckyLazySelect'
import './assets/commom.scss'

export default {
  install(Vue, options) {
    Vue.prototype.luckyNotify = luckyNotify
    Vue.prototype.luckyMessage = luckyMessage
    Vue.component('LuckyMainLayout', LuckyMainLayout)
    Vue.component('LuckyContentLayout', LuckyContentLayout)
    Vue.component('LuckyDialog', LuckyDialog)
    Vue.component('LuckyButton', LuckyButton)
    Vue.component('LuckyTag', LuckyTag)
    Vue.component('LuckyFileUpload', LuckyFileUpload)
    Vue.component('LuckyImageUpload', LuckyImageUpload)
    Vue.component('LuckySpecialInput', LuckySpecialInput)
    Vue.component('LuckyLazySelect', LuckyLazySelect)
  }
}