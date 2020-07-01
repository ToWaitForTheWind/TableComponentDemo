<template>
  <LuckyTable :thead="thead" :getListFunc="getListFunc" :toRefreshList="toRefreshList">
    <template v-slot:status="slotProps">
      <el-tag :type="slotProps.status === 'enable' ? 'success' : 'danger'">{{ slotProps.status }}</el-tag>
    </template>
    <template v-slot:createAccount="slotProps">
      <el-tooltip class="item" effect="dark" :content="slotProps.createAccount" placement="top">
        <span>{{ slotProps.createAccount }}</span>
      </el-tooltip>
    </template>
  </LuckyTable>
</template>

<script>
import { getUserList } from '@/api/test'
export default {
  data() {
    return {
      getListFunc: getUserList,
      toRefreshList: false
    }
  },
  watch: {},
  computed: {
    thead() {
      return [
        {
          prop: 'name',
          label: 'userName',
          minWidth: '86'
        },
        {
          prop: 'username',
          label: 'accountName',
          minWidth: '94'
        },
        {
          prop: 'code',
          label: 'number',
          minWidth: '94'
        },
        {
          prop: 'status',
          label: 'accountStatus',
          minWidth: '100',
          formatType: 'slot'
        },
        {
          prop: 'roleNames',
          label: 'accountRole',
          minWidth: '164'
        },
        {
          prop: 'mobile',
          label: 'phone',
          minWidth: '112'
        },
        {
          prop: 'createAccount',
          label: 'createAccount',
          minWidth: '100',
          formatType: 'slot'
        },
        {
          prop: 'createTime',
          label: 'createTime',
          minWidth: '128'
        }
      ]
    }
  },
  created() {},
  mounted() {
    this.toRefreshList = !this.toRefreshList
  },
  methods: {}
}
</script>
<style lang="scss"></style>
