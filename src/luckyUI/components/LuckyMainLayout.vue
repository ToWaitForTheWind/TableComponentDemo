<template>
  <div class="lucky-main-layout">
    <header class="lucky-header">
      <div class="lucky-logo">
        <img src="../../assets/logo.png" />
        <span class="project-name">{{projectName}}</span>
      </div>
      <div class="lucky-operate">
        <el-popover
          v-if="showMessage"
          class="message-info"
          placement="bottom-end"
          :width="messageBoxWidth"
          trigger="hover"
        >
          <el-badge :value="12" class="item" slot="reference">
            <i class="el-icon-bell"></i>
          </el-badge>
        </el-popover>
        <img class="head-portrait" src="../../assets/logo.png" />
        <el-dropdown class="user-info" @command="handleCommand">
          <span class="el-dropdown-link">
            用户角色
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">操作1</el-dropdown-item>
            <el-dropdown-item command="b">操作2</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <div class="lucky-bottom">
      <aside class="lucky-aside">
        <div class="collapse-btn">
          <lucky-button type="primary" size="small" @click="toCollapse">
            <i class="el-icon-sort" style="margin-right: 0; transform: rotate(90deg);"></i>
          </lucky-button>
        </div>
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          background-color="#1C212E"
          text-color="#5B7287"
          active-text-color="#1C92FF"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">导航一</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <span slot="title">选项4</span>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
          </el-menu-item>
        </el-menu>
      </aside>
      <div class="lucky-content" :class="{ leftCollapse: isCollapse }">aaaaaaaaaaaaaaaaaaaaaaa</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    projectName: { type: String, default: '' },
    showMessage: { type: Boolean, default: true },
    messageBoxWidth: { type: Number, default: 400 }
  },
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    handleCommand (command) {
      console.log(command)
    },
    toCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="scss">
.lucky-main-layout {
  // min-width: 1366px;
  color: #ffffff;
  .lucky-header {
    width: 100%;
    height: 60px;
    line-height: 60px;
    background-image: linear-gradient(
      90deg,
      #282e40 0%,
      #38435c 52%,
      #282f40 100%
    );
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
    .lucky-logo {
      img {
        width: 32px;
        height: 32px;
        line-height: 0;
        font-size: 0;
        margin: 14px 10px 14px 0;
      }
      .project-name {
        float: right;
        font-size: 14px;
        color: #ffffff;
      }
    }
    .lucky-operate {
      .message-info {
        float: left;
        margin-right: 24px;
        .el-badge__content.is-fixed {
          transform: translateX(100%);
        }
      }
      .head-portrait {
        width: 24px;
        height: 24px;
        border-radius: 12px;
        margin: 18px 8px 18px 0;
        float: left;
      }
      .user-info {
        font-size: 14px;
        color: #c2c5cc;
      }
    }
  }
  .lucky-bottom {
    height: calc(100vh - 60px);
    display: flex;
    overflow: auto;
    .lucky-aside {
      width: max-content;
      height: calc(100vh - 60px);
      overflow-x: hidden;
      overflow-y: auto;
      background: #1c212e;
      .collapse-btn {
        padding: 12px;
        overflow: hidden;
        .lucky-button {
          width: 46px;
          float: right;
        }
      }
      .el-menu {
        border-right: none;
      }
      .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 180px;
        min-height: 400px;
      }
    }
    .lucky-content {
      width: calc(100% - 180px);
      overflow: auto;
      color: #5a5b5f;
      transition: all ease-in-out 0.3s;
      &.leftCollapse {
        width: calc(100% - 70px);
      }
    }
  }
}
</style>
