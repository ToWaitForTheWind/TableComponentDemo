<template>
  <div class="common-select" ref="commonEasySelect" :style="`width: ${width};`">
    <Dropdown
      ref="dropDownRef"
      :visible="visible"
      trigger="custom"
      :placement="currentConfig.placement"
      :transfer="currentConfig.transfer"
      class="easy-select-dropdown"
      :class="[
        currentConfig.size,
        {
          'is-multiple': currentConfig.multiple,
          'is-single': !currentConfig.multiple,
          'is-disabled': disabled
        }
      ]"
      :transfer-class-name="
        `easy-select-dropdown ${currentConfig.transferClass} ${
          currentConfig.size
        } ${currentConfig.multiple ? 'is-multiple' : ''} ${
          disabled ? 'is-disabled' : ''
        }`
      "
      @on-clickoutside="onClickOutSide"
    >
      <div
        class="trigger-area"
        @mouseover="isHover = true"
        @mouseout="isHover = false"
        @click="toClickSearch"
      >
        <template v-if="$slots.trigger">
          <slot name="trigger"></slot>
          <i
            v-if="currentConfig.showDownArrow"
            class="iconfont iconxiala1 trigger-arrow"
            :class="{ 'is-open': visible }"
          ></i>
        </template>
        <template v-else>
          <div
            class="trigger-search-area"
            :class="{
              'is-collapse': currentConfig.collapse,
              'is-focus': visible
            }"
            :style="`width: ${width};`"
          >
            <div class="select-info">
              <!-- 多选 -->
              <template v-if="currentConfig.multiple">
                <div v-if="selectedDatas.length === 0" class="text-area">
                  <i-input
                    v-if="currentConfig.filter && visible"
                    v-model="filterValue"
                    class="hide-input"
                    ref="hide-input"
                    size="small"
                    :placeholder="filterPlaceholder"
                    style="width: 80px;"
                    @on-focus="filterFocus"
                    @on-blur="filterBlur"
                    @on-change="event => searchItem(event.target.value)"
                  ></i-input>
                  <div v-else class="placeholder-text">{{ placeholder }}</div>
                </div>
                <div
                  v-else-if="selectedDatas.length > 0"
                  class="selected-data text-area"
                >
                  <template v-if="!currentConfig.collapse">
                    <span
                      v-for="(item, index) in selectedDatas"
                      :key="index"
                      class="selected-tag"
                    >
                      <span class="tag-text" :title="item[currentProps.label]">
                        {{ item[currentProps.label] }}
                      </span>
                      <i
                        v-if="!disabled"
                        class="iconfont iconshanchu4"
                        @click.stop="toRemoveSelect(item)"
                      ></i>
                    </span>
                  </template>
                  <template v-else>
                    <span class="selected-tag">
                      <span class="tag-text">
                        {{ `${selectedDatas.length}项` }}
                      </span>
                    </span>
                    <span
                      v-show="!(currentConfig.filter && visible)"
                      class="select-data-text"
                      :title="selectedDataText"
                    >
                      {{ selectedDataText }}
                    </span>
                  </template>
                  <i-input
                    v-if="currentConfig.filter && visible"
                    v-model="filterValue"
                    class="hide-input"
                    ref="hide-input"
                    size="small"
                    :placeholder="filterPlaceholder"
                    style="width: 80px;"
                    @on-focus="filterFocus"
                    @on-blur="filterBlur"
                    @on-change="event => searchItem(event.target.value)"
                  ></i-input>
                </div>
              </template>
              <!-- 单选 -->
              <template v-else>
                <i-input
                  v-show="currentConfig.filter && visible"
                  v-model="filterValue"
                  class="hide-input"
                  ref="hide-input"
                  size="small"
                  :placeholder="filterPlaceholder"
                  @on-focus="filterFocus"
                  @on-blur="filterBlur"
                  @on-change="event => searchItem(event.target.value)"
                ></i-input>
                <div
                  v-show="
                    !(currentConfig.filter && visible) &&
                      selectedDatas.length === 0
                  "
                  class="placeholder-text"
                >
                  {{ placeholder }}
                </div>
                <div
                  v-show="
                    !(currentConfig.filter && visible) &&
                      selectedDatas.length > 0
                  "
                  class="single-selected-data"
                  :title="currentSelectValue"
                >
                  {{ currentSelectValue }}
                </div>
              </template>
            </div>
            <i
              v-if="isFilterFocus"
              class="iconfont iconsousuo4 filter-icon"
              @click.stop
            ></i>
            <template v-else>
              <i
                v-if="
                  !isHover ||
                    selectedDatas.length === 0 ||
                    (isHover && !currentConfig.clearable) ||
                    disabled
                "
                class="iconfont iconxiala1 operate-icon"
                :class="{ 'is-open': visible }"
              ></i>
              <i
                v-if="
                  isHover &&
                    selectedDatas.length > 0 &&
                    currentConfig.clearable &&
                    !disabled
                "
                class="iconfont iconqingkong1 operate-icon"
                @click.stop="toClearAllSelect"
              ></i>
            </template>
          </div>
        </template>
      </div>
      <DropdownMenu
        slot="list"
        class="dropdown-menu-area"
        :style="`width: ${dropdownWidth};`"
      >
        <slot name="top"></slot>
        <div v-if="currentConfig.search" class="search-area" @click.stop>
          <i-input
            ref="searchRef"
            v-model="searchValue"
            class="search-input"
            size="small"
            autofocus
            prefix=""
            :placeholder="searchPlaceholder"
            style="width: 100%;"
            @on-change="event => searchItem(event.target.value)"
          >
            <i class="iconfont iconsousuo4" slot="prefix"></i>
          </i-input>
        </div>
        <div
          v-if="
            currentConfig.mode === 'list' &&
              currentConfig.multiple &&
              currentConfig.showSelectAll
          "
          class="select-all"
          @click.stop="toSelectAll"
        >
          <i class="iconfont iconquanxuan"></i>
          <span>{{ alreadySelectAll ? '全不选' : '全选' }}</span>
        </div>
        <div
          class="data-container"
          :style="`max-height: ${dropdownMaxHeight}; overflow: auto;`"
          @click.stop
        >
          <div v-if="loading" class="loading-content">
            <svg class="circular" viewBox="25 25 50 50">
              <circle
                class="path"
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="#4084ff"
                stroke-width="3"
                stroke-miterlimit="10"
              ></circle>
            </svg>
            <div class="loading-text primary-color">{{ loadingText }}</div>
          </div>
          <template v-else>
            <template v-if="currentDataList.length > 0">
              <template v-if="currentConfig.mode === 'list'">
                <div
                  v-for="(item, index) in currentDataList"
                  :key="index"
                  class="data-item"
                  :title="item[currentProps.label]"
                  :class="{
                    'is-checked': isChecked(item),
                    'can-not-select': item[currentProps.canNotSelect],
                    'is-disabled': item[currentProps.disabled]
                  }"
                  @click.stop="toSelect(index, item)"
                >
                  <div class="data-label">
                    <slot name="listItem" :listItem="item">
                      <span
                        v-html="
                          filterShowName(item[currentProps.label], searchValue)
                        "
                      ></span>
                    </slot>
                  </div>
                  <i
                    v-if="isChecked(item) && currentConfig.multiple"
                    class="iconfont iconxuanzhong"
                  ></i>
                </div>
              </template>
              <template v-if="currentConfig.mode === 'tree'">
                <EasyTree
                  :data="currentDataList"
                  :checked-values="selectedDataValues"
                  :search-value="searchValue"
                  :default-props="currentProps"
                  :multiple="currentConfig.multiple"
                  @change="treeCheckedChange"
                >
                  <template #listItem="{ listItem }">
                    <slot name="listItem" :listItem="listItem"></slot>
                  </template>
                </EasyTree>
              </template>
            </template>
            <div v-else class="no-data">{{ emptyText }}</div>
          </template>
        </div>
        <div
          v-if="currentConfig.showSelectCount && currentConfig.multiple"
          class="select-count"
        >
          <span>已选</span>
          <span class="primary-color">{{ selectedDatas.length }}</span>
          <span>项</span>
        </div>
        <slot name="footer"></slot>
        <div v-if="showErrorMsg" class="error-msg danger-color">
          {{ currentConfig.disabledErrorMsg }}
        </div>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import EasyTree from '../EasyTree'
