<template>
  <div class="home_page">
    <header class="home_header">我是头部</header>
    <div class="home_content">
      <aside class="left_menu">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
          </el-menu-item>
        </el-menu>
      </aside>
      <div class="right_content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { adminPlatformMenu } from '@/config/menuConfig'
export default {
  components: {},
  props: {},
  data() {
    return {
    }
  },
  computed: {
    defaultActive () {
      return ''
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
.home_page {
  .home_header {
    height: 60px;
    line-height: 60px;
    color: #ffffff;
    background: #545c64;
    text-align: center;
  }
  .home_content {
    height: calc(100vh - 60px);
    min-height: 800px;
    .left_menu {
      width: 200px;
    }
  }
}
</style>
