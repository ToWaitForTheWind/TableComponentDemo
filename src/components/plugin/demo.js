import { useComponent, instance } from './index'
import demo from './demo.vue'

const showDemoDialog = (options = {}) => {
  return useComponent(demo, options)
}

showDemoDialog.close = () => {
  instance.handleCancel()
}

// console.log(showDemoDialog, showDemoDialog());

export default showDemoDialog
