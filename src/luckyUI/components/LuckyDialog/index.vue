<template>
  <transition name="lucky-dialog-fade">
    <div v-show="visible" class="lucky-dialog">
      <div class="dialog-wrapper">
        <div class="dialog-body" :style="`width: ${width};`">
          <header v-if="showDefaultHeader" class="dialog-header">
            <div class="lucky-title">
              <slot name="header">
                <div
                  class="main-title"
                  :style="`max-width: ${secondTitle ? 50 : 80}%;`"
                >
                  {{ mainTitle }}
                </div>
                <div
                  v-if="secondTitle"
                  class="second-title"
                  :title="secondTitle"
                >
                  {{ secondTitle }}
                </div>
              </slot>
            </div>
            <div
              v-if="showClose"
              class="dialog-close iconfont iconguanbi"
              @click="handleClose"
            ></div>
          </header>
          <div
            class="dialog-content-area"
            :style="`padding-top: ${showDefaultHeader ? 0 : 20}px;`"
          >
            <div
              class="dialog-content-body middle-scroll-bar"
              :style="
                `max-height: ${maxHeight}; ${
                  showDefaultFooter ? '' : 'padding-bottom: 20px;'
                }`
              "
            >
              <slot></slot>
            </div>
            <div v-if="showDefaultFooter" class="dialog-content-footer">
              <slot name="footer">
                <lucky-button size="large" @click="toCancel">
                  {{ cancelBtnText }}
                </lucky-button>
                <lucky-button type="primary" size="large" @click="toConfirm">
                  {{ confirmBtnText }}
                </lucky-button>
              </slot>
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
  name: 'EasyDialog',
  components: {},
  props: {
    visible: { type: Boolean, default: false },
    showDefaultHeader: { type: Boolean, default: true },
    showDefaultFooter: { type: Boolean, default: true },
    mainTitle: { type: String, default: '标题' },
    secondTitle: { type: String, default: '' },
    cancelBtnText: { type: String, default: '取消' },
    confirmBtnText: { type: String, default: '确定' },
    width: { type: String, default: '598px' },
    maxHeight: { type: String, default: '462px' },
    showClose: { type: Boolean, default: true },
    appendToBody: { type: Boolean, default: true },
    beforeClose: { type: Function, default: null }
  },
  data() {
    return {}
  },
  watch: {
    visible(val) {
      this.$emit('visibleChange', val)
      if (val) {
        this.$emit('open')
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
      } else {
        this.$emit('close')
      }
    }
  },
  mounted() {
    if (this.visible) {
      if (this.appendToBody) {
        document.body.appendChild(this.$el)
      }
    }
  },
  destroyed() {
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false)
      }
    },
    toCancel() {
      this.$emit('toCancel')
      this.$emit('update:visible', false)
    },
    toConfirm() {
      this.$emit('toConfirm')
    }
  }
}
</script>

<style lang="scss">
.lucky-dialog {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 999;

  .dialog-wrapper {
    width: 100%;
    height: 100%;
    background: transparent;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }

  .dialog-body {
    background: #fff;
    box-shadow: 0 2px 10px 0 rgba(205, 205, 205, 0.5);
    position: relative;
    border-radius: 4px;
  }

  .dialog-header {
    padding: 20px;
  }

  .lucky-title {
    line-height: 22px;
    display: flex;
  }

  .main-title {
    font-size: 16px;
    color: #262b39;
    font-weight: bold;
    margin-right: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .second-title {
    font-size: 12px;
    color: #76777c;
    max-width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dialog-content-body {
    padding: 0 20px;
    overflow: auto;
  }

  .lucky-mask-layer {
    width: 100%;
    height: 100%;
    background: #1b2036;
    opacity: 0.3;
  }

  .dialog-close {
    position: absolute;
    top: 21px;
    right: 20px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    background-size: contain;
    background-color: #f4f4f4;
    border-radius: 50%;
    color: #b9bac1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;

    &::before {
      line-height: 20px;
    }

    &:hover {
      background: rgba(212, 217, 222, 0.5);
      color: #76777c;
    }
  }

  .dialog-content-footer {
    padding: 20px;
    text-align: right;
  }
}

.lucky-dialog-fade-enter-active {
  animation: lucky-dialog-fade-in 0.3s;
}

.lucky-dialog-fade-leave-active {
  animation: lucky-dialog-fade-out 0.3s;
}

@keyframes lucky-dialog-fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes lucky-dialog-fade-out {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
