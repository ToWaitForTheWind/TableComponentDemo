// 表格方法的mixins
export default {
  data() {
    return {
      // 表格数据，具体参考接口数据
      tableData: {
        thead: [],
        tbody: [],
        isMulti: false,
        pageInfo: { page: 1, size: 10, total: 0 }
      },
      // 表格是否处于loading状态
      loading: true,
      // 多选，已选中数据
      selection: [],
      // 查询条件，包括排序、搜索以及筛选
      searchCondition: {}
    }
  },
  mounted: function () { },
  methods: {
    // 多选事件, 返回选中的行及每行的当前状态
    selectionChange(value) {
      this.selection = value
    },
    afterListSet(res) {
      let formData = this.setOperation(res)
      if (formData.thead) {
        this.tableData.thead = JSON.parse(JSON.stringify(formData.thead))
      }
      this.tableData.tbody = formData.tbody
      if (formData.pageInfo) {
        this.tableData.pageInfo = JSON.parse(JSON.stringify(formData.pageInfo))
      }
      formData.isMulti && (this.tableData.isMulti = formData.isMulti)
      let query = JSON.parse(JSON.stringify(this.$route.query))
      this.$router.replace({
        query: Object.assign(query, { page: this.tableData.pageInfo.page })
      })
      this.loading = false
    },
    // 设置操作项
    setOperation(res) {
      let that = this
      let tdata = JSON.parse(JSON.stringify(res))
      if (that.operateConfig && that.operateConfig.optFunc) {
        for (let i in tdata.tbody) {
          let temp = that.operateConfig.optFunc(tdata.tbody[i])
          let operation = []
          for (let j in temp) {
            operation.push(that.operateConfig.optType[temp[j]])
          }
          that.$set(tdata.tbody[i], 'operation', operation)
        }
      }
      return tdata
    }
  }
}
