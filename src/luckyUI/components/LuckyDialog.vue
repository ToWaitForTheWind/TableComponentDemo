/**
* 版本号：v1.0
* 创建人：zoom
* 创建时间：2019/07/15
* 描述：
    visible  是否显示Dialog，需使用.sync修饰符  boolean  默认：false
    showTitle  是否显示标题  boolean  默认：true
    title  标题内容  string  默认：'标题'
    width  模态框宽度  number  默认：592
    height  模态框高度  number
    maxHeight  模态框最大高度  number
    before-close  关闭前的回调，会暂停 Dialog 的关闭  function(done)，done 用于关闭 Dialog
*/
<template>
  <transition name="dialog-fade">
    <div v-if="visible" class="lucky-dialog">
      <div class="dialog">
        <div class="dialog-body" :style="`width: ${width}px;`">
          <header>
            <span v-if="showTitle" class="title">{{ title }}</span>
            <div v-if="showClose" class="close el-icon-close" @click="handleClose"></div>
          </header>
          <div class="body self-scroll" :style="`height: ${height}px; max-height: ${maxHeight}px;`">
            <slot></slot>
            <div class="operate">
              <slot name="operate"></slot>
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
  components: {
  },
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: '标题' },
    showTitle: { type: Boolean, default: true },
    beforeClose: Function,
    width: { type: Number, default: 592 },
    height: { type: Number },
    maxHeight: { type: Number },
    showClose: { type: Boolean, default: true }
  },
  data () {
    return {
    }
  },
  watch: {
    'visible' (val) {
    }
  },
  methods: {
    closeDialog () {
      this.$emit('update:visible', false)
    },
    handleClose () {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    hide (cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false)
        this.$emit('visible-change', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-fade-enter,
.dialog-fade-leave-to {
  opacity: 0;
}
.lucky-dialog {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 999;
  .dialog {
    width: 100%;
    height: 100%;
    background: transparent;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    header {
      padding: 16px 24px;
      .title {
        display: block;
        text-align: left;
        font-size: 18px;
        color: #363638;
        font-weight: bold;
        line-height: 24px;
      }
    }
    .dialog-body {
      background: #ffffff;
      position: relative;
      border-radius: 4px;
      .body {
        padding: 0 24px 24px;
        overflow: auto;
      }
    }
  }
  .lucky-mask-layer {
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.5;
  }
  .close {
    position: absolute;
    top: 18px;
    right: 20px;
    cursor: pointer;
    font-size: 20px;
    color: #c3c5cc;
    &:hover {
      color: #1c92ff;
    }
  }
  .operate {
    text-align: right;
  }
}
</style>
