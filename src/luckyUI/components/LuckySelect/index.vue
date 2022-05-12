<template>
  <div class="lucky-select" :style="`width: ${width};`">
    <Dropdown
      ref="dropDownRef"
      :visible="visible"
      trigger="custom"
      :placement="currentConfig.placement"
      :transfer="currentConfig.transfer"
      class="lucky-select-dropdown"
      :class="[
        currentConfig.size,
        {
          'is-multiple': currentConfig.multiple,
          'is-single': !currentConfig.multiple,
          'is-disabled': disabled
        }
      ]"
      :transfer-class-name="
        `lucky-select-dropdown ${currentConfig.transferClass} ${
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
            class="trigger-search-area small-scroll-bar"
            :class="{
              'is-collapse': currentConfig.collapse,
              'is-focus': visible
            }"
            :style="`width: ${width};`"
          >
            <div class="select-info">
              <template v-if="$slots.customSetShow">
                <slot name="customSetShow"></slot>
              </template>
              <template v-else>
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
                        :class="{ 'delete-tag': isDeleted(item) }"
                      >
                        <span
                          class="tag-text"
                          :title="item[currentProps.label]"
                        >
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
                    :class="{
                      'delete-selected-data': isDeleted(selectedDatas[0])
                    }"
                    :title="currentSelectValue"
                  >
                    {{ currentSelectValue }}
                  </div>
                </template>
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
        :style="
          `min-width: ${currentConfig.mode === ECascader ? '136px' : width}; ${
            currentConfig.mode === ECascader ? '' : 'max-width: 400px;'
          }`
        "
      >
        <div class="top-slot" @click.stop>
          <slot name="top"></slot>
        </div>
        <div v-if="currentConfig.search" class="search-area" @click.stop>
          <div
            class="fake-input"
            :class="{ 'is-focus': isFocusSearch }"
            @mouseover="isHoverSearch = true"
            @mouseout="isHoverSearch = false"
          >
            <i class="iconfont iconsousuo4"></i>
            <i-input
              ref="searchRef"
              v-model="searchValue"
              class="search-input"
              size="small"
              autofocus
              prefix=""
              :placeholder="searchPlaceholder"
              @on-focus="isFocusSearch = true"
              @on-blur="isFocusSearch = false"
              @on-change="event => searchItem(event.target.value)"
            ></i-input>
            <i
              v-show="isHoverSearch && searchValue"
              class="iconfont iconqingkong1"
              @click.stop="toClearSearchValue"
            ></i>
          </div>
        </div>
        <div class="behind-search" @click.stop>
          <slot name="behind-search"></slot>
        </div>
        <div
          v-if="
            currentConfig.mode === EList &&
              currentConfig.multiple &&
              currentConfig.showSelectAll &&
              currentDataList.length > 0
          "
          class="select-all"
          @click.stop="toSelectAll"
        >
          <i class="iconfont iconquanxuan"></i>
          <span>{{ alreadySelectAll ? '全不选' : '全选' }}</span>
        </div>
        <div
          class="data-container small-scroll-bar"
          :style="`max-height: ${currentConfig.dropdownMaxLength * 27}px;`"
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
            <template
              v-if="
                currentDataList.filter(item => !item[currentProps.delete])
                  .length > 0
              "
            >
              <template v-if="currentConfig.mode === ETree">
                <LuckyVirtualTree
                  :data-list="currentDataList"
                  :show-number="currentConfig.dropdownMaxLength"
                  :item-height="27"
                  :checked-values="selectedDataValues"
                  :default-props="currentProps"
                  :basic-config="{
                    multiple: currentConfig.multiple,
                    defaultExpandAll:
                      currentConfig.defaultExpandAll ||
                      searchValue ||
                      filterValue,
                    defaultExpandLevel: currentConfig.defaultExpandLevel,
                    canNotSelectLevel: currentConfig.canNotSelectLevel,
                    useVirtualScrollNumber: currentConfig.useVirtualScrollNumber
                  }"
                  class="small-scroll-bar"
                  @change="treeCheckedChange"
                >
                  <template #listItem="{ listItem }">
                    <slot name="listItem" :listItem="listItem">
                      <span v-if="!searchValue">
                        {{ listItem[currentProps.label] }}
                      </span>
                      <template v-else>
                        <span
                          v-for="(filterItem, filterIndex) in filterShowName(
                            listItem[currentProps.label],
                            searchValue
                          )"
                          :key="filterIndex"
                          :class="{
                            'danger-color': filterItem.type === 'matched'
                          }"
                        >
                          {{ filterItem.val }}
                        </span>
                      </template>
                    </slot>
                  </template>
                </LuckyVirtualTree>
              </template>
              <template v-else-if="currentMode === EList">
                <LuckyVirtualList
                  :data-list="
                    currentDataList.filter(item => !item[currentProps.delete])
                  "
                  :show-number="currentConfig.dropdownMaxLength"
                  :item-height="27"
                  :use-virtual-scroll="useVirtualScroll"
                  class="small-scroll-bar"
                >
                  <template #listItem="{ listItem, listIndex }">
                    <div
                      v-if="!listItem[currentProps.delete]"
                      class="data-item"
                      :title="listItem[currentProps.label]"
                      :class="[
                        {
                          'is-checked': isChecked(listItem),
                          'can-not-select': listItem[currentProps.canNotSelect],
                          'is-disabled': listItem[currentProps.disabled]
                        },
                        listItem[currentProps.className]
                      ]"
                      @click.stop="toSelect(listIndex, listItem)"
                    >
                      <div class="data-label">
                        <slot name="listItem" :listItem="listItem">
                          <span
                            v-if="
                              !(currentConfig.mode === ECascader &&
                              currentMode === EList
                                ? filterValue
                                : searchValue)
                            "
                          >
                            {{ listItem[currentProps.label] }}
                          </span>
                          <template v-else>
                            <span
                              v-for="(filterItem,
                              filterIndex) in filterShowName(
                                listItem[currentProps.label],
                                currentConfig.mode === ECascader &&
                                  currentMode === EList
                                  ? filterValue
                                  : searchValue
                              )"
                              :key="filterIndex"
                              :class="{
                                'danger-color': filterItem.type === 'matched'
                              }"
                            >
                              {{ filterItem.val }}
                            </span>
                          </template>
                        </slot>
                      </div>
                      <i
                        v-if="isChecked(listItem) && currentConfig.multiple"
                        class="iconfont iconxuanzhong"
                      ></i>
                    </div>
                  </template>
                </LuckyVirtualList>
              </template>
              <template v-else-if="currentMode === ECascader">
                <Cascader
                  :data="currentDataList"
                  :checked-values="selectedDataValues"
                  :checked-datas="selectedDatas"
                  :search-value="searchValue"
                  :default-props="currentProps"
                  :multiple="currentConfig.multiple"
                  :visible="visible"
                  @change="cascaderCheckedChange"
                ></Cascader>
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
        <div class="footer-slot" @click.stop>
          <slot name="footer"></slot>
        </div>
        <div v-if="showErrorMsg" class="error-msg danger-color">
          {{ currentConfig.disabledErrorMsg }}
        </div>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import Cascader from './components/Cascader'
import { debounce, cloneDeep } from 'lodash-es'
import { filterShowName } from '../../utils/CommonMethods'
import { ETree, EList, ECascader } from '../../config/constant'

export default {
  components: { Cascader },
  provide() {
    return {
      currentConfig: this.currentConfig,
      currentProps: this.currentProps,
      toGetNodeParents: this.toGetNodeParents,
      filterShowName
    }
  },
  props: {
    value: { type: [Array, Number, String, Object], default: null }, // v-model绑定的值
    basicConfig: { type: Object, default: () => {} }, // 可以选择性设置，不要求全部传递
    dataList: { type: Array, default: () => [] }, // 用于渲染可选列表的数据
    defaultProps: { type: Object, default: () => {} }, // 可以选择性设置，不要求全部传递
    placeholder: { type: String, default: '请选择' }, // 外部选择器的placeholder
    searchPlaceholder: { type: String, default: '请输入' }, // 下拉内部搜索输入框的placeholder
    disabled: { type: Boolean, default: false }, // 是否禁用
    loading: { type: Boolean, default: false }, // 数据展示是否处于loading状态
    loadingText: { type: String, default: '加载中' }, // 数据展示loading状态展示文案
    width: { type: String, default: '200px' }, // 组件宽度，默认200px
    beforeTriggerVisible: { type: Function, default: null }, // 展开下拉前的触发方法
    emptyText: { type: String, default: '暂无数据' } // 下拉为空时的展示文案
  },
  data() {
    return {
      filterShowName,
      ETree,
      EList,
      ECascader,
      visible: false,
      isHover: false, // 是否处于hover状态
      currentDataList: [], // 实际用于渲染的可选列表数据
      selectedDatas: [], // 已选择数据
      selectedDataValues: [], // 已选择数据value值
      searchValue: '', // 搜索框绑定的值
      filterValue: '', // 设置筛选后输入的内容
      isFilterFocus: false, // 是否处于聚焦状态
      showErrorMsg: false, // 是否展示错误信息
      isHoverSearch: false, // search清空icon是否展示
      isFocusSearch: false, // search是否focus
      flatCascaderList: [], // 扁平化后的级联下拉数据
      currentMode: EList // 由于级联在搜索状态下展示与其正常情况下不同，需要进行mode变换
    }
  },
  computed: {
    currentSelectValue() {
      if (this.selectedDatas.length > 0) {
        if (
          this.currentConfig.mode === ECascader &&
          this.currentConfig.useValuePath
        ) {
          return `${this.selectedDatas
            .map(item => item[this.currentProps.label])
            .join(this.currentConfig.splitSymbol)}`
        } else {
          let res = this.selectedDatas[0][this.currentProps.label]
          if (
            this.currentConfig.showParentPath &&
            this.nodeParents.length > 0
          ) {
            res = `${this.nodeParents
              .map(item => item[this.currentProps.label])
              .join(this.currentConfig.splitSymbol)}${
              this.currentConfig.splitSymbol
            }${res}`
          }
          return res
        }
      } else return ''
    },
    currentConfig() {
      let config = {
        // theme: 'light', // 主题风格（light, dark）
        mode: EList, // 设置数据格式是tree/list/cascader
        placement: 'bottom-start', // dropdown位置（参考view-design的Dropdown组件）
        transfer: false, // 是否设置dropdown为transfer模式
        transferClass: '',
        size: 'default', // 组件尺寸（small, middle, default）
        multiple: false, // 是否多选（不支持cascader）
        clearable: false, // 是否一键清空
        filter: false, // 是否支持可搜索功能
        search: false, // 是否展示下拉搜索框
        collapse: false, // 是否折叠标签
        showSelectAll: false, // 是否展示全选、全不选
        showSelectCount: false, // 是否展示已勾选数量
        useObjectValue: false, // 使用对象作为value绑定的值（不支持cascader）
        noValue: false, // 不通过v-model进行值绑定（当noValue与useObjectValue一同出现时，以useObjectValue逻辑为先）
        showDownArrow: true, // 当使用自定义触发下拉的时候通过此配置控制是否展示下拉箭头
        showDisabledError: false, // 设置点击disabled状态选项时是否展示错误信息
        disabledErrorMsg: '', // 点击disabled状态选项时展示的错误信息
        showParentPath: false, // 展示选中的父级路径信息（仅在单选且mode为树形/级联时生效）
        splitSymbol: ' / ', // 当展示父节点信息的时候的分隔符
        dropdownMaxLength: 8, // 组件下拉框展示的最多条数，超出滚动
        trigger: 'hover', // 级联模式下触发下一级的方式
        useValuePath: false, // 级联模式下v-model的值是否是路径形式的
        disabledCanRemove: true, // 下选项中已被勾选但置灰的是否可被移除
        useVirtualScrollNumber: 50, // 使用虚拟滚动的临界值
        defaultExpandLevel: 1, // tree模式下默认展开层级数
        defaultExpandAll: false, // tree模式下默认是否展开全部
        canNotSelectLevel: 0, // tree模式下默认前几级不可选
        useFuzzySearch: true, // 是否使用大小写模糊搜索
        checkStrictly: false, // 在tree模式下是否强关联父子选择
        placeSelectedToTop: true // 在list模式下勾选内容是否置顶
      }
      return { ...config, ...this.basicConfig }
    },
    currentProps() {
      let props = {
        label: 'label',
        value: 'value',
        children: 'children',
        disabled: 'disabled', // 下拉节点置灰不可选
        canNotSelect: 'canNotSelect', // 下拉节点正常显示，但是不可选
        delete: 'delete', // 下拉节点不显示同时回显置灰
        className: 'className' // 自定义节点class
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
      for (let item of this.currentDataList) {
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
    },
    nodeParents() {
      // 储存树节点、级联节点的父节点
      let res = []
      if (this.selectedDatas.length > 0) {
        res = this.toGetNodeParents(
          this.selectedDatas[0][this.currentProps.value],
          this.dataList
        )
      }
      return res
    },
    useVirtualScroll() {
      return (
        this.currentDataList.length > this.currentConfig.useVirtualScrollNumber
      )
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
        this.toSetCurrentDataList(cloneDeep(arr))
        this.toInitSelectDatas()
        this.toPlaceSelectedToTop()
      },
      immediate: true,
      deep: true
    },
    searchValue(val) {
      this.$emit('onSearchValChange', val)
    },
    visible(val) {
      this.$emit('onOpenChange', val)
    },
    'currentConfig.mode'(val) {
      this.currentMode = val
    }
  },
  created() {},
  mounted() {
    this.initData()
  },
  methods: {
    // 初始化已勾选数据
    initData() {
      if (this.currentConfig.mode === ECascader) {
        // 级联单独处理
        if (this.currentConfig.useValuePath) {
          if (!Array.isArray(this.value))
            throw new Error('useValuePath模式下v-model的值必须是一个数组')
          this.selectedDataValues = cloneDeep(this.value)
          this.toSetCascaderDatas()
        } else {
          this.selectedDataValues =
            this.value || this.value === 0 ? [this.value] : []
          this.toInitSelectDatas()
        }
        this.currentMode = this.currentConfig.mode
        return
      }
      if (this.currentConfig.useObjectValue) {
        // 当使用对象作为value绑定的值时，只能是Object或者Array
        if (!Array.isArray(this.value) && typeof this.value !== 'object') {
          // 判断绑定值类型
          throw new Error(
            'useObjectValue模式下v-model的值必须是一个数组或者对象'
          ) // 格式错误抛出异常
        } else {
          if (this.currentConfig.multiple) {
            // 多选，value必须是数组
            if (Array.isArray(this.value)) {
              this.selectedDatas = cloneDeep(this.value)
            } else
              throw new Error(
                'useObjectValue模式多选情况下v-model的值必须是一个数组'
              ) // 格式错误抛出异常
          } else {
            // 单选，value必须是对象
            if (!this.value || JSON.stringify(this.value) === '{}') {
              this.selectedDatas = []
            } else if (
              !Array.isArray(this.value) &&
              typeof this.value === 'object'
            ) {
              this.selectedDatas = [this.value]
            } else
              throw new Error(
                'useObjectValue模式单选情况下v-model的值必须是一个对象'
              ) // 格式错误抛出异常
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
          throw new Error('多选情况下v-model的值必须是一个数组') // 格式错误抛出异常
        }
        if (Array.isArray(this.value) && this.currentConfig.multiple) {
          this.selectedDataValues = this.value ? cloneDeep(this.value) : []
        } else
          this.selectedDataValues =
            this.value || this.value === 0 ? [this.value] : []
        this.toInitSelectDatas()
      }
    },
    toInitSelectDatas() {
      if (this.currentConfig.useObjectValue) return
      // 根据value获取详细信息
      let selectedDatas = []
      if (this.currentConfig.mode === EList) {
        this.selectedDataValues.forEach(value => {
          let findRes = this.dataList.find(
            item => value == item[this.currentProps.value]
          )
          if (findRes !== undefined) selectedDatas.push(findRes)
          else {
            let notExitItem = {}
            notExitItem[this.currentProps.value] = value
            notExitItem[this.currentProps.label] = `${value}`
            notExitItem[this.currentProps.delete] = true
            selectedDatas.push(notExitItem)
          }
        })
      } else {
        let treeSelectedDatas = this.getTreeSelectDatas(this.dataList)
        this.selectedDataValues.forEach(value => {
          let findRes = treeSelectedDatas.find(
            item => value == item[this.currentProps.value]
          )
          if (findRes !== undefined) selectedDatas.push(findRes)
          else {
            let notExitItem = {}
            notExitItem[this.currentProps.value] = value
            notExitItem[this.currentProps.label] = `${value}`
            notExitItem[this.currentProps.delete] = true
            selectedDatas.push(notExitItem)
          }
        })
      }
      this.selectedDatas = cloneDeep(selectedDatas)
      // 由于存在只有value但是又不在下拉列表中的数据，所以这里反向通过datas重新获取一下values
      this.selectedDataValues = this.selectedDatas.map(
        item => item[this.currentProps.value]
      )
    },
    toSetCascaderDatas() {
      // 跟toInitSelectDatas方法做同样的事情，只不过这个只针对于级联的useValuePath模式
      let selectedDatas = []
      let dataList = this.dataList
      this.selectedDataValues.forEach(value => {
        let findRes = dataList.find(
          item => value == item[this.currentProps.value]
        )
        if (findRes !== undefined) {
          selectedDatas.push(findRes)
          if (
            findRes[this.currentProps.children] &&
            findRes[this.currentProps.children].length
          ) {
            dataList = findRes[this.currentProps.children]
          }
        }
      })
      this.selectedDatas = cloneDeep(selectedDatas)
    },
    isChecked(item) {
      // 判断当前节点是否被选中
      if (
        this.selectedDataValues.findIndex(
          val => val == item[this.currentProps.value]
        ) > -1
      )
        return true
      else return false
    },
    isDeleted(item) {
      // 判断节点是否删除
      if (!item) return false
      let dataInfo = this.dataList.find(
        data => item[this.currentProps.value] == data[this.currentProps.value]
      )
      if (
        (dataInfo && dataInfo[this.currentProps.delete]) ||
        item[this.currentProps.delete]
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
        this.currentDataList = cloneDeep(this.dataList)
        this.currentMode = this.currentConfig.mode // 重置mode
      }, 300)
    },
    toClickSearch(e) {
      if (this.beforeTriggerVisible && !this.beforeTriggerVisible()) return // 前置方法返回false则不触发下拉展开
      if (this.disabled) return
      this.toPlaceSelectedToTop()
      if (e.target.nodeName === 'INPUT') {
        this.$refs['hide-input'].focus({ cursor: 'end' })
        return
      }
      if (this.visible) this.onClickOutSide()
      else this.visible = true
      if (this.currentConfig.filter && this.visible && !this.$slots.trigger) {
        this.$nextTick(() => {
          this.$refs['hide-input'].focus({ cursor: 'end' })
        })
      }
    },
    // 筛选
    searchItem: debounce(
      function(filterValue) {
        this.toSetCurrentDataList(this.dataList, filterValue)
      },
      500,
      { leading: true }
    ),
    // 过滤下拉列表
    toSetCurrentDataList(arr, filter) {
      if (!filter) {
        this.currentDataList = cloneDeep(arr)
        if (this.currentConfig.mode === ECascader) {
          this.currentMode = ECascader // 在清空搜索/初始化的时候将mode重置为cascader
          this.flatCascaderList = this.toFlatCascaderNodes(arr)
        }
      } else {
        let filterArr = []
        if (this.currentConfig.mode === ETree) {
          filterArr = this.getFilteredTree(arr, filter)
        } else if (this.currentConfig.mode === ECascader) {
          this.currentMode = EList // 在搜索的时候临时转换成list格式展示
          this.flatCascaderList.forEach(item => {
            let ifInclude = this.toJudgeInclude(item, filter)
            if (ifInclude) filterArr.push(item)
          })
        } else {
          arr.forEach(item => {
            let ifInclude = this.toJudgeInclude(item, filter)
            if (ifInclude) filterArr.push(item)
          })
        }
        this.currentDataList = filterArr
      }
      this.updateDropdownPosition()
    },
    // 点击下拉列表某一项触发
    toSelect(index, selectItem) {
      if (selectItem[this.currentProps.canNotSelect]) return // canNotSelect节点标识点击无效
      this.$emit('nodeClick', selectItem)
      let currentDataList = this.currentDataList.filter(
        item => !item[this.currentProps.delete]
      )
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
        if (!this.currentConfig.disabledCanRemove) return
        if (
          currentDataList[index][this.currentProps.value] ==
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
      if (!this.currentConfig.multiple) {
        this.toSingleSelect(selectItem)
      } else {
        if (
          currentDataList[index][this.currentProps.value] ==
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
      // 置灰选项不可被移除时直接返回
      if (
        !this.currentConfig.disabledCanRemove &&
        selectItem[this.currentProps.disabled]
      )
        return
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
      let datas = []
      if (this.currentConfig.disabledCanRemove) {
        // 不可选择项不移除
        datas = this.selectedDatas.filter(
          item => item[this.currentProps.canNotSelect]
        )
      } else {
        // 置灰选项不被移除
        datas = this.selectedDatas.filter(
          item =>
            item[this.currentProps.canNotSelect] ||
            item[this.currentProps.disabled]
        )
      }
      this.selectedDatas = datas
      this.selectedDataValues = datas.map(item => item[this.currentProps.value])

      this.toEmitValue()
      this.$emit('clear')
      this.updateDropdownPosition()
      // 由于级联下拉处理较为繁琐，不能够及时响应清空，故关闭下拉，再次点开重新渲染
      if (this.currentConfig.mode === ECascader) this.visible = false
    },
    treeCheckedChange(selectItem) {
      this.$emit('nodeClick', selectItem)
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
        if (!this.currentConfig.disabledCanRemove) return
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
        this.toSingleSelect(selectItem)
      } else {
        // 多选
        let findRes = this.selectedDataValues.findIndex(
          val => val == selectItem[this.currentProps.value]
        )
        if (findRes > -1) {
          // 当前点击的值已选中，则取消
          this.selectedDataValues.splice(findRes, 1)
          this.selectedDatas.splice(findRes, 1)
          if (this.currentConfig.checkStrictly) {
            // 父子级选择关联
            let children = selectItem[this.currentProps.children]
            if (children && children.length) {
              let currentAndChildren = this.toGetTreeNodeChildren(children)
              let currentAndChildrenIds = currentAndChildren.map(
                item => item[this.currentProps.value]
              )
              currentAndChildrenIds.forEach(childId => {
                // 遍历所有子节点，找到被勾选的，删除掉
                let childIndex = this.selectedDataValues.findIndex(
                  val => val == childId
                )
                if (childIndex > -1) {
                  this.selectedDataValues.splice(childIndex, 1)
                  this.selectedDatas.splice(childIndex, 1)
                }
              })
            }
          }
        } else {
          // 当前未选中，则存储
          this.selectedDataValues.push(selectItem[this.currentProps.value])
          this.selectedDatas.push(selectItem)
          if (this.currentConfig.checkStrictly) {
            // 父子级选择关联
            let children = selectItem[this.currentProps.children]
            if (children && children.length) {
              let currentChildren = this.toGetTreeNodeChildren(children)
              let currentChildrenIds = currentChildren.map(
                item => item[this.currentProps.value]
              )
              this.selectedDataValues.push(...currentChildrenIds)
              this.selectedDatas.push(...currentChildren)
            }
          }
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
    getFilteredTree(tree, filter) {
      let listForFilter = cloneDeep(tree)
      let res = []
      listForFilter.forEach(item => {
        let ifInclude = this.toJudgeInclude(item, filter)
        if (item[this.currentProps.children]) {
          let childrenFilterList = this.getFilteredTree(
            item[this.currentProps.children],
            filter
          )
          if (childrenFilterList.length) {
            item[this.currentProps.children] = childrenFilterList
            res.push(item)
          } else if (ifInclude) res.push(item)
        } else if (ifInclude) res.push(item)
      })
      return res
    },
    toSelectAll() {
      if (this.loading) return
      let dataList = []
      if (this.alreadySelectAll) {
        // 当前已被全选，执行全不选
        this.selectedDatas.forEach(item => {
          // 置灰且置灰不可删除、不可选择项要保留，其他项根据条件去查
          if (
            (item[this.currentProps.disabled] &&
              !this.currentConfig.disabledCanRemove) ||
            item[this.currentProps.canNotSelect]
          ) {
            dataList.push(item)
          } else {
            // 遍历当前已选择内容，过滤出来不在当前经过筛选的下拉框中的选项
            let ifFind =
              this.currentDataList.findIndex(
                data =>
                  data[this.currentProps.value] == item[this.currentProps.value]
              ) > -1
            if (!ifFind) dataList.push(item)
          }
        })
        this.selectedDatas = dataList
      } else {
        // 当前未全选，执行全选
        this.currentDataList.forEach(item => {
          // 遍历当前经过筛选的下拉框的选择，过滤出当前可选且未被选择的选项
          if (
            !item[this.currentProps.disabled] &&
            !item[this.currentProps.canNotSelect]
          ) {
            let ifFind =
              this.selectedDataValues.findIndex(
                val => val == item[this.currentProps.value]
              ) > -1
            if (!ifFind) dataList.push(item)
          }
        })
        this.selectedDatas = [...this.selectedDatas, ...dataList]
      }
      let alreadySelectAll = this.alreadySelectAll
      this.selectedDataValues = this.selectedDatas.map(
        item => item[this.currentProps.value]
      )
      this.toEmitValue()

      this.$emit(
        alreadySelectAll ? 'clearAll' : 'selectAll',
        this.selectedDatas
      )
      this.updateDropdownPosition()
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
          this.$emit('input', cloneDeep(this.selectedDatas))
        else this.$emit('input', cloneDeep(this.selectedDataValues))
      } else {
        if (this.currentConfig.useObjectValue)
          this.$emit('input', this.selectedDatas[0])
        else if (
          this.currentConfig.mode === ECascader &&
          this.currentConfig.useValuePath
        )
          this.$emit('input', cloneDeep(this.selectedDataValues))
        else this.$emit('input', this.selectedDataValues[0])
      }
    },
    toEmitChange(selectItem) {
      // 向外抛出change事件
      this.$emit('change', selectItem, this.selectedDatas)
    },
    updateMultiplePosition() {
      // 如果多选且不折叠，则需要重新计算下拉位置
      if (!this.currentConfig.multiple || this.currentConfig.collapse) return
      this.updateDropdownPosition()
    },
    updateDropdownPosition() {
      if (this.$refs.dropDownRef && this.$refs.dropDownRef.$refs.drop) {
        this.$refs.dropDownRef.$refs.drop.update()
      }
    },
    toClearSearchValue() {
      this.searchValue = ''
      this.searchItem()
    },
    toGetNodeParents(key, list, parents = []) {
      // 获取父节点list
      for (let item of list) {
        if (item[this.currentProps.value] == key) return parents
        else if (
          item[this.currentProps.children] &&
          item[this.currentProps.children].length > 0
        ) {
          let res = this.toGetNodeParents(
            key,
            item[this.currentProps.children],
            [...parents, item]
          )
          if (res.length) return res
        }
      }
      return []
    },
    cascaderCheckedChange(selectInfo) {
      if (this.currentConfig.useValuePath) {
        this.selectedDatas = cloneDeep(selectInfo)
        this.selectedDataValues = selectInfo.map(
          item => item[this.currentProps.value]
        )
        this.toEmitValue()
        this.toEmitChange(this.selectedDataValues)
        this.onClickOutSide()
      } else {
        this.toSingleSelect(selectInfo)
      }
    },
    toFlatCascaderNodes(list) {
      // 扁平化处理级联数据
      let res = []
      let that = this
      function flatLabel(arr, parentLabels = []) {
        arr.forEach(item => {
          if (
            !item[that.currentProps.disabled] &&
            !item[that.currentProps.delete] &&
            item[that.currentProps.children] &&
            item[that.currentProps.children].length > 0
          ) {
            flatLabel(item[that.currentProps.children], [
              ...parentLabels,
              item[that.currentProps.label]
            ])
          } else {
            let newItem = item
            newItem[that.currentProps.label] = [
              ...parentLabels,
              item[that.currentProps.label]
            ].join('/')
            res.push(newItem)
          }
        })
      }
      flatLabel(list)
      return res
    },
    toSingleSelect(selectItem) {
      // 单选
      if (selectItem[this.currentProps.value] == this.selectedDataValues[0]) {
        this.onClickOutSide()
        return
      }
      if (this.currentConfig.mode === ECascader)
        this.toSetCurrentDataList(cloneDeep(this.dataList))
      this.selectedDataValues.pop()
      this.selectedDataValues.push(selectItem[this.currentProps.value])
      this.selectedDatas.pop()
      this.selectedDatas.push(selectItem)
      this.toEmitValue()
      this.toEmitChange(selectItem)
      this.onClickOutSide() // 选中即关闭下拉
    },
    // 判断当前项是否包含filter的值
    toJudgeInclude(item, filter) {
      let res = false
      // 使用模糊搜索
      if (this.currentConfig.useFuzzySearch) {
        // 先统一转换成小写
        let fuzzyFilter = filter.toLowerCase()
        let fuzzyLabel = item[this.currentProps.label].toLowerCase()
        if (fuzzyLabel.indexOf(fuzzyFilter) > -1) res = true
      } else if (item[this.currentProps.label].indexOf(filter) > -1) res = true
      return res
    },
    // 获取某节点极其所有子节点
    toGetTreeNodeChildren(children) {
      let that = this
      let res = []
      function travel(tree) {
        tree.forEach(item => {
          res.push(item)
          if (
            item[that.currentProps.children] &&
            item[that.currentProps.children].length
          )
            travel(item[that.currentProps.children])
        })
      }
      travel(children)
      return res
    },
    toPlaceSelectedToTop() {
      if (!this.currentConfig.placeSelectedToTop) return
      if (
        this.currentConfig.mode === EList &&
        this.selectedDataValues.length > 0
      ) {
        this.selectedDataValues.forEach(val => {
          let index = this.currentDataList.findIndex(
            item => item[this.currentProps.value] == val
          )
          if (index > -1) this.currentDataList.splice(index, 1)
        })
        this.currentDataList.unshift(...this.selectedDatas)
      }
    }
  }
}
</script>

<style lang="scss">
@import './LuckySelect.scss';
</style>
