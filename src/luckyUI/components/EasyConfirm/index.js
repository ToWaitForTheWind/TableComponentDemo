import Vue from 'vue';
import confirmBox from './confirm.vue';

const defaultConfigs = {
    title: '通知',
    message: '',
    type: '',
    customIcon: '',
    showClose: false,
    showConfirmButton: true,
    showCancelButton: false,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    customClass: '',
    onConfirm: null,
    onCancel: null,
};

const ConfirmBoxConstructor = Vue.extend(confirmBox);

let instance;

const initInstance = () => {
    instance = new ConfirmBoxConstructor({
        el: document.createElement('div'),
    });
};

const ConfirmBox = function (options) {
    if (!instance) {
        initInstance();
    }
    let currentOptions = { ...defaultConfigs, ...options };
    for (let prop in currentOptions) {
        if (currentOptions.hasOwnProperty(prop)) {
            instance[prop] = currentOptions[prop];
        }
    }
    if (!instance.visible) {
        document.body.appendChild(instance.$el);

        Vue.nextTick(() => {
            instance.visible = true;
        });
    }
};

ConfirmBox.close = () => {
    instance.doClose();
    instance.visible = false;
};

export default ConfirmBox;
export { ConfirmBox };