import _ from 'lodash'

export default {
  components: { EasyTree },
  props: {
    value: {
      // v-model绑定的值
      type: [Array, Number, String, Object],
      default: null
    },
    basicConfig: {
      // 可以选择性设置，不要求全部传递
      type: Object,
      default: () => {}
    },
    dataList: { type: Array, default: () => [] }, // 用于渲染可选列表的数据
    defaultProps: { type: Object, default: () => {} }, // 可以选择性设置，不要求全部传递
    placeholder: { type: String, default: '请选择' }, // 外部选择器的placeholder
    searchPlaceholder: { type: String, default: '请输入' }, // 下拉内部搜索输入框的placeholder
    disabled: { type: Boolean, default: false }, // 是否禁用
    loading: { type: Boolean, default: false }, // 数据展示是否处于loading状态
    loadingText: { type: String, default: '加载中' }, // 数据展示loading状态展示文案
    width: { type: String, default: '200px' }, // 组件宽度，默认200px
    dropdownWidth: { type: String, default: '200px' }, // 组件下拉框宽度，默认200px
    dropdownMaxHeight: { type: String, default: '230px' }, // 组件下拉框最大高度，默认230px
    emptyText: { type: String, default: '暂无数据' } // 下拉为空时的展示文案
  },
  data() {
    return {
      visible: false,
      isHover: false, // 是否处于hover状态
      currentDataList: [], // 实际用于渲染的可选列表数据
      selectedDatas: [], // 已选择数据
      selectedDataValues: [], // 已选择数据value值
      searchValue: '', // 搜索框绑定的值
      filterValue: '', // 设置筛选后输入的内容
      isFilterFocus: false, // 是否处于聚焦状态
      showErrorMsg: false // 是否展示错误信息
    }
  },
  computed: {
    currentSelectValue() {
      if (this.selectedDatas.length > 0)
        return this.selectedDatas[0][this.currentProps.label]
      else return ''
    },
    currentConfig() {
      let config = {
        theme: 'light', // 主题风格（light, dark）
        placement: 'bottom-start', // dropdown位置（参考view-design的Dropdown组件）
        transfer: false, // 是否设置dropdown为transfer模式
        transferClass: '',
        size: 'default', // 组件尺寸（small, middle, default）
        multiple: false, // 是否多选
        clearable: false, // 是否一键清空
        filter: false, // 是否支持可搜索功能
        search: false, // 是否展示下拉搜索框
        collapse: false, // 是否折叠标签
        showSelectAll: false, // 是否展示全选、全不选
        showSelectCount: false, // 是否展示已勾选数量
        useObjectValue: false, // 使用对象作为value绑定的值
        noValue: false, // 不通过v-model绑定值（当noValue与useObjectValue一同出现时，以useObjectValue逻辑为先）
        showDownArrow: true, // 当使用自定义触发下拉的时候通过此配置控制是否展示下拉箭头
        showDisabledError: false, // 设置点击disabled状态选项时是否展示错误信息
        disabledErrorMsg: '', // 点击disabled状态选项时展示的错误信息
        mode: 'list' // 设置数据格式是tree还是list
      }
      return { ...config, ...this.basicConfig }
    },
    currentProps() {
      let props = {
        label: 'label',
        value: 'value',
        children: 'children',
        disabled: 'disabled',
        canNotSelect: 'canNotSelect'
      }
      return { ...props, ...this.defaultProps }
    },
    selectedDataText() {
      let labelList = this.selectedDatas.map(
        item => item[this.currentProps.label]
      )
      return labelList.join('、')
    },
    filterPlaceholder() {
      if (this.currentConfig.multiple) {
        // 多选
        if (this.selectedDatas.length) {
          // 已勾选数据
          if (this.currentConfig.collapse) return this.selectedDataText
          // 折叠
          else return ''
        } else return this.placeholder
      } else {
        // 单选
        if (this.currentSelectValue) return this.currentSelectValue
        else return this.placeholder
      }
    },
    alreadySelectAll() {
      // 当前是否已经全选
      let res = true
      for (let item of this.dataList) {
        if (
          !item[this.currentProps.disabled] &&
          this.selectedDataValues.findIndex(
            val => val == item[this.currentProps.value]
          ) === -1
        ) {
          res = false
          break
        }
      }
      return res
    }
  },
  watch: {
    value: {
      handler() {
        this.initData()
      },
      deep: true
    },
    dataList: {
      handler(arr) {
        this.toSetCurrentDataList(arr)
        this.toInitSelectDatas()
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  mounted() {
    this.initData()
  },
  methods: {
    // 初始化已勾选数据
    initData() {
      if (this.currentConfig.useObjectValue) {
        // 当使用对象作为value绑定的值时，只能是Object或者Array
        if (!Array.isArray(this.value) && typeof this.value !== 'object') {
          // 判断绑定值类型
          throw new Error('The value of v-model must be an array or an object') // 格式错误抛出异常
        } else {
          if (this.currentConfig.multiple) {
            // 多选，value必须是数组
            if (Array.isArray(this.value)) {
              this.selectedDatas = _.cloneDeep(this.value)
            } else throw new Error('The value of v-model must be an array') // 格式错误抛出异常
          } else {
            // 单选，value必须是对象
            if (!Array.isArray(this.value) && typeof this.value === 'object') {
              this.selectedDatas = [this.value]
            } else if (!this.value || JSON.stringify(this.value) === '{}') {
              this.selectedDatas = []
            } else throw new Error('The value of v-model must be an object') // 格式错误抛出异常
          }
          this.selectedDataValues = this.selectedDatas.map(
            item => item[this.currentProps.value]
          )
        }
      } else {
        if (
          !Array.isArray(this.value) &&
          this.currentConfig.multiple &&
          !this.currentConfig.noValue
        ) {
          // 判断绑定值类型
          throw new Error('The value of v-model must be an array') // 格式错误抛出异常
        }
        if (Array.isArray(this.value) && this.currentConfig.multiple) {
          this.selectedDataValues = this.value ? _.cloneDeep(this.value) : []
        } else this.selectedDataValues = this.value ? [this.value] : []
        this.toInitSelectDatas()
      }
    },
    toInitSelectDatas() {
      let selectedDatas = []
      if (this.currentConfig.mode !== 'tree') {
        this.selectedDataValues.forEach(value => {
          let findRes = this.dataList.find(
            item => value == item[this.currentProps.value]
          )
          if (findRes !== undefined) selectedDatas.push(findRes)
        })
      } else selectedDatas = this.getTreeSelectDatas(this.dataList)
      this.selectedDatas = _.cloneDeep(selectedDatas)
    },
    isChecked(item) {
      if (
        this.selectedDataValues.findIndex(
          val => val == item[this.currentProps.value]
        ) > -1
      )
        return true
      else return false
    },
    onClickOutSide() {
      // 关闭下拉，重置数据
      this.visible = false
      setTimeout(() => {
        // 添加延时，使得数据过渡不显得突兀
        this.filterValue = ''
        this.searchValue = ''
        this.currentDataList = _.cloneDeep(this.dataList)
      }, 300)
    },
    toClickSearch(e) {
      if (this.disabled) return
      if (e.target.nodeName === 'INPUT') {
        this.$refs['hide-input'].focus({ cursor: 'end' })
        return
      }
      this.visible = !this.visible
      this.$emit('onOpenChange', this.visible)
      if (this.currentConfig.filter && this.visible && !this.$slots.trigger) {
        this.$nextTick(() => {
          this.$refs['hide-input'].focus({ cursor: 'end' })
        })
      }
    },
    // 筛选
    searchItem: _.debounce(
      function(filterValue) {
        this.toSetCurrentDataList(this.dataList, filterValue)
      },
      500,
      { leading: true }
    ),
    // 高亮筛选字段
    filterShowName(val, searchKey) {
      if (!searchKey || !val) return val
      let keyValueCopy = searchKey
      // 一些特殊符号，需要进行转义，如| 要转成\|
      keyValueCopy = keyValueCopy
        .replace(/(\||\\|\^|\/|\$|\*|\+|\?)/, $ => `\\${$}`)
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
      let reg = new RegExp(keyValueCopy, 'g')
      return String(val).replace(
        reg,
        `<span class='danger-color'>${searchKey}</span>`
      )
    },
    // 过滤下拉列表
    toSetCurrentDataList(arr, filter) {
      if (!filter) this.currentDataList = _.cloneDeep(arr)
      else {
        let filterArr = []
        if (this.currentConfig.mode === 'tree') {
          filterArr = this.getFilteredList(arr, filter)
        } else {
          arr.forEach(item => {
            if (item[this.currentProps.label].indexOf(filter) > -1)
              filterArr.push(item)
          })
        }
        this.currentDataList = filterArr
      }
      this.updateDropdownPosition()
    },
    // 点击下拉列表某一项触发
    toSelect(index, selectItem) {
      if (selectItem[this.currentProps.disabled]) {
        this.$emit('disabledChecked', selectItem)
        if (this.currentConfig.showDisabledError) {
          // 当控制展示不可点选项信息时
          this.showErrorMsg = true
          setTimeout(() => {
            this.showErrorMsg = false
          }, 2000)
        }
        // 如果已回显的disabled状态的数据，点击将会去掉选择
        if (
          this.currentDataList[index][this.currentProps.value] ==
          selectItem[this.currentProps.value]
        ) {
          let findRes = this.selectedDataValues.findIndex(
            val => val == selectItem[this.currentProps.value]
          )
          if (findRes > -1) {
            this.selectedDataValues.splice(findRes, 1)
            this.selectedDatas.splice(findRes, 1)
            this.toEmitValue()
            this.toEmitChange(selectItem)
            this.updateDropdownPosition()
          }
        }
        return
      }
      if (selectItem[this.currentProps.canNotSelect]) return // canNotSelect节点标识点击无效
      if (!this.currentConfig.multiple) {
        // 单选
        if (selectItem[this.currentProps.value] == this.selectedDataValues[0]) {
          this.onClickOutSide()
          return
        }
        this.selectedDataValues.pop()
        this.selectedDataValues.push(selectItem[this.currentProps.value])
        this.selectedDatas.pop()
        this.selectedDatas.push(selectItem)
        this.toEmitValue()
        this.toEmitChange(selectItem)
        this.onClickOutSide() // 选中即关闭下拉
      } else {
        if (
          this.currentDataList[index][this.currentProps.value] ==
          selectItem[this.currentProps.value]
        ) {
          let checkedIndex = this.selectedDataValues.findIndex(
            val => val == selectItem[this.currentProps.value]
          )
          if (checkedIndex > -1) {
            // 当前已选中，则取消
            this.selectedDataValues.splice(checkedIndex, 1)
            this.selectedDatas.splice(checkedIndex, 1)
          } else {
            // 当前未选中，则存储
            this.selectedDataValues.push(selectItem[this.currentProps.value])
            this.selectedDatas.push(selectItem)
          }
        }
        this.toEmitValue()
        this.toEmitChange(selectItem)
        this.updateDropdownPosition()
      }
    },
    toRemoveSelect(selectItem) {
      if (this.disabled) return
      let findRes = this.selectedDataValues.findIndex(
        val => val == selectItem[this.currentProps.value]
      )
      if (findRes > -1) {
        this.selectedDataValues.splice(findRes, 1)
        this.selectedDatas.splice(findRes, 1)
      }

      this.toEmitValue()
      this.toEmitChange(selectItem)
      this.updateDropdownPosition()
    },
    toClearAllSelect() {
      if (this.disabled) return
      this.selectedDataValues = []
      this.selectedDatas = []

      this.toEmitValue()
      this.$emit('clear')
      this.updateDropdownPosition()
    },
    treeCheckedChange(selectItem) {
      if (selectItem[this.currentProps.disabled]) {
        this.$emit('disabledChecked', selectItem)
        if (this.currentConfig.showDisabledError) {
          // 当控制展示不可点选项信息时
          this.showErrorMsg = true
          setTimeout(() => {
            this.showErrorMsg = false
          }, 2000)
        }
        // 如果已回显的disabled状态的数据，点击将会去掉选择
        let findRes = this.selectedDataValues.findIndex(
          val => val == selectItem[this.currentProps.value]
        )
        if (findRes > -1) {
          this.selectedDataValues.splice(findRes, 1)
          this.selectedDatas.splice(findRes, 1)
          this.toEmitValue()
          this.toEmitChange(selectItem)
          this.updateDropdownPosition()
        }
        return
      }
      if (selectItem[this.currentProps.canNotSelect]) return // canNotSelect节点标识点击无效

      if (!this.currentConfig.multiple) {
        // 单选
        if (
          this.selectedDataValues.findIndex(
            val => val == selectItem[this.currentProps.value]
          ) > -1
        )
          return // 当前点击的值已选中
        this.selectedDataValues.pop()
        this.selectedDataValues.push(selectItem[this.currentProps.value])
        this.selectedDatas.pop()
        this.selectedDatas.push(_.cloneDeep(selectItem))
        this.toEmitValue()
        this.toEmitChange(selectItem)
        this.onClickOutSide() // 选中即关闭下拉
      } else {
        // 多选
        let findRes = this.selectedDataValues.findIndex(
          val => val == selectItem[this.currentProps.value]
        )
        if (findRes > -1) {
          // 当前点击的值已选中，则取消
          this.selectedDataValues.splice(findRes, 1)
          this.selectedDatas.splice(findRes, 1)
        } else {
          // 当前未选中，则存储
          this.selectedDataValues.push(selectItem[this.currentProps.value])
          this.selectedDatas.push(selectItem)
        }
        this.toEmitValue()
        this.toEmitChange(selectItem)
        this.updateDropdownPosition()
      }
    },
    getTreeSelectDatas(list) {
      let res = []
      list.forEach(item => {
        if (
          this.selectedDataValues.findIndex(
            val => val == item[this.currentProps.value]
          ) > -1
        )
          res.push(item)
        if (item[this.currentProps.children])
          res = [
            ...res,
            ...this.getTreeSelectDatas(item[this.currentProps.children])
          ]
      })
      return res
    },
    getFilteredList(list, filter) {
      let listForFilter = _.cloneDeep(list)
      let res = []
      listForFilter.forEach(item => {
        if (item[this.currentProps.children]) {
          let childrenFilterList = this.getFilteredList(
            item[this.currentProps.children],
            filter
          )
          if (childrenFilterList.length) {
            item[this.currentProps.children] = childrenFilterList
            res.push(item)
          } else if (item[this.currentProps.label].indexOf(filter) > -1)
            res.push(item)
        } else if (item[this.currentProps.label].indexOf(filter) > -1)
          res.push(item)
      })
      return res
    },
    toSelectAll() {
      if (this.loading) return
      if (this.alreadySelectAll) {
        // 当前已被全选，执行全不选
        this.toClearAllSelect()
      } else {
        // 当前未全选，执行全选
        this.selectedDatas = this.dataList.filter(
          data => !data[this.currentProps.disabled]
        )
        this.selectedDataValues = this.selectedDatas.map(
          item => item[this.currentProps.value]
        )
        this.toEmitValue()
        this.$emit('selectAll', this.selectedDatas)
        this.updateDropdownPosition()
      }
    },
    filterFocus() {
      setTimeout(() => {
        // 添加延时，使得过渡不显得突兀
        this.isFilterFocus = true
      }, 100)
    },
    filterBlur() {
      setTimeout(() => {
        // 添加延时，使得过渡不显得突兀
        this.isFilterFocus = false
      }, 200)
    },
    toEmitValue() {
      // 修改双向绑定的值
      if (this.currentConfig.multiple) {
        if (this.currentConfig.useObjectValue)
          this.$emit('input', _.cloneDeep(this.selectedDatas))
        else this.$emit('input', _.cloneDeep(this.selectedDataValues))
      } else {
        if (this.currentConfig.useObjectValue)
          this.$emit('input', this.selectedDatas[0])
        else this.$emit('input', this.selectedDataValues[0])
      }
    },
    toEmitChange(selectItem) {
      // 向外抛出change事件
      this.$emit('change', selectItem, this.selectedDatas)
    },
    updateDropdownPosition() {
      // 如果多选且不折叠，则需要重新计算下拉位置
      if (!this.currentConfig.multiple || this.currentConfig.collapse) return
      if (this.$refs.dropDownRef && this.$refs.dropDownRef.$refs.drop) {
        this.$refs.dropDownRef.$refs.drop.update()
      }
    },
    toClearSearchValue() {
      this.searchValue = ''
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
