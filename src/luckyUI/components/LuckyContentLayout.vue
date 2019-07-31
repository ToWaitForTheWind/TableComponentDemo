<template>
  <div class="lucky-content-layout">
    <header class="lucky-header">
      <div class="header-content">
        <div class="lucky-logo">
          <img src="../../assets/logo.png" />
          <span class="project-name">{{projectName}}</span>
        </div>
        <div class="lucky-menu">
          <el-menu
            class="el-menu-demo"
            mode="horizontal"
            background-color="#38435C"
            text-color="#ffffff"
            active-text-color="#1C92FF"
          >
            <el-menu-item index="1">处理中心</el-menu-item>
            <el-submenu index="2">
              <template slot="title">我的工作台</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
              <el-menu-item index="2-3">选项3</el-menu-item>
              <el-submenu index="2-4">
                <template slot="title">选项4</template>
                <el-menu-item index="2-4-1">选项1</el-menu-item>
                <el-menu-item index="2-4-2">选项2</el-menu-item>
                <el-menu-item index="2-4-3">选项3</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item index="3" disabled>消息中心</el-menu-item>
            <el-menu-item index="4">
              <a href="https://www.ele.me" target="_blank">订单管理</a>
            </el-menu-item>
          </el-menu>
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
      </div>
    </header>
    <div class="lucky-bottom">
      <div class="lucky-content">aaaaaaaaaaaaaaaaaaaaaaa</div>
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
    }
  }
}
</script>

<style lang="scss">
.lucky-content-layout {
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
    padding: 0 20px;
    box-sizing: border-box;
    .header-content {
      width: 1200px;
      margin: 0 auto;
      .lucky-logo {
        float: left;
        margin-right: 50px;
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
      .lucky-menu {
        .el-menu {
          float: left;
          .el-menu-item.is-active {
            border-bottom: 0;
          }
        }
      }
      .lucky-operate {
        float: right;
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
  }
  .lucky-bottom {
    height: calc(100vh - 60px);
    overflow: auto;
    .lucky-content {
      width: 1200px;
      margin: 0 auto;
    }
  }
}
</style>
