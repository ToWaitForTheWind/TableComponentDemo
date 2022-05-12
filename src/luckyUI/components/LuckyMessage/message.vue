<template>
  <transition name="lucky-message-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      :class="[
        'lucky-message',
        type ? `lucky-message-${type}` : '',
        customClass
      ]"
      :style="positionStyle"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <i
        class="lucky-message-icon iconfont"
        :class="customIcon ? customIcon : iconClass"
      ></i>
      <p class="lucky-message-content" :class="{ 'show-close': showClose }">
        {{ message }}
      </p>
      <i
        v-if="showClose"
        class="iconfont iconshanchu4 lucky-message-close"
        @click="toClose"
      ></i>
    </div>
  </transition>
</template>

<script>
const iconTypeMap = {
  success: 'iconchenggong',
  primary: 'iconxinxi1',
  warning: 'icongaojing',
  danger: 'iconbaocuo'
}
export default {
  data() {
    return {
      visible: false,
      message: '',
      type: 'primary',
      duration: 3000,
      customIcon: '',
      customClass: '',
      onClose: null,
      showClose: false,
      verticalOffset: 20,
      timer: null
    }
  },

  computed: {
    iconClass() {
      let type = this.type ? this.type : 'primary'
      return iconTypeMap[type]
    },
    positionStyle() {
      return { top: `${this.verticalOffset}px` }
    }
  },
  watch: {},
  mounted() {
    this.startTimer()
  },
  methods: {
    handleAfterLeave() {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },
    toClose() {
      this.visible = false
      if (typeof this.onClose === 'function') {
        this.onClose(this)
      }
    },
    clearTimer() {
      clearTimeout(this.timer)
    },
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (this.visible) this.toClose()
        }, this.duration)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lucky-message {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.3s, transform 0.4s, top 0.4s;
  overflow: hidden;
  display: flex;
  align-items: center;
  background: #fff;
  box-shadow: 0 12px 48px 16px rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  padding: 10px 16px;
}

.lucky-message-icon {
  font-size: 16px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  margin-right: 8px;
}

.lucky-message-content {
  font-size: 14px;
  color: #262b39;
  line-height: 20px;
  max-width: 600px;
  word-break: break-all;
}

.lucky-message-close {
  font-size: 16px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  margin-left: 8px;
  cursor: pointer;
  color: #b9bac1;

  &:hover {
    opacity: 0.6;
  }
}

.lucky-message-primary {
  .lucky-message-icon {
    color: #4084ff;
  }
}

.lucky-message-success {
  .lucky-message-icon {
    color: #1bad69;
  }
}

.lucky-message-warning {
  .lucky-message-icon {
    color: #f69c09;
  }
}

.lucky-message-danger {
  .lucky-message-icon {
    color: #ea3636;
  }
}

.lucky-message-fade-enter,
.lucky-message-fade-leave-active {
  opacity: 0;
  transform: translate(-50%, -100%);
}
</style>
