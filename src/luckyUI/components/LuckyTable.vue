<template>
  <div class="lucky_table" v-loading="isLoading">
    <header class="table_header" v-if="showHeader">
      <div class="operate_area clearfix">
        <div class="header_operate">
          <slot name="operate"></slot>
        </div>
        <div class="header_filter" v-if="!isHaveHideFilter">
          <slot name="filter"></slot>
          <template v-for="(item, index) in filterDesc">
            <div v-if="item.type === 'slot'" :key="index" class="filter_item">
              <slot :name="item.slotName"></slot>
            </div>
            <el-select
              v-else-if="item.type === 'select'"
              :key="index"
              class="filter_item"
              v-model="filters[item.model]"
              size="small"
              :placeholder="item.placeholder ? item.placeholder : '请选择'"
              clearable
              filterable
              :style="`width: ${item.width ? item.width : 220}px;`"
              @change="toFilter(item.model)"
            >
              <el-option
                v-for="item in optionsObj[item.model]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-date-picker
              v-else-if="item.type === 'datePicker'"
              :key="index"
              v-model="filters[item.model]"
              class="filter_item"
              :type="item.datePickerType"
              clearable
              :start-placeholde="item.startPlaceholder ? item.startPlaceholder : '开始日期'"
              :end-placeholde="item.endPlaceholder ? item.endPlaceholder : '结束日期'"
              :default-time="['00:00:00', '23:59:59']"
              align="right"
              range-separator="~"
              :style="`width: ${item.width ? item.width : 300}px;`"
              @change="handleTimerange(item.model)"
            ></el-date-picker>
            <el-input
              v-else-if="item.type === 'search'"
              :key="index"
              v-model="filters[item.model]"
              class="filter_item"
              size="small"
              :placeholder="item.placeholder ? item.placeholder : '请输入'"
              :style="`width: ${item.width ? item.width : 200}px;`"
              @keyup.13.native="toFilter(item.model)"
            >
              <i slot="suffix" class="el-input__icon el-icon-search" @click="toFilter(item.model)"></i>
            </el-input>
          </template>
        </div>
        <div class="header_filter" v-if="isHaveHideFilter">
          <lucky-button @click="toShowFilterArea">
            筛选查询
            <i class="icon-right" :class="showFilterArea ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </lucky-button>
        </div>
      </div>
      <div class="filter_area clearfix" v-if="showFilterArea && isHaveHideFilter">
        <slot name="filter"></slot>
        <template v-for="(item, index) in filterDesc">
          <div v-if="item.type === 'slot'" :key="index" class="filter_item">
            <slot :name="item.slotName"></slot>
          </div>
          <el-select
            v-else-if="item.type === 'select'"
            :key="index"
            class="filter_item"
            v-model="filters[item.model]"
            size="small"
            :placeholder="item.placeholder ? item.placeholder : '请选择'"
            clearable
            filterable
            :style="`width: ${item.width ? item.width : 220}px;`"
            @change="toFilter(item.model)"
          >
            <el-option
              v-for="item in optionsObj[item.model]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-date-picker
            v-else-if="item.type === 'datePicker'"
            :key="index"
            v-model="filters[item.model]"
            class="filter_item"
            :type="item.datePickerType"
            clearable
            :start-placeholde="item.startPlaceholder ? item.startPlaceholder : '开始日期'"
            :end-placeholde="item.endPlaceholder ? item.endPlaceholder : '结束日期'"
            :default-time="['00:00:00', '23:59:59']"
            align="right"
            range-separator="~"
            :style="`width: ${item.width ? item.width : 300}px;`"
            @change="handleTimerange(item.model)"
          ></el-date-picker>
          <el-input
            v-else-if="item.type === 'search'"
            :key="index"
            v-model="filters[item.model]"
            class="filter_item"
            size="small"
            :placeholder="item.placeholder ? item.placeholder : '请输入'"
            :style="`width: ${item.width ? item.width : 200}px;`"
            @keyup.13.native="toFilter(item.model)"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="toFilter(item.model)"></i>
          </el-input>
        </template>
      </div>
    </header>
    <section class="table_area">
      <el-table
        :data="tables.tbody"
        style="width: 100%"
        ref="lucky_table"
        @selection-change="handleSelection"
        @sort-change="handleSort"
      >
        <el-table-column v-if="tables.isMulti" type="selection" width="50"></el-table-column>
        <template v-for="(item, index) in tables.thead">
          <el-table-column
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :sortable="item.sortable"
            :fixed="item.prop === 'operation' ? 'right' : false"
          >
            <template slot-scope="scope">
              <div class="table_operation" v-if="item.prop === 'operation' && scope.row.hasOwnproperty('operation')">
                <template v-for="(item, index) in scope.row.operation">
                  <span
                    class=""
                    v-if="!useMoreOpt || index < useMoreIndex"
                    :key="index"
                    :class="item.type"
                    @click="$emit(item.event, scope.row)"
                    >{{ item.text }}
                  </span>
                </template>
                <el-dropdown
                  @command="handleCommand"
                  v-if="useMoreOpt && scope.row.operation.length > useMoreIndex"
                  trigger="click"
                  style="margin-left: 10px;"
                >
                  <span class="text-btn">
                    更多操作
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <template v-for="(item, index) in scope.row.operation">
                      <el-dropdown-item
                        :key="index"
                        v-if="index > useMoreIndex - 1"
                        :command="{ opt: item, row: scope.row }"
                        >{{ item.text }}</el-dropdown-item
                      >
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div v-else-if="item.formatType === 'slot'" :class="item.formatClass">
                <slot :name="item.prop" v-bind="scope.row"></slot>
              </div>
              <div
                v-else-if="item.formatType === 'linkByName'"
                :class="item.formatClass || 'to_detail_link'"
                :title="scope.row[item.prop]"
                @click="toRouteName(scope.row, item.linkInfo)"
              >
                {{ scope.row[item.prop] }}
              </div>
              <div v-else-if="!item.formatFn || item.formatFn === ''" :title="scope.row[item.prop]">
                {{ scope.row[item.prop] }}
              </div>
              <div
                v-else-if="item.formatType === 'text'"
                :class="item.formatFn"
                :title="formatFunc(item.formatFn, scope.row[item.prop], scope.row)"
                v-html="formatFunc(item.formatFn, scope.row[item.prop], scope.row)"
              ></div>
              <div
                v-else
                :class="item.formatFn"
                v-html="formatFunc(item.formatFn, scope.row[item.prop], scope.row)"
              ></div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </section>
    <el-pagination
      class="table_pagination"
      v-if="tables.pageInfo.total > tables.pageInfo.size"
      :total="tables.pageInfo.total"
      :current-page.sync="tables.pageInfo.page"
      :page-size="tables.pageInfo.size"
      @current-change="pageChange"
      layout="total, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    // 是否展示头部操作、筛选区域
    showHeader: { type: Boolean, default: true },
    // 是否使用隐式筛选区
    isHaveHideFilter: { type: Boolean, default: false },
    // 筛选项的描述
    filterDesc: { type: Array, default: () => [] },
    // 额外传参
    funcParams: { type: Object, default: () => {} },
    // 操作项的描述
    operateConfig: { type: Object, default: () => {} },
    // 分页大小
    pageSize: { type: Number, default: 10 },
    // 表头描述
    thead: { type: Array, default: () => [] },
    // 获取数据的方法
    getListFunc: { type: Function, required: true },
    // 控制表格刷新
    toRefreshList: { type: Boolean, default: false },
    // 是否采用隐藏过多操作项
    useMoreOpt: { type: Boolean, default: false },
    // 操作项过多隐藏界限
    useMoreIndex: { type: Number, default: 3 },
    // 是否将页码信息加入路由中
    isAssignPage: { type: Boolean, default: true }
  },
  data() {
    return {
      showFilterArea: false,
      isLoading: false,
      tables: {
        thead: [],
        tbody: [],
        pageInfo: { page: 1, size: 10, total: 0 },
        isMulti: false
      },
      filters: {},
      searchCondition: {},
      optionsObj: {}
    }
  },
  computed: {},
  watch: {
    funcParams: {
      handler(val) {
        this.searchCondition = { ...this.searchCondition, ...val }
      },
      deep: true
    },
    toRefreshList() {
      this.toGetList()
    },
    toReset() {
      this.filters = {}
      this.searchCondition = {}
      this.toGetList(this.funcParams)
    },
    filterDesc: {
      handler() {
        this.toSetSelectOptions()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.tables.pageInfo.size = this.pageSize
    if (this.isAssignPage) {
      if (this.$route.query.page) this.tables.pageInfo.page = this.$route.query.page
    }
  },
  mounted() {},
  methods: {
    async toGetList(value) {
      this.searchCondition = { ...this.searchCondition, ...value }
      this.isLoading = true
      let res = {}
      res = await this.getListFunc({ ...this.searchCondition, size: this.pageSize })
      console.log(res)
      let formatData = this.setOperation(res)
      if (res.code && res.code === '00000') {
        this.$emit('toEmitData', res.data)
        // 搜索结果总数>0
        // 搜索结果当前页结果总数为0
        // 当前页不是第一页
        if (
          parseInt(res.data.pageInfo.total) > 0 &&
          res.data.tbody.length === 0 &&
          parseInt(res.data.pageInfo.page) > 1
        ) {
          // 前往最后一页有数据的
          this.toGetList({ page: Math.ceil(parseInt(res.data.pageInfo.total) / parseInt(res.data.pageInfo.size)) })
          return false
        }
        this.afterListSet(formatData)
      }
      this.isLoading = false
    },
    afterListSet(res) {
      if (res.data.thead) this.tables.thead = JSON.parse(JSON.stringify(res.data.thead))
      else this.tables.thead = JSON.parse(JSON.stringify(this.thead))
      this.tables.tbody = JSON.parse(JSON.stringify(res.data.tbody))
      if (res.data.pageInfo) this.tables.pageInfo = JSON.parse(JSON.stringify(res.data.pageInfo))
      res.data.isMulti && (this.tables.isMulti = res.data.isMulti)
      if (this.isAssignPage) {
        let query = JSON.parse(JSON.stringify(this.$route.query))
        this.$router.replace({
          query: Object.assign(query, { page: this.tables.pageInfo.page })
        })
      }
      this.loading = false
    },
    // 设置操作项
    setOperation(res) {
      let that = this
      if (!res) return false
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
    },
    toFilter(model) {
      let filter = {}
      filter[model] = this.filters[model]
      this.toGetList({ ...filter, page: 1 })
    },
    handleTimeRange(model) {
      if (this.filters[model]) {
        this.toGetList({
          startTime: this.filters[model][0],
          endTime: this.filters[model][1],
          page: 1
        })
      } else this.toGetList({ startTime: '', endTime: '', page: 1 })
    },
    handleSelection(val) {
      let cluster = { ids: [], rows: [] }
      val.forEach((element) => {
        cluster.ids.push(element.id)
        cluster.rows.push(element)
      })
      this.toEmitFunc('selectionChange', cluster)
    },
    handleSort(val) {
      this.toGetList({ prop: val.prop, order: val.order })
    },
    pageChange(val) {
      this.toGetList({ page: value })
    },
    toSetSelectOptions() {
      let that = this
      if (that.filterDesc && that.filterDesc.length > 0) {
        that.filterDesc.forEach((item) => {
          if (item.type === 'select') that.toGetOptions(item.model, item.optionsFunc, item.funcParams)
        })
      }
    },
    async toGetOptions(model, optionsFunc, funcParams) {
      let res = {}
      res = await optionsFunc(funcParams)
      if (res.code && res.code === '00000') {
        this.optionsObj[model] = res.data
      }
    },
    toShowFilterArea() {
      this.showFilterArea = !this.showFilterArea
    },
    handleCommand(val) {
      this.$emit(val.opt.event, val.row)
    }
  }
}
</script>

<style lang="scss">
.lucky_table {
  background: #ffffff;
  .table_header {
    min-height: 36px;
    overflow: hidden;
    .operate_area {
      margin-bottom: 20px;
      .header_operate {
        float: left;
      }
      .header_filter {
        float: right;
        .el-cascader {
          line-height: 36px;
        }
        .table_search {
          width: 200px;
          .el-icon-search {
            cursor: pointer;
          }
        }
        .el-select {
          width: 150px;
        }
        .filter_item {
          float: left;
          margin-left: 10px;
        }
        .el-date-editor--timerange,
        .el-date-editor--daterange {
          &.el-input__inner {
            .el-range-input {
              width: 70px;
            }
            .el-range__close-icon {
              width: 14px;
            }
          }
        }
      }
    }
    .filter_area {
      clear: both;
      text-align: right;
      margin-bottom: 20px;
      .filter_item {
        margin-left: 10px;
        &.set_level {
          position: relative;
          margin: 10px;
          &:hover {
            box-shadow: 0 0 6px 0 rgba(96, 98, 107, 0.12);
            border-radius: 4px;
          }
        }
      }
      .table_search {
        width: 200px;
        .el-icon-search {
          cursor: pointer;
        }
      }
      .el-select {
        width: 150px;
      }
      .el-input__inner {
        height: 36px;
      }
      .el-input-number .el-input__inner {
        text-align: left;
      }
    }
    .el-input__inner {
      height: 36px;
      border-radius: 4px;
      border: 1px solid #dcdee6;
      &:hover,
      &:focus {
        border-color: #1c92ff;
      }
    }
  }
  .table_area {
    border: 1px solid #dcdee6;
    border-radius: 4px;
    padding: 0 24px;
    .el-table {
      &::before {
        height: 0;
      }
      .el-table__row {
        .cell {
          font-size: 12px;
          color: #48494d;
          white-space: nowrap;
        }
      }
      .el-table__body {
        tr:last-child {
          td {
            border-bottom: 0;
          }
        }
      }
      td,
      th.is-leaf {
        border-bottom: 1px solid #dcdee6;
      }
      th {
        .cell {
          font-size: 12px;
          color: #909199;
          font-weight: normal;
        }
      }
      .el-table__empty-text {
        color: #c0c1cc;
      }
    }
  }
  .table_pagination {
    margin-top: 20px;
    text-align: center;
    color: #48494d;
    .el-pagination__total {
      font-size: 14px;
      color: #48494d;
    }
    .btn-next,
    .btn-prev {
      border: 0;
      color: #48494d;
      &:hover {
        color: #1c92ff;
      }
    }
    .el-pager {
      .number {
        border: 0;
        font-weight: bold;
        margin: 0 8px;
        &.active {
          background: #ffffff;
          color: #1c92ff;
        }
      }
      .more {
        border: 0;
      }
    }
    .el-pagination__editor {
      width: 55px;
    }
  }
}
</style>
