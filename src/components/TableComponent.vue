<template>
  <div class="table-component" v-loading="loading">
    <header>
      <div class="header-operate">
        <!-- 操作按钮插槽 -->
        <slot name="operateBtn"></slot>
        <el-button
          v-for="(btnItem, btnIndex) in propConfig.btnList"
          :key="btnIndex"
          :class="btnItem.class"
          :type="btnItem.style"
          :icon="btnItem.icon"
          size="medium"
          @click="toEmitFunc(btnItem.func)"
        >{{btnItem.text}}</el-button>
      </div>
      <div class="header-filter">
        <!-- 筛选项插槽 -->
        <slot name="filter"></slot>
        <el-select
          class="filter-iterm"
          v-if="propConfig.showFilter"
          v-model="filter"
          size="small"
          :placeholder="propConfig.filterPlaceholder"
          :clearable="true"
          filterable
          @change="handleSelect"
        >
          <el-option
            v-for="(item, index) in propConfig.filterOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-if="propConfig.showDatePick"
          v-model="dateRange"
          class="filter-iterm"
          align="right"
          size="small"
          format="timestamp"
          value-format="timestamp"
          :type="propConfig.datePickType"
          :clearable="true"
          :start-placeholder="propConfig.startPlaceholder"
          :end-placeholder="propConfig.endPlaceholder"
          @change="handleTimerange"
        ></el-date-picker>
        <el-input
          class="table-search filter-iterm"
          v-if="propConfig.showSearch"
          size="small"
          :placeholder="propConfig.searchPlaceholder"
          v-model="search"
          @keyup.13.native="toSearch"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="toSearch"></i>
        </el-input>
      </div>
    </header>
    <section class="table-area">
      <el-table
        :data="tableData.tbody"
        style="width: 100%"
        @selection-change="handleSelection"
        @sort-change="handleSort"
      >
        <el-table-column v-if="tableData.isMulti" type="selection" width="50"></el-table-column>
        <template v-for="(item, index) in tableData.thead">
          <el-table-column
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :sortable="item.sortable"
          >
            <template slot-scope="scope">
              <span class="table-operation" v-if="item.prop === 'operation' && scope.row.hasOwnProperty('operation')">
                <span
                  class="text-btn"
                  v-for="(item, index) in scope.row.operation"
                  :class="item.type"
                  :key="index"
                  @click="toEmitFunc(item.event, scope.row)"
                >{{item.text}}</span>
              </span>
              <span
                v-else-if="item.formatType === 'link'"
                :class="item.formatClass || 'to-detail-link'"
                :title="scope.row[item.prop]"
                @click="toLink(item.linkUrl, scope.row)"
              >{{scope.row[item.prop]}}</span>
              <span
                class="default-cell"
                v-else-if="!item.formatFn || item.formatFn === ''"
                :title="scope.row[item.prop]"
              >{{scope.row[item.prop]}}</span>
              <span
                v-else-if="item.formatType === 'dom'"
                :class="item.formatFn"
                v-html="formatFunc(item.formatFn, scope.row[item.prop], scope.row)"
              ></span>
              <span
                v-else
                :class="item.formatFn"
                :title="formatFunc(item.formatFn, scope.row[item.prop], scope.row)"
              >{{formatFunc(item.formatFn, scope.row[item.prop], scope.row)}}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </section>
    <el-pagination
      class="table-pagination"
      v-if="tableData.pageInfo.total > tableData.pageInfo.size"
      layout="total, prev, pager, next, jumper"
      :current-page.sync="tableData.pageInfo.page"
      :page-size="tableData.pageInfo.size"
      :total="tableData.pageInfo.total"
      @current-change="pageChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    tableConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tableData: {
      type: Object,
      default: () => {
        return {
          thead: [],
          tbody: [],
          isMulti: false,
          pageInfo: { page: 1, size: 10, total: 0 }
        }
      }
    },
    loading: { type: Boolean, default: false }
  },
  data () {
    return {
      defaultConfig: {
        btnList: [],
        showSearch: true,
        searchPlaceholder: '请输入',
        showFilter: false,
        filterPlaceholder: '请选择',
        filterOptions: [],
        showDatePick: false,
        datePickType: 'daterange',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
      },
      search: '',
      dateRange: [],
      filter: ''
    }
  },
  computed: {
    propConfig () {
      return { ...this.defaultConfig, ...this.tableConfig }
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    toEmitFunc (funName, params) {
      this.$emit(funName, params)
    },
    toSearch () {
      this.toEmitFunc('setFilter', { search: this.search, page: 1 })
    },
    pageChange (val) {
      this.toEmitFunc('setFilter', { page: val })
    },
    handleSelection (val) {
      let cluster = {
        id: [],
        status: [],
        grantee: [],
        rows: []
      }
      val.forEach(element => {
        cluster.id.push(element.id)
        cluster.status.push(element.status)
        cluster.rows.push(element)
        if (element.grantee) cluster.grantee.push(element.grantee)
      })
      this.toEmitFunc('selectionChange', cluster)
    },
    handleSort (value) {
      this.toEmitFunc('setFilter', {
        prop: value.prop,
        order: value.order
      })
    },
    handleTimerange () {
      if (this.dateRange) {
        this.toEmitFunc('setFilter', {
          startTime: this.dateRange[0],
          endTime: this.dateRange[1]
        })
      } else {
        this.toEmitFunc('setFilter', {
          startTime: '',
          endTime: ''
        })
      }
    },
    handleSelect () {
      this.toEmitFunc('setFilter', {
        filter: this.filter
      })
    },
    toLink (url, row) {
      if (url) {
        this.$router.push(`${url}/${row.id}`)
      } else {
        this.$router.push(this.$route.path + '/detail/' + row.id)
      }
    }
  }
}
</script>

<style lang="scss">
.table-component {
  background: #ffffff;
  header {
    height: 36px;
    margin-bottom: 18px;
    overflow: hidden;
    .header-operate {
      float: left;
    }
    .header-filter {
      float: right;
      .table-search {
        width: 200px;
        .el-icon-search {
          cursor: pointer;
        }
      }
      .el-select {
        width: 150px;
      }
      .filter-iterm {
        float: left;
        margin-left: 10px;
      }
      .el-date-editor--timerange,
      .el-date-editor--daterange {
        &.el-input__inner {
          width: 220px;
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
  .to-detail-link {
    color: #1c92ff;
    cursor: pointer;
    &:hover {
      color: #66b1ff;
    }
  }
  .table-pagination {
    margin-top: 20px;
  }
}
</style>
