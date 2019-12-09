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
          unique-opened
          ref="sideBar"
          @select="handleSelect"
        >
          <template v-for="(item, index) in currentMenuList">
            <el-submenu v-if="item.hasOwnProperty('children') && item.children.length > 0" :key="index" :index="item.name">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.desc }}</span>
              </template>
              <template v-for="(secondItem, secondIndex) in item.children">
                <el-submenu v-if="secondItem.hasOwnProperty('children') && secondItem.children.length > 0" :key="secondIndex" :index="secondItem.name">
                  <template slot="title">{{ secondItem.desc }}</template>
                  <el-menu-item v-for="(thirdItem, thirdIndex) in secondItem.children" :key="thirdIndex" :index="thirdItem.name">{{ thirdItem.desc }}</el-menu-item>
                </el-submenu>
                <el-menu-item v-else :key="secondIndex" :index="secondItem.name">{{ secondItem.desc }}</el-menu-item>
              </template>
            </el-submenu>
            <el-menu-item v-else :key="index" :index="item.name">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.desc }}</span>
              </template>
            </el-menu-item>
          </template>
        </el-menu>
      </aside>
      <div class="right_content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { adminPlatformMenu, toFilterHavePermissionMenu } from '@/config/menuConfig'
export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    currentPath() {
      return this.$route.path
    },
    defaultActive() {
      let currentName = this.$route.name
      let nameArr = currentName.split('_')
      if (nameArr.length > 2) return nameArr[0] + '_' + nameArr[1]
      else return currentName
    },
    currentMenuList() {
      let currentPath = this.currentPath
      if (currentPath.indexOf('admin') !== -1) return toFilterHavePermissionMenu(adminPlatformMenu, this.authList)
      else return []
    },
    authList() {
      return {}
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push({ name: key })
    }
  }
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
    display: flex;
    .left_menu {
      width: 200px;
    }
    .right_content {
      width: calc(100% - 200px);
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
