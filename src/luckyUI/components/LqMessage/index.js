import Vue from 'vue';
import messageBox from './message.vue';

const defaultConfigs = {
    message: '', // Message文案
    type: 'primary', // Message类型
    showClose: false, // 是否展示关闭icon
    duration: 3000, // 关闭延时
    customClass: '', // 用户自定义class
    customIcon: '', // 用户自定义icon
    onClose: null, // 用户自定义关闭事件
    offset: 20, // Message 距离窗口顶部的偏移量
};

const MessageBoxConstructor = Vue.extend(messageBox);

let instance;
let instances = [];
let seed = 1;

const MessageBox = function (options) {
    let id = `message_${seed++}`;

    let customClose = options.onClose;
    options.onClose = function () {
        MessageBox.close(id, customClose);
    };
    instance = new MessageBoxConstructor();
    // 常规提示和成功提示，出现2秒后消失；预警提示和失败提示，出现3秒后消失
    if (defaultConfigs.type !== 'warning' || defaultConfigs.type !== 'danger') defaultConfigs.duration = 2000;
    // 合并options
    let currentOptions = { ...defaultConfigs, ...options };
    for (let prop in currentOptions) {
        if (currentOptions.hasOwnProperty(prop)) {
            instance[prop] = currentOptions[prop];
        }
    }
    instance.id = id;
    instance.$mount();
    document.body.appendChild(instance.$el);
    let verticalOffset = options.offset || 20;
    instances.forEach(item => {
        verticalOffset += item.$el.offsetHeight + 16; // 每一个新的Message都需要在之前的基础上加上16，防止重叠、连接在一起
    });
    instance.verticalOffset = verticalOffset;
    instance.visible = true;
    instance.$el.style.zIndex = 999;
    instances.push(instance);
    return instance;
};

MessageBox.close = function (id, customClose) {
    let length = instances.length;
    let index = -1;
    let removedHeight;
    for (let i = 0; i < length; i++) {
        if (id === instances[i].id) {
            removedHeight = instances[i].$el.offsetHeight;
            index = i;
            if (customClose) {
                customClose(instances[i]);
            }
            instances.splice(i, 1);
            break;
        }
    }
    if (length <= 1 || index === -1 || index > instances.length - 1) return;
    for (let i = index; i < length - 1; i++) {
        let dom = instances[i].$el;
        dom.style.top = `${parseInt(dom.style.top, 10) - removedHeight - 16}px`;
    }
};

MessageBox.closeAll = function () {
    for (let i = instances.length - 1; i >= 0; i--) {
        instances[i].toClose();
    }
};

export default MessageBox;
