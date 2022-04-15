<template>
    <transition name="easy-confirm-fade">
        <div
            v-show="visible"
            class="easy-confirm"
            :class="customClass"
        >
            <div class="confirm-wrapper">
                <div class="confirm-body">
                    <header class="confirm-header">
                        <div class="easy-title">
                            <i
                                class="iconfont title-icon"
                                :class="iconClass"
                            ></i>
                            <div
                                class="main-title"
                            >{{ title }}</div>
                        </div>
                        <div
                            v-if="showClose"
                            class="confirm-close iconfont iconguanbi"
                            @click="handleClose"
                        ></div>
                    </header>
                    <div
                        class="confirm-content-area"
                    >
                        <div class="confirm-content-body middle-scroll-bar">
                            <div
                                v-for="(item, index) in currentMessage"
                                :key="item + index"
                                class="message-item"
                            >
                                {{ item }}
                            </div>
                        </div>
                        <div
                            class="confirm-content-footer"
                            v-if="showCancelButton || showConfirmButton"
                        >
                            <easy-button
                                v-if="showCancelButton"
                                size="large"
                                @click="toCancel"
                            >{{ cancelButtonText }}</easy-button>
                            <easy-button
                                v-if="showConfirmButton"
                                type="primary"
                                size="large"
                                @click="toConfirm"
                            >{{ confirmButtonText }}</easy-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="lucky-mask-layer"></div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'EasyConfirm',
    components: {
    },
    props: {
        title: { type: String, default: '通知' },
        message: { type: [String, Array], default: '' },
        type: { type: String, default: '' },
        customIcon: { type: String, default: '' },
        confirmButtonText: { type: String, default: '确定' },
        cancelButtonText: { type: String, default: '取消' },
        showClose: { type: Boolean, default: false },
        showConfirmButton: { type: Boolean, default: true },
        showCancelButton: { type: Boolean, default: false },
        customClass: { type: String, default: '' },
        onConfirm: { type: Function, default: null },
        onCancel: { type: Function, default: null },
    },
    data () {
        return {
            visible: false,
        };
    },
    computed: {
        iconClass () {
            let className;
            if (this.customIcon) className = this.customIcon;
            else if (!this.type) className = 'iconxinxi1';
            else if (this.type === 'success') className = `${this.type} iconchenggong`;
            else if (this.type === 'warning') className = `${this.type} icongaojing`;
            else if (this.type === 'danger') className = `${this.type} iconbaocuo`;
            return className;
        },
        currentMessage () {
            if (Array.isArray(this.message)) return this.message;
            else return [this.message];
        },
    },
    watch: {
        visible (val) {
            if (val) {
                document.body.appendChild(this.$el);
            }
        },
    },
    mounted () {
        if (this.visible) {
            document.body.appendChild(this.$el);
        }
    },
    destroyed () {
        if (this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el);
        }
    },
    methods: {
        handleClose () {
            this.visible = false;
        },
        async toCancel () {
            if (this.onCancel !== null) {
                if (this.onCancel) {
                    let res = await this.onCancel();
                    if (res) this.handleClose();
                }
            } else this.handleClose();
        },
        async toConfirm () {
            if (this.onConfirm !== null) {
                if (this.onConfirm) {
                    let res = await this.onConfirm();
                    if (res) this.handleClose();
                }
            } else this.handleClose();
        },
    },
};
</script>

<style lang="scss">
.easy-confirm {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 999;

    .confirm-wrapper {
        width: 100%;
        height: 100%;
        background: transparent;
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
    }

    .confirm-body {
        background: #fff;
        box-shadow: 0 2px 10px 0 rgba(205, 205, 205, .5);
        position: relative;
        border-radius: 4px;
        width: 400px;
    }

    .confirm-header {
        padding: 32px 32px 20px;
    }

    .easy-title {
        line-height: 22px;
        display: flex;
    }

    .title-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        margin-right: 8px;
        color: #4084FF;

        &.success {
            color: #1BAD69;
        }

        &.warning {
            color: #F69C09;
        }

        &.danger {
            color: #EA3636;
        }
    }

    .main-title {
        max-width: 80%;
        font-size: 16px;
        color: #262B39;
        font-weight: bold;
        margin-right: 8px;
    }

    .confirm-content-body {
        word-break: break-all;
        padding: 0 32px 0 62px;
        overflow: auto;
        max-height: 462px;
        color: #262B39;
    }

    .lucky-mask-layer {
        width: 100%;
        height: 100%;
        background: #1B2036;
        opacity: .3;
    }

    .confirm-close {
        position: absolute;
        top: 32px;
        right: 32px;
        width: 20px;
        height: 20px;
        cursor: pointer;
        background-size: contain;
        background-color: #f4f4f4;
        border-radius: 50%;
        color: #B9BAC1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;

        &::before {
            line-height: 20px;
        }

        &:hover {
            background: rgba(212, 217, 222, .5);
            color: #76777C;
        }
    }

    .confirm-content-footer {
        padding: 32px;
        text-align: right;
    }
}

.easy-confirm-fade-enter-active {
    animation: easy-confirm-fade-in .3s;
}

.easy-confirm-fade-leave-active {
    animation: easy-confirm-fade-out .3s;
}

@keyframes easy-confirm-fade-in {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes easy-confirm-fade-out {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>
