<template>
    <div
        class="select-conntainer"
        :style="{width:notDropDowm?'100%':''}"
    >
        <template v-if="notDropDowm">
            <div style="display: flex; align-items: center; width: 100%;">
                <label>{{ notDropDownLabel }}：</label>
                <div
                    style="flex: 1;"
                    class="trigger-container"
                    @click="clickSearch"
                    :class="{'input-span-disabled':disabled}"
                    :style="{'background':styleParam.inputBg}"
                >
                    <i-input
                        :size="compSize"
                        :disabled="disabled"
                        readonly
                        clearable
                        @on-focus="focusInput"
                        @on-blur="blurInput"
                        :placeholder="placeholderShow"
                    />
                    <!-- v-if="((configFooter.config || clearable) &&((mutiple && selectNumber) || JSON.stringify(currentSelectedItem) !== '{}'))"  -->
                    <!-- v-if="(((mutiple && selectNumber) || (currentSelectedItem&&currentSelectedItem[showName])))" -->
                    <Icon
                        v-if="(mutiple && selectNumber)||(currentSelectedItem&&Object.keys(currentSelectedItem).length!=0)"
                        :style="{top:compSize=='small'?'4px':visual?'5px':'8px'}"
                        size="14"
                        type="ios-close-circle"
                        class="clear-icon clear-icon-easy"
                        @click.stop="clearInputValue"
                    />
                    <span
                        v-if="mutiple&&selectNumber!=0"
                        class="input-val"
                        :class="{'visual':visual}"
                    >
                        <template v-if="isShowAllSelect">
                            全选
                        </template>
                        <template v-else>
                            {{ selectResultText }}{{ selectNumber }}
                        </template>
                    </span>
                    <span
                        style=" width: calc(100% - 2px); left: 1px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                        v-if="!mutiple && currentSelectedItem[showName] !== null"
                        class="input-val"
                        :class="{'visual':visual,'showBoder':visible}"
                    >
                        <span class="hidden-ellipsis">{{ currentSelectedItem[showName] }}</span>
                        <!-- <span class="iconfont iconclear close-icon" v-if="singleNeedClear" @click="singleClearSelection"></span> -->
                    </span>
                </div>
            </div>
            <div style="border: 1px solid #d9d9d9; padding: 10px; margin-top: 10px; margin-left: 36px;">

                <div class="search-input">
                    <i-input
                        ref="searchRef"
                        :size="compSize"
                        v-model="searchKey"
                        search
                        clearable
                        prefix="ios-search"
                        :placeholder="nowPlaceholderUser"
                        @on-focus="nowPlaceholderUser=''"
                        @on-blur="nowPlaceholderUser=placeholderUser"
                        style="width: 100%;"
                        @on-change="searchItem"
                        @on-search="searchItem"
                    />

                </div>

                <ul
                    class="list-container"
                    :style="{'background':styleParam.contentBg,'max-height': configFooter.config && showQuery ? dropDownHeight+'px' : '200px'}"
                >

                    <li
                        class="nodata"
                        :class="compSize"
                        v-if="listArrayShow==''"
                    >暂无数据</li>

                    <li
                        :class="[{'disabled':item.disabled, 'active':item.select,'selected':currentSelected==item[selectVal]},compSize]"
                        @click="selectItem(item)"
                        v-for="(item) in listArrayShow"
                        :key="item[selectVal]"
                    >
                        <template v-if="itemMark">
                            <div :class="['icon-circle-'+item[level],'icon-circle']"></div>
                        </template>

                        <span
                            class="show-text"
                            v-html="filterShowName(item[showName],searchKey,noShowNameHolder)"
                        ></span>

                    </li>

                </ul>
            </div>
        </template>
        <Dropdown
            :placement="dropdownPlacement"
            ref="dropDownRef"
            :transfer="dropdownTransfer"
            v-else
            trigger="custom"
            :class="{'input-show':visual,'selected-style':placeholder!=placeholderShow, 'more-height': isLeftDataSet}"
            @on-clickoutside="clickoutSide"
            :visible="visible"
        >
            <div
                @click="clickSearch"
                :class="{'input-span-disabled':disabled,'mutiSelct':mutiple}"
                class="trigger-container"
            >

                <template v-if="$slots.trigger">
                    <slot name="trigger"></slot>
                </template>
                <template v-else>
                    <i-input
                        class="dropdown customeInput"
                        :size="compSize"
                        :disabled="disabled"
                        readonly
                        clearable
                        @on-focus="focusInput"
                        @on-blur="blurInput"
                        :placeholder="!(mutiple && listArrayShow.length==0 && isShowAllSelect) ? placeholderShow : ''"
                        :style="{width:searchWidth,'background':styleParam.inputBg,'height':mutiple ? inputHeight + 'px' : (compSize == 'small' ? '24px' : '32px')}"
                    />
                    <!-- v-if="((configFooter.config || clearable) &&((mutiple && selectNumber) || JSON.stringify(currentSelectedItem) !== '{}'))" -->
                    <span
                        v-if="!mutiple"
                        :style="{top:compSize=='small'?(visual?'10px':'6px'):visual?'9px':'9px'}"
                        style="z-index: 1; display: block; font-size: 12px;"
                        class=" clear-icon drop-icon-easy iconfont iconbottom-copy"
                    ></span>
                    <Icon
                        size="14"
                        v-if="clearInputIcon && treeShowClearable && ((mutiple && selectNumber)||(currentSelectedItem&&Object.keys(currentSelectedItem).length!=0))"
                        type="ios-close-circle"
                        :style="{top: compSize=='small'?'4px':visual?'8px':'8px'}"
                        class="clear-icon clear-icon-easy"
                        :class="{'muticlearIcon':mutiple}"
                        @click.stop="clearInputValue"
                    />
                    <i
                        v-if="mutiple"
                        :class="visible ? 'dropArrow iconfont iconshang muticlearIcon' : 'dropArrow iconfont iconxia-copy muticlearIcon'"
                        :style="{top: compSize=='small'?'4px':visual?'5px':'8px'}"
                    ></i>
                    <!-- <div
                        v-if="mutiple&&selectNumber!=0&&!isShowAllSelect"
                        class="input-val"
                        >{{ selectResultText }}{{ selectNumber }}</div> -->
                    <div
                        v-if="isShowAllSelect"
                        class="input-val"
                    >
                        全选
                    </div>
                    <div v-else>
                        <!-- <drag-icon
                            v-if="mutiple"
                            :drag-id="dragId"
                            :input-height="inputHeight"
                            @dragy="dragy"
                            ></drag-icon> -->
                        <div
                            v-if="mutiple&&selectNumber!=0&&!isShowAllSelect"
                            class="input-val"
                            :class="{'visual':visual}"
                            style="padding-left: 0;"
                        >
                            <muti-select-show
                                :input-height="inputHeight"
                                :drag-id="dragId"
                                :item-height="compSize == 'small' ? 24 : 32"
                                :select-data="isTree ? treeSelectNode : selectArray"
                                :inner-width="searchWidth"
                                :is-tree="isTree"
                                :list-array="isTree ? treeData : listArray"
                                :key-value="{'key':isTree ? nodekey : selectVal,'value':isTree ? defaultProps.label : showName}"
                                @dragy="dragy"
                                @cancelSelect="cancelSelect"
                            >
                            </muti-select-show>
                        </div>
                    </div>

                    <span
                        v-if="isShowSelectedLabel"
                        class="input-val selected-label"
                        :class="{'visual':visual,'showBoder':visible}"
                        :title="(showTip && isTree)? currentSelectedItem[defaultProps.label]||currentSelectedItem.label : undefined"
                    >
                        <span
                            v-if="isTree"
                            class="hidden-ellipsis input-val-inner"
                            :style="{'color':isDeleted && '#cccccc',width: '97%',display: 'block'}"
                        >
                            {{ currentSelectedItem[defaultProps.label]||currentSelectedItem.label }}
                        </span>
                        <!-- currentSelectedItem[defaultProps.label] -->
                        <span
                            v-if="!isTree&& currentSelectedItem[showName] !== null"
                            class="hidden-ellipsis input-val-inner"
                        >
                            {{ currentSelectedItem[showName] }}
                        </span>
                        <!-- <span class="iconfont iconclear close-icon" v-if="singleNeedClear" @click="singleClearSelection"></span> -->
                    </span>
                    <span
                        :style="{'color':(isDeleted || noMatchText) && '#cccccc'}"
                        v-if="!mutiple && (!currentSelectedItem || !Object.keys(currentSelectedItem).length) && noMatchText"
                        class="input-val no-match-text"
                        :class="{'visual':visual,'showBoder':visible}"
                        :title="noMatchText"
                    >
                        {{ noMatchText }}
                    </span>
                </template>

            </div>

            <DropdownMenu
                ref="DropdownMenu"
                :style="{width:dropDownWidth?dropDownWidth:searchWidth,'background':styleParam.contentBg}"
                slot="list"
            >

                <div
                    style="padding: 6px 10px; width: 100%; position: relative;"
                    @click.stop="stopProp"
                >
                    <div
                        v-if="fastfilter"
                        class="fast-filter"
                    >
                        <span>敏感度筛选：</span>
                        <span
                            :key="index"
                            v-for="(item,index) in fastClickArr"
                            @click="fastFilterGetData(item)"
                            class="fast-icon"
                        >{{ item[fastSelectShowName] }}
                            <span
                                v-if=" fastClick==item[fastSelectVal]"
                                class=" icon iconfont iconjiaocha"
                            >
                            </span>
                        </span>
                    </div>
                    <div
                        class="search-input"
                        v-if="isCanSearch&&(!loading&&searchKey==''||searchKey!='')"
                    >
                        <i-input
                            class="input-search"
                            ref="searchRef"
                            autofocus
                            :size="compSize"
                            v-model="searchKey"
                            clearable

                            prefix="ios-search"
                            :placeholder="nowPlaceholderUser"
                            @on-focus="nowPlaceholderUser=''"
                            @on-blur="nowPlaceholderUser=placeholderUser"
                            style="width: 100%;"
                            @on-change="searchItem('change')"
                            @on-search="searchItem"
                        />

                    </div>
                    <div
                        v-if="showCollectionType && !searchKey && !emptyCommonList && !specialLoading"
                        class="collection-type-btn"
                        :class="{'visual':visual}"
                    >
                        <Button
                            @click="collectionType=1;"
                            type="primary"
                            class="btn"
                            :class="{'active': collectionType == 1}"
                        >常用数据集</Button>
                        <Button
                            @click="collectionType=2;"
                            type="primary"
                            class="btn"
                            :class="{'active': collectionType == 2}"
                        >全部数据集</Button>
                    </div>
                    <div v-if="showCollectionType && (collectionType == 1 || collectionType == 0) && !searchKey && specialLoading && !emptyCommonList">
                        <li
                            v-loading="specialLoading"
                            class="loading-icon"
                            :class="'small'"
                            style="height: 30px;"
                        >
                        </li>
                        <div style="text-align: center; color: #4084ff;">加载中</div>
                    </div>
                    <div
                        v-if="showCollectionType && collectionType == 1 && !searchKey && !specialLoading && !emptyCommonList"
                        class="scrollbar common-list-wrapper"
                    >
                        <ul
                            class="common-collection-list"
                            :class="{'visual':visual}"
                        >
                            <li
                                v-for="(collection, idx) in commonCollectionList"
                                :key="collection.collectionId"
                                @click="selectCommon(collection)"
                                :class="{'selected': currentSelectedItem && (currentSelectedItem.data ? currentSelectedItem.data[selectVal] == collection[selectVal] : collection[selectVal] == currentSelectedItem[selectVal])}"
                            >
                                <span
                                    v-if="collection.updateState"
                                    class="dot-tip"
                                    :style="{'background': collection.updateState == 'updating' ? '' : updateStateObj[collection.updateState].color, 'border': collection.updateState == 'updating' ? '1px solid '+updateStateObj[collection.updateState].color : ''}"
                                    style="display: inline-block;"
                                ></span>
                                <span
                                    v-else
                                    style="margin-right: 4px; display: inline-block;"
                                ></span>
                                <span style="white-space: nowrap;">{{ collection.collectionName }}</span>
                                <el-tooltip
                                    width="230"
                                    :transition="'no-transition'"
                                    :visible-arrow="false"
                                    popper-class="collectionInfoTip"
                                    v-if="DATA_MAP_LINKAGE == '1' && (!collection.folder && showCollectionInfo)"
                                    placement="right-start"
                                >
                                    <!-- v-if="collection.updateState"  -->
                                    <span
                                        class="iconfont opdateTipShow"
                                        :class="tipStateList[collection.updateState] || tipStateList.empty"
                                        :style="{'color':updateStateObj[collection.updateState || 'empty'].color,'font-size':'13px','background-color':$route.name !== 'dashboard' && $route.name !== 'selfSupportTemplete' && $route.name !== 'spreadExcel' && $route.name !== 'customeInterfaceTemplete' ? '#F5F7FA' : (currentSelectedItem && (currentSelectedItem.data ? currentSelectedItem.data[selectVal] == collection[selectVal] : collection[selectVal] == currentSelectedItem[selectVal]) ? '#4084FF' : '#313B55') , top: idx * 26 + 85 + 'px'}"
                                    >
                                    </span>
                                    <div slot="content">
                                        <div
                                            class="tool-tips-easy-node-select scrollbar"
                                            v-if="collection"
                                            style="max-height: 186px; word-break: break-all; overflow: overlay;"
                                        >
                                            <!-- <p>{{updateStateObj[collection.updateState].label}}：</p> -->
                                            <div
                                                v-if="collection.updateState"
                                                style="margin-bottom: 8px;"
                                                class="base-font scene-2"
                                            >
                                                <span
                                                    class="iconfont"
                                                    :class="tipStateList[collection.updateState] || tipStateList.empty"
                                                    style="margin-right: 4px;"
                                                    :style="{'color':updateStateObj[collection.updateState || 'empty'].color,'font-size':'12px'}"
                                                >
                                                </span>{{ collection.updateState && updateStateObj[collection.updateState].label }}
                                            </div>
                                            <div
                                                class="base-font scene-2"
                                                v-if="collection.updateState"
                                            >
                                                <p :class="collection.updateState == 'updating' || collection.updateState == 'warning' ? 'margin-b-4' : 'margin-b-8'">最近更新时间：{{ collection.actualTime || '暂无' }}</p>
                                                <p
                                                    class="margin-b-8"
                                                    v-if="collection.updateState == 'updating' || collection.updateState == 'warning'"
                                                >预计更新时间：{{ collection.predictTime || '暂无' }}</p>
                                                <p class="margin-b-8">更新频率：{{ collection.updateFrequency || '暂无' }}</p>
                                            </div>
                                            <span
                                                class="tipLine margin-b-8"
                                                v-if="collection.updateState"
                                            ></span>
                                            <div class="base-font scene-3">
                                                <p :class="{'margin-b-4':collection.updateState}">时间范围：{{ collection.timeRange || '暂无' }}</p>
                                                <p v-if="collection.updateState">备注描述：{{ collection.collectionDesc || '暂无' }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </el-tooltip>
                            </li>
                        </ul>
                    </div>

                    <!--  -->
                    <!-- 把非树的全选移动到ul外面，为了全选始终在头部，不随滚动 -->
                    <div v-show="!showCollectionType || (showCollectionType && (collectionType == 2 || searchKey || emptyCommonList))">
                        <span
                            v-if="listArrayShow!='' && mutiple&&selectAllShowControl && !isTree&&!loading"
                            @click="allSet"
                            :value="selectAllShow?'all':'notAll'"
                            key="0"
                            :class="compSize"
                            style="color: #555; padding-left: 15px;"
                        >
                            <span v-if="selectAllShow">
                                #全选#
                            </span>
                            <span v-else>
                                #全不选#
                            </span>
                        </span>
                        <ul
                            v-if="!isTree"
                            class="list-container"
                            :style="{ 'max-height': configFooter.config && showQuery ? dropDownHeight+'px' : '200px'}"
                        >

                            <li
                                style="height: 100px;"
                                v-loading="loading"
                                v-if="loading"
                                class="nodata"
                                :class="compSize"
                            >
                                <div>加载中</div>
                            </li>
                            <li
                                class="nodata"
                                :class="compSize"
                                v-if="listArrayShow=='' && !loading"
                            >
                                <div>{{ emptyText }}</div>
                                <div v-if="configFooter.config && showQuery && searchKey && canQuery && !afterSearch">
                                    {{ remoteSearchEmptyText }}
                                </div>
                            </li>
                            <!-- currentSelected==item[selectVal] -->

                            <li
                                v-show="!loading"
                                :class="[{ 'active':item.select,'selected':item.select,'disabled':item.disabled}, compSize]"
                                @click="selectItem(item)"
                                :title="item[showName]"
                                v-for="(item) in listArrayShow"
                                :key="item[selectVal]"
                            >
                                <template v-if="itemMark">
                                    <div :class="['icon-circle-'+item[level],'icon-circle']"></div>
                                </template>
                                <span
                                    class="show-text"
                                    :style="{'color': (item.status == 'DELETE' || item.status == 1 || item.deleted == 1) ? '#CCCCCC' : ''}"
                                    v-html="filterShowName(item[showName],searchKey,noShowNameHolder)"
                                ></span>

                            </li>

                        </ul>
                        <div
                            :style="{height: showCollectionType ? '300px' : '', overflow: visual ? 'overlay' : 'auto'}"
                            :class="[visual ? 'scrollbar' :'']"
                            id="treeWrapper"
                            v-else
                        >

                            <div
                                v-if="mutiple&&selectAllShowControl&&!loading"
                                @click="treeAllSet"
                                class="tree-all-set"
                                style="color: #555;"
                            >
                                <span v-if="selectAllShow">
                                    #全选#
                                </span>
                                <span v-else>
                                    #全不选#
                                </span>
                            </div>
                            <!-- show-checkbox -->

                            <!-- show-checkbox -->
                            <div
                                style="height: 100px;"
                                v-loading="loading"
                                v-if="loading"
                                class="nodata"
                                :class="compSize"
                            >
                            </div>
                            <easy-dropdown-tree
                                v-else
                                :is-db-for-table-join="isDbForTableJoin"
                                :indent="indent"
                                :show-item-tip="showItemTip"
                                :tree-father-disabled-style="treeFatherDisabledStyle"
                                :show-carpet-btn="showCarpetBtn"
                                :need-text-color="needTextColor"
                                @node-click="nodeClick"
                                :check-strictly="checkStrictly"
                                class="filter-tree"
                                :class="{'scrollbar visual-easyselect':visual}"
                                :node-key="nodekey"
                                :default-checked-keys="defaultCheckedKeys"
                                :data="treeData"
                                :show-tip="showTip"
                                :show-collection-info="showCollectionInfo"
                                :props="defaultProps"
                                :expand-on-click-node="expandOnClickNode"
                                default-expand-all
                                :filter-node-method="filterNode"
                                :disabled-levels="disabledLevels"
                                ref="dropdownTree"
                                :detail-key="detailKey"
                                :style="{'max-height': treeMaxHeight, 'overflow': showCollectionType ? 'visible' : 'overlay', 'width': showCollectionType ? 'fit-content' : '', 'min-width': showCollectionType ? '100%' : ''}"
                            />
                        </div>
                    </div>

                    <div
                        v-if="configFooter.config && showQuery"
                        class="footer-btn"
                        style="margin-top: 5px;"
                    >
                        <Tooltip
                            v-if="!afterSearch"
                            content="默认仅显示前1000条内容，如未能匹配到可点击查询"
                        ><i
                            class="iconfont"
                            style="color: #447ee7; font-size: 12px; margin-right: 3px; cursor: pointer;"
                        >&#xe653;</i></Tooltip>
                        <i
                            v-if="searchKey && afterSearch"
                            class="iconfont"
                            style="color: #4dba87; font-size: 12px; margin-right: 3px;"
                        >&#xe71d;</i>
                        <span
                            v-if="canQuery"
                            @click="remoteSearch"
                            v-html="searchKey? (afterSearch? configFooter.text3 : configFooter.text2) : configFooter.text1"
                        ></span>
                        <span
                            v-if="!canQuery"
                            style="cursor: disabled;"
                            v-html="configFooter.text1"
                        ></span>
                    </div>
                    <div
                        class="footer-btn"
                        v-if="footerParam.footerText"
                    >
                        <span
                            @click="footerBtnEmit"
                            class="operate-btn-refresh refresh"
                            style="cursor: pointer;"
                        >
                            <span
                                v-if="footerParam.type=='refresh'"
                                class=" iconfont  refresh-icon  iconziyuanxhdpi"
                            ></span>
                            <span
                                :class="[footerParam.footerClass]"

                                v-html="footerParam.footerText"
                            >
                            <!-- {{footerParam.footerText}} -->
                            </span>
                        </span>
                    </div>
                </div></DropdownMenu>

        </Dropdown>
    </div>
</template>
<script>
import { mixinFormShowName, dataMapLinkage } from '@/mixins';
import easyDropdownTree from '@/components/easy-dropdown-tree';
import debounce from 'lodash/debounce';
// import dragIcon from './dragIcon.vue';
import mutiselectShow from './mutiselectShow.vue';
/*
 * import mutiselectShow from "./mutiselectShow.vue";
 * import dragIcon from "./dragIcon.vue";
 * import triggerItem from  "./triggerItem.vue"
 */
import Bus from '@/assets/js/event/paintBus.js';
import { deepCopy } from '../../utils/common';
export default {
    components: {
        // 'easy-tree':easyTree
        'easy-dropdown-tree': easyDropdownTree,
        // 'drag-icon': dragIcon,
        'muti-select-show': mutiselectShow,
        /*
         * "muti-select-show": mutiselectShow,
         * "drag-icon":dragIcon,
         * triggerItem
         */
    },
    filters: {},
    mixins: [mixinFormShowName, dataMapLinkage],
    props: {
        showItemTip: {
            type: Boolean,
            default () {
                return false;
            },
        },
        specialLoading: {
            type: Boolean, // 个人专用loading
            default () {
                return false;
            },
        },
        commonCollectionList: { // 常用数据集列表
            type: Array,
            default () {
                return [];
            },
        },
        showCollectionType: { // 是否显示常用数据集和全部数据集切换逻辑
            type: Boolean,
            default: false,
        },
        dragId: {
            type: String,
            default: 'dragId',
        },
        isShowAllSelect: {
            type: Boolean,
            default: false,
        },
        visual: {// 是否需要视觉可视化样式
            type: Boolean,
            default: false,
        },
        isLeftDataSet: {
            type: Boolean,
            default: false,
        },
        clearInputIcon: {
            type: Boolean,
            default: true,
        },
        allSelected: {// 是否需要全选
            type: Boolean,
            default: false,
        },
        filterField: {// 筛选字段
            type: String,
            default: '',
        },
        filterFieldValue: {//
            type: String,
            default: '',
        },
        isNeedOpenChangeSelectStatus: {// 下拉打开的时候是否要跟新状态
            type: Boolean,
            default: false,
        },
        disabledSelect: {// 禁用的字段id
            type: Array,
            default () {
                return [];
            },
        },
        showQuery: { // 是否展示加载
            type: Boolean,
            default: true,
        },
        defaultItemProps: {
            type: Array,
            default () {
                return ['showName', 'columnId'];
            },
        },
        canQuery: {// 是否可以请求
            type: Boolean,
            default: true,
        },
        clearable: {// 是否可以清除
            type: Boolean,
            default: false,
        },
        loading: {// 加载中
            type: Boolean,
            default: false,
        },
        configFooter: {// 下拉底部配置
            type: Object,
            default: () => ({}),
        },
        indent: {// 树形缩进距离
            type: Number,
            default: 18,
        },
        dropdownPlacement: {// palcement默认位置
            type: String,
            default: 'bottom-start',
        },
        editItem: {
            // 传入编辑对象
            type: Object,
            default: () => ({}),
        },
        isDeepCopyData: {
            // 初始化的数据是不是不要clone防止互相干扰
            type: Boolean,
            default: false,
        },
        isWatchListArrayByTable: {
            // 是否监听listArrayByTable
            type: Boolean,
            default: false,
        },
        isWatchSelectedByTable: {
            // 是否监听select
            type: Boolean,
            default: false,
        },
        compSize: {
            // 组件的大小
            type: String,
            default: 'default', // small,default,large
        },
        dropdownTransfer: {
            // 是否设置dropdownn的transfer
            type: Boolean,
            default: false,
        },
        noShowNameHolder: {
            // showNama值为空的时候的占位符
            type: String,
            default: ' ',
        },
        // 树形下拉使用start-------------,
        disabledLevels: {
            type: Array,
            default: () => [],
        },
        treeMaxHeight: {// 树最大高度
            type: String,
            default: '200px',
        },
        expandOnClickNode: {// 树节点是否可以点击
            type: Boolean,
            default () {
                return false;
            },
        },
        showCarpetBtn: {
            // 显示下拉箭头
            type: Boolean,
            default () {
                return false;
            },
        },
        treeFatherDisabledStyle: {
            // 父节点不能被选中样式
            type: Boolean,
            default () {
                return false;
            },
        },
        fatherCanSelect: {
            // 父节点是否可以被选中 如果是false checkStrictly一定是true
            type: Boolean,
            default () {
                return true;
            },
        },
        checkStrictly: {
            // 是否严格的遵循父子不互相关联的做法
            type: Boolean,
            default () {
                return false;
            },
        },
        selectedForward: {// 是否选中的排在最上面
            type: Boolean,
            default () {
                return false;
            },
        },
        defaultProps: {
            type: Object,
            default () {
                return {
                    children: 'children',
                    label: 'label',
                };
            },
        },
        treeData: {
            // 树data
            type: Array,
            default () {
                return [];
            },
        },
        defaultCheckedKeys: {
            // 默认勾选的
            type: Array,
            default () {
                return [];
            },
        },
        nodekey: {
            // 树形节点的key
            type: String,
            default () {
                return 'id';
            },
        },
        isTree: {
            // 判断是不是树
            type: Boolean,
            default () {
                return false;
            },
        },
        /*
         *  树形下拉使用end-------------
         * 全选显示不显示
         */
        selectAllShowControl: {
            type: Boolean,
            default () {
                return true;
            },
        },
        styleParam: {
            type: Object,
            default () {
                return {
                    inputBg: '', // 暂时无效
                    contentBg: '',
                };
            },
        },
        disabled: {
            type: Boolean,
            default () {
                return false;
            },
        },
        footerParam: {
            type: Object,
            default () {
                return {
                    footerText: '',
                    footerClass: '',
                };
            },
        },
        selectResultText: {
            type: String,
            default () {
                return '已选';
            },
        },
        notDropDownLabel: {
            // 下拉显示是不是dropdowm模式显示文本
            type: String,
            default () {
                return '角色';
            },
        },
        notDropDowm: {
            // 下拉显示是不是dropdowm模式
            type: Boolean,
            default () {
                return false;
            },
        },
        emptyText: {
            // 数据为空的时候显示
            type: String,
            default () {
                return '暂无数据';
            },
        },
        placeholder: {
            // 默认显示的提示
            type: String,
            default () {
                return '请选择';
            },
        },
        placeholderUser: {
            // 用户修改默认显示的提示
            type: String,
            default () {
                return '输入关键词搜索相关字段';
            },
        },
        searchWidth: {
            // 搜索框的大小
            type: String,
            default () {
                return '300px';
            },
        },
        dropDownWidth: {
            // 下拉框宽度
            type: String,
            default () {
                return '';
            },
        },
        noMatchText: {
            // 当下拉框没有selectVal的对应项的时候，需要在上面输入框显示特定的文案
            type: String,
            default () {
                return '';
            },
        },
        showName: {
            // 选中item的展示名称
            type: String,
            default () {
                return 'showName';
            },
        },
        selectVal: {
            // 选中item的value
            type: String,
            default () {
                return 'id';
            },
        },
        fastSelectShowName: {
            // 快速选中按钮item的展示名字
            type: String,
            default () {
                return 'showName';
            },
        },
        fastSelectVal: {
            // 快速选中按钮item的value
            type: String,
            default () {
                return 'id';
            },
        },
        mutiple: {
            // 多选
            type: Boolean,
            default () {
                return true;
            },
        },
        /*
         * singleNeedClear: {
         *   // 单选时，是否需要清空
         *   type: Boolean,
         *   default: false
         * },
         */
        fastfilter: {
            // 是不是需要快速筛选
            type: Boolean,
            default () {
                return true;
            },
        },
        itemMark: {
            // 是不是需要item前有样式
            type: Boolean,
            default () {
                return false;
            },
        },
        level: {
            // item 前的等级
            type: String,
            default () {
                return 'sensitivityLevel';
            },
        },
        scrollSelect: {
            type: Boolean,
            default: false,
        },
        isByTable: {
            // 初始化的方式如果是true 默认选中的以及下拉显示可以使用selectedByTable listArrayByTable否则需要使用ref调用init
            type: Boolean,
            default: false,
        },
        selectedByTable: {
            // 默认选中的数组[1,2,3]
            type: Array,
            default () {
                return [];
            },
        },
        listArrayByTable: {
            // 展示的下拉数据
            type: Array,
            default () {
                return [];
            },
        },
        fastClickArr: {
            // 快速筛选
            type: Array,
            default () {
                return [];
            },
        },
        showTip: {
            // 鼠标移入显示文字
            type: Boolean,
            default () {
                return false;
            },
        },
        isDbForTableJoin: {
            // 是否为关联表页数据库下拉框
            type: Boolean,
            default: false,
        },
        detailKey: {
            // 组件实例名称
            type: String,
            default () {
                return '';
            },
        },
        isCanSearch: {
            // 是否显示搜索框
            type: Boolean,
            default: true,
        },
        isDeleted: {// 字段是否被删除
            type: Boolean,
            default: false,
        },
        treeShowClearable: {
            type: Boolean,
            default () {
                return true;
            },
        },
        needTextColor: { // 选中项的字体设置颜色
            type: Boolean,
            default () {
                return false;
            },
        },
        showCollectionInfo: { // 选中项的字体设置颜色
            type: Boolean,
            default () {
                return false;
            },
        },
        clearSelctEmutable: { // 清空easyselect时，调用全选全不选，而不是直接清空选项，避免把disalbe的下拉内容清空
            type: Boolean,
            default () {
                return false;
            },
        },
    },
    data () {
        return {
            nowPlaceholderUser: '',
            emptyCommonList: false,
            nodeIconLeft: this.$route.name == 'dashboard' || this.$route.name == 'selfSupportTemplete' ? 350 : 370,
            tipStateList: {
                empty: 'iconshijian2',
                timeout: 'iconshijian1',
                success: 'iconshijian3',
                warning: 'iconshijian5',
                updating: 'iconshijian4',

            },
            updateStateObj: {
                success: {
                    label: '已更新',
                    color: '#4ABFA7',
                },
                updating: {
                    label: '更新中',
                    color: '#4ABFA7',
                },
                warning: {
                    label: '更新预警',
                    color: '#F6AF35',
                },
                timeout: {
                    label: '更新超时',
                    color: '#F56C6C',
                },
                failed: {
                    label: '更新失败',
                    color: '#F56C6C',
                },
                empty: {
                    label: '无',
                    color: this.$route.name !== 'dashboard' ? '#D1D1D1' : '#FFFFFF',
                },
            },
            collectionType: 1,
            mapDiable: {},
            afterSearch: false, // 搜索标识用于显示footer状态
            currentSelectedItem: {}, // 当前选中对象
            selectItemParam: {},
            fastClick: '',
            /*
             * fastClickArr: [
             *   {
             *     showName: "全部",
             *     id: ""
             *   },
             *   {
             *     showName: "高",
             *     id: 2
             *   },
             *   {
             *     showName: "中",
             *     id: 3
             *   },
             *   {
             *     showName: "低",
             *     id: 4
             *   }
             * ],
             */
            visible: false,
            searchKey: '',
            selectAllShow: true,
            currentSelected: -1,
            selectArray: [],

            /*
             * listArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(_ => {
             *   return { id: _, showName: "字段" + _ };
             * }),
             */
            listArray: [],
            selected: [],
            listArrayShow: [],
            selectNumber: 0,
            allTreeNodeIds: [],
            currentSelectedItemPointer: {},
            dropDownHeight: 245,
            remoteSearchEmptyText: '点击数据库查询试试吧',
            inputHeight: this.compSize == 'small' ? 24 : 32,
            treeSelectNode: [],
        };
    },
    computed: {
        placeholderShow () {
            if (this.mutiple) {
                if (this.selectNumber == 0) {
                    return this.placeholder;
                } else {
                    return '';
                }
            } else {
                if (
                    this.noMatchText || this.currentSelectedItem
                    && ((this.currentSelectedItem[this.showName] !== undefined && this.currentSelectedItem[this.showName] !== null)
                        || this.currentSelectedItem.label
                        || this.currentSelectedItem[this.defaultProps.label])
                ) {
                    return '';
                } else {
                    return this.placeholder;
                }
            }
        },
        isShowSelectedLabel () {
            return !this.mutiple
                && this.currentSelectedItem
                && Object.keys(this.currentSelectedItem).length
                && (
                    this.currentSelectedItem[this.showName] !== null
                    || this.currentSelectedItem.label !== null
                    || this.currentSelectedItem[this.defaultProps.label] !== null
                );
        },
        /*
         * selectNumber() {
         *   let arr = this.listArray.filter(_ => {
         *     return _.select;
         *   });
         *   return arr.length;
         * }
         */
    },
    watch: {
        /*
         * disabledSelect:{
         *     handler(newListArray) {
         *        this.listArrayShow.forEach(_ => {
         *           if(this.mapDiable[_[this.selectVal]]){
         *             _.disabled=true;
         *           }
         *         });
         *   },
         *   deep: true,
         *   immediate: false
         * },
         */
        collectionType (val) {
            if (val === 2) {
                if (this.$refs.dropdownTree && this.$refs.dropdownTree.$el) {
                    this.$nextTick(() => {
                        this.$refs.dropdownTree.$el.scrollLeft = 0;
                        // console.log('当前的dom',document.getElementsByClassName('select-icon')[0].offsetTop)
                        if (this.$refs.dropdownTree && document.getElementsByClassName('select-icon')[0] && this.scrollSelect) {
                            this.$refs.dropdownTree.$el.scrollTop = document.getElementsByClassName('select-icon')[0].offsetTop;
                        }
                        if (this.$refs.dropdownTree && document.getElementsByClassName('selectedTextColor')[0] && this.scrollSelect) {
                            this.$refs.dropdownTree.$el.scrollTop = document.getElementsByClassName('selectedTextColor')[0].offsetTop;
                        }
                        if (this.showCollectionType && document.getElementsByClassName('selectedTextColor')[0] && this.scrollSelect) {
                            let wrapper = document.getElementById('treeWrapper');
                            wrapper && (wrapper.scrollTop = document.getElementsByClassName('selectedTextColor')[0].offsetTop);
                        }
                    });
                }
            }
        },
        commonCollectionList (val) {
            if (!val.length) {
                this.emptyCommonList = true;
            } else {
                this.emptyCommonList = false;
            }
        },
        searchKey (val) {
            this.searchKeyChange(val);
        },
        defaultCheckedKeys: {
            handler () {
                this.initTreeShow();
            },
            deep: false,
            immediate: false,
        },
        selectedByTable: {

            handler (newSelect) {
                if (this.isByTable && this.isWatchSelectedByTable) {
                    // this.timer1 = null;
                    let selectedId = newSelect;
                    if (this.allSelected) {
                        selectedId = [];
                        this.listArrayByTable.forEach(_ => {
                            selectedId.push(_[this.selectVal]);
                        });
                    }
                    if (this.timer1) {
                        clearTimeout(this.timer1);
                        this.timer1 = setTimeout(() => {
                            this.init(this.listArrayByTable, selectedId);
                        }, 50);
                    } else {
                        this.timer1 = setTimeout(() => {
                            this.init(this.listArrayByTable, selectedId);
                        }, 50);
                    }
                }
            },
            deep: false,
            immediate: false,
        },
        listArrayByTable: {
            handler (newListArray) {
                if (this.isByTable && this.isWatchListArrayByTable) {
                    // let this.timer2 = null;
                    if (this.timer2) {
                        clearTimeout(this.timer2);
                        this.timer2 = setTimeout(() => {
                            this.init(newListArray, this.selectedByTable);
                        }, 50);
                    } else {
                        this.timer2 = setTimeout(() => {
                            this.init(newListArray, this.selectedByTable);
                        }, 50);
                    }
                }
            },
            deep: false,
            immediate: false,
        },
        visible (newVal) {
            if (this.mutiple && !newVal) {
                this.$emit('dropdown-close');
            }
        },
    },
    created () {
        this.searchItem = debounce(this.searchItem, 500, { trailing: true });
        this.searchKeyChange = debounce(this.searchKeyChange, 500, { trailing: true });
    },
    mounted () {
        this.nowPlaceholderUser = this.placeholderUser;
        this.initTreeShow();
        if (this.isByTable) {
            this.init(this.listArrayByTable, this.selectedByTable);
            // 单选时，当选项列表为空，但是需要显示默认选中的
            if (!this.mutiple && this.selectedByTable.length && JSON.stringify(this.currentSelectedItem) == '{}' && this.listArrayByTable.length == 0) {
                this.currentSelectedItem = {
                    select: true,
                };
                this.defaultItemProps.forEach(_ => {
                    this.currentSelectedItem[_] = this.selectedByTable[0];
                });
            }
        }
    },
    methods: {
        updateCollectionType () {
            this.$nextTick(() => {
                let val = this.commonCollectionList;
                if (val.length) {
                    if (this.currentSelectedItem) {
                        let match = val.find(el => el[this.selectVal] == (this.currentSelectedItem.data ? this.currentSelectedItem.data[this.selectVal] : this.currentSelectedItem[this.selectVal]));
                        if (!match && this.showCollectionType) {
                            this.collectionType = 2;
                            return;
                        }
                    }
                    this.collectionType = 1;
                } else {
                    if (this.showCollectionType) {
                        this.collectionType = 2;
                        return;
                    }
                    this.collectionType = 1;
                }
            });
        },
        selectCommon (item) {
            this.$set(item, 'selected', true);
            this.currentSelectedItem && this.$refs.dropdownTree.setChecked(this.currentSelectedItem[this.selectVal], false);
            this.$refs.dropdownTree.setChecked(item[this.selectVal], true);
            this.currentSelectedItem = item;
            this.$emit('closeDrop', {
                selected: [item[this.selectVal]],
                item,
            });
            this.$emit('dropdown-close');
            this.clickoutSide();
            this.$emit('nodeClick', { selected: [this.currentSelectedItem[this.selectVal]], nodeData: this.currentSelectedItem, type: 'list' });
        },
        dragy (y) {
            let movey = y;
            let miny = this.compSize == 'small' ? 24 : 32;
            movey = movey > 88 ? 88 : movey;
            movey = movey < miny ? miny : movey;
            this.inputHeight = movey;
            this.$nextTick(() => {
                if (this.$refs.dropDownRef && this.$refs.dropDownRef.$refs.drop) {
                    if (this.$refs.dropDownRef.$refs.drop.$el.offsetHeight) {
                        this.$refs.dropDownRef.$refs.drop.update();
                    }
                }
            });
        },
        setCurrentSelectedItem (item) {
            this.currentSelectedItem = item;
        },
        remoteSearch () {
            if (this.searchKey && !this.afterSearch) {
                this.emitRemoteSearch(this.searchKey);
            }
        },
        emitRemoteSearch (searchKey, type) {
            setTimeout(() => {
                this.$emit('remoteSearch', searchKey, type);
            }, 200);
        },
        handleChangeSelectNumber (num) {
            if (this.isTree) {
                this.selectNumber = num;
            }
        },
        stopProp () {},
        footerBtnEmit () {
            this.$emit('footerBtnEmit');
        },
        clickSearch () {
            if (this.disabled) {
                return;
            }

            this.visible = !this.visible;
            if (this.isNeedOpenChangeSelectStatus) {
                this.mapDiable = {};
                if (this.disabledSelect != '') {
                    this.disabledSelect.forEach(_ => {
                        this.mapDiable[_] = true;
                    });
                }
                let map = {};
                this.selectedByTable.forEach(_ => {
                    map[_] = true;
                });
                this.listArrayShow.forEach(_ => {
                    _.disabled = this.mapDiable[_[this.selectVal]];
                    _.select = map[_[this.selectVal]];
                });
            } else if (this.filterField !== '' && this.filterFieldValue !== '') {
                let arr1 = [];
                let arr2 = [];
                this.listArray.forEach(_ => {
                    if (_[this.filterField] == this.filterFieldValue) {
                        arr1.push(_);
                        _.disabled = false;
                    } else {
                        _.disabled = true;
                        arr2.push(_);
                    }
                });
                this.listArray = arr1.concat(arr2);
            }


            if (this.visible) {
                this.$emit('clickSearch');
                this.$emit('focusInput');
                this.searchItem();

                /*
                 * this.$refs.searchRef.focus();
                 * console.log(this.$refs.DropdownMenu)
                 * this.$refs.DropdownMenu.$children.forEach((_)=>{
                 *   _.focus();
                 * })
                 */
            } else {
                if (this.configFooter.config) {
                    this.emitRemoteSearch(null);
                }
            }
            if (this.$refs.dropdownTree && this.$refs.dropdownTree.$el) {
                this.$nextTick(() => {
                    this.$refs.dropdownTree.$el.scrollLeft = 0;
                    // console.log('当前的dom',document.getElementsByClassName('select-icon')[0].offsetTop)
                    if (this.$refs.dropdownTree && document.getElementsByClassName('select-icon')[0] && this.scrollSelect) {
                        this.$refs.dropdownTree.$el.scrollTop = document.getElementsByClassName('select-icon')[0].offsetTop;
                    }
                    if (this.$refs.dropdownTree && document.getElementsByClassName('selectedTextColor')[0] && this.scrollSelect) {
                        this.$refs.dropdownTree.$el.scrollTop = document.getElementsByClassName('selectedTextColor')[0].offsetTop;
                    }
                    if (this.showCollectionType && document.getElementsByClassName('selectedTextColor')[0] && this.scrollSelect) {
                        let wrapper = document.getElementById('treeWrapper');
                        wrapper && (wrapper.scrollTop = document.getElementsByClassName('selectedTextColor')[0].offsetTop);
                    }
                });
            }
        },
        // 全选
        treeAllSet () {
            this.selectAllShow = !this.selectAllShow;
            this.$emit('treeAllSet', !this.selectAllShow);
            if (!this.selectAllShow) {
                if (this.checkStrictly) {
                    this.allTreeNodeIds = [];
                    this.getAllNodeIds(this.treeData);
                    this.setCheckedKeys(this.allTreeNodeIds);
                } else {
                    let ids = this.getFirstLevelIds();
                    this.setCheckedKeys(ids);
                }
            } else {
                this.$nextTick(() => {
                    this.setCheckedKeys([]);
                });
            }
        },

        // 获取树形第一级的id集合
        getFirstLevelIds () {
            let ids = [];
            this.treeData.forEach(item => {
                ids.push(item[this.nodekey]);
            });
            return ids;
        },

        // 获取树形所有节点id
        getAllNodeIds (list) {
            list.forEach(item => {
                this.allTreeNodeIds.push(item[this.nodekey]);

                let childs = item.childs;
                if (childs && childs.length) {
                    this.getAllNodeIds(childs);
                }
            });
        },

        // 设置哪些被选中 checkStrictly！=true 的时候直接传最外层的根节点就好
        /**
         * @arr Array 如果是
         */
        setCheckedKeys (arr) {
            if (this.$refs.dropdownTree) {
                this.$refs.dropdownTree.setCheckedKeys(arr);
                this.treeSelectNode = this.$refs.dropdownTree.getCheckedNodes();
            }
        },
        // 获取被选中
        getCheckedKeys () {
            if (this.$refs.dropdownTree) {
                return this.$refs.dropdownTree.getCheckedKeys();
            }
        },
        setCheckedNodes (nodes) {
            this.$refs.dropdownTree.setCheckedNodes(nodes);
        },
        getCheckedNodes () {
            if (this.$refs.dropdownTree) {
                return this.$refs.dropdownTree.getCheckedNodes();
            } else {
                return [];
            }
        },
        nodeClick (nodeData, node) {
            /*
             * console.log(nodeData,node,nodeCompoennt, this.$refs.dropdownTree.getCheckedKeys())
             * let arr=this.$refs.dropdownTree.getCheckedKeys();
             * arr.push(node.id)
             * console.log(arr)a
             */
            if ((!node.isLeaf || nodeData.folder) && !this.fatherCanSelect) {
                return;
            }

            if (!this.mutiple) {
                if (this.currentSelectedItem) {
                    this.$refs.dropdownTree.setChecked(
                        this.currentSelectedItem.store
                            ? this.currentSelectedItem.key
                            : this.currentSelectedItem[this.nodekey],
                        false,
                    );
                }
                this.$refs.dropdownTree.setChecked(nodeData[this.nodekey], true);
                this.$emit('closeDrop', {
                    selected: nodeData[this.nodekey],
                    item: nodeData,
                });
                this.$emit('dropdown-close');
                this.clickoutSide();
            } else {
                this.$refs.dropdownTree.setChecked(
                    nodeData[this.nodekey],
                    !node.checked,
                    !this.checkStrictly,
                );
                if (this.isTree) {
                    this.selectNumber = this.$refs.dropdownTree.getCheckedKeys().length;
                    this.treeSelectNode = this.$refs.dropdownTree.getCheckedNodes();
                }
            }
            this.currentSelectedItemPointer = {
                dbId: this.currentSelectedItem && this.currentSelectedItem.data && this.currentSelectedItem.data.dbId,
                dbName: this.currentSelectedItem && this.currentSelectedItem.data && this.currentSelectedItem.data.dbName,
            };
            this.currentSelectedItem = nodeData;
            this.$emit('nodeClick', { selected: this.getCheckedKeys(), nodeData, type: this.searchKey ? 'search' : 'tree' });
        // this.$refs.dropdownTree.setCheckedKeys(arr)
        },
        filterNode (value, data) {
            if (!value) return true;
            // return data[this.defaultProps.label].indexOf(value) !== -1;
            return String(data[this.defaultProps.label]).toLowerCase()
                .indexOf(String(value).toLowerCase()) !== -1;
        },
        // 清空input
        clearInputValue () {
            if (this.clearSelctEmutable) {
                this.allSet('clear');
                return;
            }
            this.clearContent();
            if (!this.searchKey) {
                this.clickoutSide();
            }
            if (this.mutiple) {
                this.$emit('changeItem', {
                    selectItemArr: [],
                    selected: [],
                    editItem: {},
                });

                this.emitRemoteSearch(null);
            } else {
                this.$emit('closeDrop', {
                    selected: null,
                    item: {},
                });
                setTimeout(() => {
                    this.$emit('dropdown-close');
                }, 0);
                this.emitRemoteSearch(null);
            }
            this.$emit('change', []);
            this.$emit('clear');
            if (this.isTree) {
                this.$emit('nodeClick', { selected: [], nodeData: {} });
            }
        },
        // 清除数据
        clearContent () {
            this.selectNumber = 0;
            this.currentSelectedItem = {};
            this.selected = [];
            this.searchKey = '';
            this.currentSelected = -1;
            this.selectAllShow = true;
            this.selectArray = [];
            if (!this.isTree) {
                this.listArray.forEach(_ => {
                    _.select = false;
                });
            } else {
                this.setCheckedKeys([]);
            }
        },
        // 清空搜索数据
        clearSearchContent () {
            this.searchKey = '';
        },
        focusInput () {
            // this.visible = true;
            this.searchKey = '';
            if (this.fastfilter && this.fastClickArr != '') {
                this.fastClick = this.fastClickArr[0][this.fastSelectVal];
            }
            this.searchItem();
            this.$emit('focusInput');
            this.dropDownHeight = (document.body.clientHeight - 466) / 2 + 200 - 90 - 40;
            this.dropDownHeight = this.dropDownHeight > 200 ? 200 : this.dropDownHeight;
            this.dropDownHeight = this.dropDownHeight < 100 ? 100 : this.dropDownHeight;
        },
        getSelected (item) {
            this.selected = [];
            let selectArr = [];
            this.listArray.filter(_ => {
                if (_.select) {
                    this.selected.push(_[this.selectVal]);
                    selectArr.push(_);
                }
                return undefined;
            });
            if (!(this.searchKey && this.afterSearch)) {
                this.selectItemParam.selectItemArr = selectArr;
            }
            this.selectItemParam.selected = (this.searchKey) ? this.selectArray : this.selected;
            // this.selectItemParam.rowItem=this.rowItem;
            this.selectNumber = (this.searchKey) ? this.selectArray.length : this.selected.length;
            // console.log("selectNumber",this.selectNumber)
            this.$emit('change', (this.searchKey) ? this.selectArray : this.selected);

            this.$emit('changeItem', {
                selectItemArr: selectArr,
                selected: (this.searchKey) ? this.selectArray : this.selected,
                editItem: this.editItem,
                selectItem: item,
            });
        },
        fastFilterGetData (item) {
            this.fastClick = item.id;
            this.listArrayShow = this.listArray.filter(_ => {
                if (!_[this.level]) {
                    _[this.level] = '';
                }
                if (this.fastClick == '') {
                    return (
                        String(_[this.showName])
                            .toLowerCase()
                            .indexOf(String(this.searchKey).toLowerCase()) != -1
                    );
                } else {
                    return (
                        String(_[this.showName])
                            .toLowerCase()
                            .indexOf(String(this.searchKey).toLowerCase()) != -1
                        && _[this.level] == this.fastClick
                    );
                }
            });
        },
        searchItem (type) {
            if (!this.searchKey && type == 'change') {
                this.emitRemoteSearch(null);
            }

            if (type == 'change') {
                this.afterSearch = false;
            }
            if (this.fastClickArr == '' || this.fastClick == '') {
                this.listArrayShow = this.listArray.filter(_ => (
                    String(_[this.showName])
                        .toLowerCase()
                        .indexOf(String(this.searchKey).toLowerCase()) != -1
                ));
            } else {
                this.listArrayShow = this.listArray.filter(_ => (
                    String(_[this.showName])
                        .toLowerCase()
                        .indexOf(String(this.searchKey).toLowerCase()) != -1
                    && _[this.level] == this.fastClick
                ));
            }
            // 如果关键词搜索，展示列表按照关键词匹配程度排序
            if (this.searchKey) {
                this.listArrayShow = this.listArrayShow.sort((a, b) => String(a[this.showName]).length - String(b[this.showName]).length);
            }
            this.listArrayShow = this.selectedForwardSort(this.listArrayShow);
            // console.log('this.visible=false;this.visible=false;')
            if (this.$refs.dropDownRef && this.$refs.dropDownRef.$refs.drop) {
                this.$refs.dropDownRef.$refs.drop.update();
            }
        },
        selectedForwardSort (arr) {
            if (this.selectedForward) {
                let selectedArr = [];
                let notSelectedArr = [];
                arr.forEach(_ => {
                    if (_.select) {
                        selectedArr.push(_);
                    } else {
                        notSelectedArr.push(_);
                    }
                });
                if (selectedArr.length == arr.length) {
                    this.selectAllShow = false;
                } else {
                    this.selectAllShow = true;
                }
                return selectedArr.concat(notSelectedArr);
            } else {
                // this.selectAllShow = true
                return arr;
            }
        },
        allSet (type) {
            if (type === 'clear') {
                this.selectAllShow = false;
            }
            this.selectAllShow = !this.selectAllShow;
            this.listArrayShow.forEach(_ => {
                if (_.disabled) {
                    return;
                }
                this.$set(_, 'select', !this.selectAllShow);
                if ((this.searchKey)) {
                    if (_.select) {
                        this.selectArray.push(_[this.selectVal]);
                    } else {
                        let deleteIndex = this.selectArray.indexOf(_[this.selectVal]);
                        if (deleteIndex !== -1) {
                            this.selectArray.splice(deleteIndex, 1);
                        }
                    }
                } else {
                    if (_.select) {
                        this.selectArray.push(_[this.selectVal]);
                    } else {
                        let deleteIndex = this.selectArray.indexOf(_[this.selectVal]);
                        if (deleteIndex !== -1) {
                            this.selectArray.splice(deleteIndex, 1);
                        }
                    }
                }
            });
            // if(this.searchKey){
            this.selectArray = [...(new Set(this.selectArray))];
            // }
            this.getSelected(`allSet-${!this.selectAllShow}`);
        },
        initSelectArray () {
            this.selectArray = deepCopy(this.selected);
        },
        cancelSelect (item, nodeData) { // 多选 删除一个选项
            if (this.isTree) {
                this.$refs.dropdownTree.setChecked(
                    item,
                    false,
                    !this.checkStrictly,
                );
                this.treeSelectNode = this.$refs.dropdownTree.getCheckedNodes();
                this.$emit('nodeClick', { selected: this.$refs.dropdownTree.getCheckedKeys(), nodeData });
            } else {
                this.listArray.some(el => {
                    if (el[this.selectVal] === item) {
                        this.selectItem(el, 'cancel');
                        return true;
                    }
                    return false;
                });
            }
        },
        selectItem (item, type) {
            if (item && !item.disabled) {
                if (this.mutiple) {
                    type == 'cancel' ? this.$set(item, 'select', false) : this.$set(item, 'select', !item.select);
                    // item.select=!item.select;
                    this.currentSelected = item[this.selectVal];
                    if (this.searchKey && this.afterSearch) {
                        if (item.select) {
                            this.selectArray.push(item[this.selectVal]);
                        } else if (!item.select) {
                            this.selectArray.splice(this.selectArray.indexOf(item[this.selectVal]), 1);
                            this.selectArray = [...(new Set(this.selectArray))];
                        }
                    } else {
                        if (item.select) {
                            this.selectArray.push(item[this.selectVal]);
                        } else {
                            let index = this.selectArray.findIndex(ele => ele == item[this.selectVal]);
                            this.selectArray.splice(index, 1);
                        }
                    }
                    this.getSelected(item);
                    this.$forceUpdate();
                } else {
                    if (item.select) {
                        return;
                    }
                    if (
                        this.currentSelectedItem[this.selectVal] != item[this.selectVal]
                    ) {
                        this.$set(this.currentSelectedItem, 'select', false);
                        // this.$set(item, "select", !item.select);
                        this.currentSelectedItem = item;
                        this.currentSelected = item[this.selectVal];
                    }
                    this.$set(item, 'select', !item.select);
                    /*
                     * this.selectArray=[];
                     * this.selectArray.push(item[this.selectVal]);
                     * this.getSelected();
                     * this.$forceUpdate();
                     */

                    this.clickoutSide();
                    this.$emit('change', [this.currentSelected]);
                    this.$emit('selectItem', this.currentSelected);
                    this.$emit('closeDrop', {
                        selected: item.select && item[this.selectVal],
                        editItem: this.editItem,
                        item,
                    });
                    this.$emit('dropdown-close');
                }
            }
        },
        blurInput () {
        /*
         * debugger
         * this.visible = !this.visible;
         */
        },
        clickoutSide () {
            Bus.$emit('close-currentHoverTreeContent');
            if (this.configFooter.config) {
                this.emitRemoteSearch(null, 'clickoutside');
            }
            // this.searchKey = null;
            this.visible = false;
            this.$emit('clickOutside');
        },
        init (listArrayData, selectedData, type) {
            /*
             * if(listArrayData.length && (!listArrayData[0][this.selectVal]&&listArrayData[0][this.selectVal]!==0)){
             *   listArrayData.splice(0,1);
             * }
             * debugger
             * let mapData = listArrayData.reduce((obj,item)=>{
             *     obj[item.showName] = item.showName
             *     return obj
             *   },{})
             * selectedData.forEach((item)=>{
             *   if(!mapData.hasOwnProperty(item) && item !== null){
             *     listArrayData.unshift({
             *       showName:item,
             *       columnId:item,
             *       select:true,
             *     })
             *   }
             * })
             */
            this.afterSearch = false;
            if (this.$refs.dropDownRef && this.$refs.dropDownRef.$refs.drop) {
                this.$refs.dropDownRef.$refs.drop.update();
            }

            /*
             * selectedData.forEach((item)=>{
             *   item = item.replace(/^\"|\"$/g,'');//去除str 前后的双引号
             * })
             * debugger
             */
            let listArray = this.isDeepCopyData ? deepCopy(listArrayData) : listArrayData;
            let selected = this.isDeepCopyData ? deepCopy(selectedData) : selectedData;
            selected = selected && selected.length ? selected : [];
            if (type !== 'fresh') {
                this.searchKey = '';
            } else {
                this.afterSearch = true;
            }
            // this.selectAllShow=true;
            if (listArrayData && selectedData && listArrayData.length == selectedData.length) {
                this.selectAllShow = false;
            } else {
                this.selectAllShow = true;
            }
            this.currentSelected = -1;
            this.listArray = listArray;
            this.selected = selected;
            this.selectNumber = this.selected.length;
            if (type !== 'fresh') {
                this.initSelectArray();
            }
            const m = new Map();

            if (!this.mutiple) {
                this.currentSelectedItem
                    = listArray.find(_ => _[this.selectVal] == selected[0]) || {};
            }
            this.selected && this.selected.forEach(_ => {
                // m.set(_, true);
                m.set(_, true);
            });

            this.listArrayShow = [];
            let arr = [];
            this.listArray.forEach(_ => {
                if (m.has(`${_[this.selectVal]}`) || m.has(_[this.selectVal])) {
                    _.select = true;
                } else {
                    try {
                        _.select = false;
                    } catch {
                        // debugger;
                    }
                }
                arr.push(_);
                /*
                 * if(_[this.showName]!==''){
                 *   arr.push(_);
                 * }
                 */
            });
            // this.listArrayShow = arr;
            this.listArrayShow = this.selectedForwardSort(arr);
            // 单选,当只设置selectedByTable的时候也需要显示,用于切片器默认条件回显
            if ((!this.mutiple && this.selectedByTable.length && JSON.stringify(this.currentSelectedItem) == '{}' && this.listArrayByTable.length == 0) || (listArrayData && selectedData && selectedData.legnth > 0 && listArrayData.every(ele => ele[this.selectVal] != selectedData[0]))) {
                this.currentSelectedItem = {
                    select: true,
                };
                this.defaultItemProps.forEach(_ => {
                    this.currentSelectedItem[_] = this.selectedByTable[0];
                });
            }
            if (!this.mutiple && this.searchKey && this.afterSearch && selectedData.length && JSON.stringify(this.currentSelectedItem) == '{}') {
                /*
                 * this.currentSelectedItem = {
                 *   showName: selectedData[0],
                 *   columnId: selectedData[0],
                 *   select: true
                 * }
                 */
                this.currentSelectedItem = {
                    select: true,
                };
                this.defaultItemProps.forEach(_ => {
                    this.currentSelectedItem[_] = selectedData[0];
                });
            }
        },
        setCurrentItem (id) {
            this.setCheckedKeys([id]);
            this.currentSelectedItem = this.$refs.dropdownTree.getNode(id);
        },
        updateDropdown () {
            if (this.$refs.dropDownRef && this.$refs.dropDownRef.$refs.drop) {
                this.$refs.dropDownRef.$refs.drop.update();
            }
        },
        initTreeShow (defaultCheckedKeys) {
            if (this.isTree) {
                // console.log('在这里在这里。。。。。。。。。。ashaisahsiahs', this.$refs.dropdownTree.getNode('1-2-3'));
                this.selectNumber = defaultCheckedKeys ? defaultCheckedKeys.length : this.defaultCheckedKeys.length;
                this.setCheckedKeys(defaultCheckedKeys ? defaultCheckedKeys : this.defaultCheckedKeys);
                if (!this.$refs.dropdownTree) {
                    return;
                }
                if (defaultCheckedKeys || this.defaultCheckedKeys[0]) {
                    this.currentSelectedItem = this.$refs.dropdownTree.getNode(defaultCheckedKeys ? defaultCheckedKeys[0] : this.defaultCheckedKeys[0]);
                } else {
                    this.currentSelectedItem = this.getCheckedNodes()[0];
                }
                if (!this.currentSelectedItem) {
                    this.$emit('noMatchItem');
                } else {
                    this.$emit('hasMatchItem', this.currentSelectedItem);
                }
            }
        },
        searchKeyChange (val) {
            if (this.$refs.dropdownTree && val !== null) {
                this.$refs.dropdownTree.filter(val);
                this.$forceUpdate();
            }
        },
    },
};
</script>
<style>
.loading-icon .el-loading-mask {
    background-color: transparent;
}

.loading-icon .el-loading-spinner .circular {
    width: 26px;
    height: 26px;
}

.loading-icon .el-loading-spinner {
    margin-top: -13px;
}
</style>
<style lang="scss" scoped>
/* stylelint-disable font-family-no-missing-generic-family-keyword */
::v-deep .visual-easyselect {
    .el-tree-node:focus > .isFolder {
        background: #3a455c;
    }
}

::v-deep .customeInput .ivu-input {
    height: 100%;
}

.refresh {
    color: rgba(64, 132, 255, 1);
}

.refresh-icon {
    margin-right: 4px;
    font-size: 12px;
    cursor: pointer;
}

.input-show {
    &.selected-style {
        .dropdown {
            ::v-deep input {
                background: rgba(23, 31, 51, 1);
                border-color: transparent;

                &:hover {
                    // box-shadow: 0px 0px 4px 0px rgba(11, 87, 210, 1);
                    // border: 1px solid rgba(64, 132, 255, 1);
                }
            }
        }
    }

    .dropdown {
        ::v-deep input {
            color: #fff;
            border-radius: 2px;
            border: 1px solid rgba(89, 148, 255, 1);
            background: linear-gradient(to right, rgba(27, 47, 101, 1), rgba(56, 74, 113, 1));

            &[placeholder="请选择"]:hover {
                border: 1px solid rgba(54, 126, 255, 1);
                background: linear-gradient(to right, rgba(34, 63, 136, 1), rgba(67, 86, 129, 1));
            }
            // &:active{
            //   box-shadow: 0px 0px 4px 0px rgba(11, 87, 210, 1);
            //   border: 1px solid rgba(54, 126, 255, 1);
            //   background: linear-gradient(to right, rgba(34, 63, 136, 1), rgba(67, 86, 129, 1) );

            // }
        }
    }

    .trigger-container {
        .input-val {
            padding: 3px 4px;
        }
    }

    ::v-deep {
        .ivu-input {
            height: 28px;
        }

        .el-tree {
            color: #fff;
            font-size: 14px;
            background-color: rgba(58, 69, 92, 1);
            box-shadow: none;

            .el-tree-node__content:not(.selectedTextColor):hover {
                background-color: #313b55;
            }

            .el-tree-node__content {
                background-color: unset;
            }

            .selectedTextColor {
                background-color: #4084ff;
                color: #fff;
            }

            .el-icon-caret-right {
                padding: 0;
            }
        }

        .ivu-select-dropdown {
            border-radius: 2px;
            background-color: rgba(58, 69, 92, 1);
            box-shadow: 0 0 4px 0 rgba(0, 0, 0, .5);
        }

        .input-search {
            input {
                border-radius: 2px;
                color: #fff;
                background-color: rgba(58, 69, 92, 1);
                border: 1px solid rgba(255, 255, 255, .5);
            }
        }
    }
}

.drop-icon-easy {
    color: #808695;
    position: absolute;
    right: 4px;
    top: 8px;
    cursor: pointer;
    font-size: 12px;
}

.clear-icon-easy {
    color: #808695;
    position: absolute;
    right: 3px;
    top: 8px;
    cursor: pointer;
    font-size: 16px !important;
}

.muticlearIcon {
    color: #808695;
    position: absolute;
    right: 4px;
    top: 8px;
    cursor: pointer;
    font-size: 16px !important;
}

.trigger-container .clear-icon {
    display: none;
    z-index: 999;
}

.trigger-container .dropArrow {
    // z-index: 999;
}

.trigger-container:hover .clear-icon {
    display: inline-block;
}

.trigger-container:hover .dropArrow {
    display: none;
}

.mutiSelct {
    &:hover {
        ::v-deep .ivu-input {
            border-color: #6998ec !important;
        }
    }
}

.trigger-container {
    position: relative;
    line-height: 1;

    .input-val {
        &.visual {
            color: #fff;
            background: #171f33;
            border: 1px solid #171f33;
            border-radius: 2px;

            &:hover {
                border: 1px solid #4084ff;
            }

            &:focus {
                border: 1px solid #4084ff;
            }

            &.showBoder {
                border: 1px solid #4084ff;
                box-shadow: 0 0 4px 0 #0b57d2;
            }
        }

        position: absolute;
        // height: 32px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        // top: 0;
        // background: #f7f7f7;
        left: 6px;
        top: 50%;
        transform: translateY(-12px);
        padding: 3px 6px;
        border-radius: 4px;

        .hidden-ellipsis {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .close-icon {
            display: none;
            color: #808695;
            font-size: 13px !important;

            &:hover {
                cursor: pointer;
            }
        }

        &:hover {
            .close-icon {
                display: block;
            }
        }
    }
}

.more-height {
    .trigger-container {
        .input-val {
            height: 32px;
            top: 0;
            left: 0;
            transform: translateY(0);
        }
    }
}

.input-show.more-height {
    ::v-deep {
        .ivu-input {
            height: 32px;
        }
    }
}

.select-conntainer {
    display: inline-block;
}

.search-input {
    margin-bottom: 10px;
}

.fast-filter {
    line-height: 24px;
    margin-bottom: 10px;

    .fast-icon {
        display: inline-block;
        text-align: center;
        position: relative;
        width: 40px;
        height: 24px;
        background-color: rgba(68, 126, 231, .1);
        border-radius: 4px;
        margin-right: 10px;

        .icon {
            line-height: 1;
            font-size: 12px;
            position: absolute;
            bottom: 1px;
            right: 0;
            color: #447ee7;
        }
    }
}

.tree-all-set {
    text-align: left;
    cursor: pointer;
    line-height: 26px;

    &:hover {
        background-color: #f5f7fa;
    }
}

.input-span-disabled {
    color: #ccc;
}

.list-container {
    text-align: left;
    max-height: 200px;
    overflow: auto;

    li {
        &.disabled {
            background-color: #f3f3f3;
            opacity: 1;
            cursor: not-allowed !important;
            color: #ccc !important;
        }

        &.small {
            padding: 6px 8px;

            &.active::after {
                top: 3px;
                right: 1px;
                font-size: 20px;
            }
        }

        &.default {
            padding: 7px 16px;

            &.active.disabled::after {
                color: #ccc !important;
            }

            &.active::after {
                top: 2px;
                right: 8px;
                font-size: 24px;
            }
        }

        &.large {
            padding: 7px 16px;
        }

        display: flex;
        align-items: center;
        position: relative;
        margin: 0;
        line-height: normal;
        clear: both;
        color: #515a6e;
        font-size: 12px !important;
        white-space: nowrap;
        list-style: none;

        &.nodata {
            text-align: center;
            display: block;
        }

        .show-text {
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 100%;
            margin-right: 10px;
            height: 100%;
            min-height: 14px;
            overflow: hidden;
        }

        &.active {
            color: #447ee7;
        }

        &.selected {
            background: #f3f3f3;
        }

        &:hover {
            background: #f3f3f3;
        }

        &.active::after {
            display: inline-block;
            font-family: Ionicons;
            speak: none;
            font-style: normal;
            font-weight: 400;
            font-variant: normal;
            text-transform: none;
            text-rendering: optimizeLegibility;
            line-height: 1;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            vertical-align: -.125em;
            text-align: center;
            font-size: 24px;
            content: "\F171";
            color: rgba(45, 140, 240, .9);
            position: absolute;
            // top: 2px;
            // right: 8px;
        }
    }
}

.tipLine {
    display: inline-block;
    height: 1px;
    width: 100%;
    border: 1px solid rgba(255, 255, 255, .12);
}

.opdateTipShow {
    position: absolute;
    display: inline-block;
    height: 22px;
    width: 28px;
    line-height: 20px;
    text-align: center;
    right: 8px;
    // right: 3px;
    font-size: 13px;
    opacity: 0;

    .tipShowIcon {
        position: relative;

        .tipShowContent {
            z-index: 999999999;
            display: none;
            position: fixed;
            top: 0;
            left: 0;
        }

        &:hover {
            .tipShowContent {
                display: block;
            }
        }
    }
}

.common-list-wrapper {
    overflow: overlay;

    .common-collection-list {
        padding-bottom: 10px;
        min-width: 100%;
        width: fit-content;
        overflow: overlay;
        height: 300px;
        box-sizing: border-box;

        .empty-text {
            display: flex;
            justify-content: center;
            height: 25px;
            line-height: 25px;
        }

        &.visual {
            li {
                &:hover {
                    background-color: #313b55;
                }

                &.selected {
                    background-color: #4084ff;

                    span {
                        color: rgba(255, 255, 255, 85);
                    }
                }

                span {
                    color: rgba(255, 255, 255, 85);
                }
            }
        }

        li {
            white-space: nowrap;
            padding-left: 16px;
            // display: flex;
            align-items: center;
            cursor: pointer;
            height: 26px;
            line-height: 26px;

            &:hover {
                background-color: #f5f7fa;

                .opdateTipShow {
                    opacity: 1;
                }
            }

            &.selected {
                span {
                    color: #447ee7;
                }
            }

            .dot-tip {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                margin-right: 4px;
            }

            span {
                color: #555;
            }
        }
    }
}

.collection-type-btn {
    overflow: hidden;
    margin-bottom: 8px;

    &.visual {
        .btn {
            &.active {
                color: rgba(255, 255, 255, 100);
                background-color: rgba(64, 132, 255, .5);
            }

            background-color: #4e5b77;
            color: rgba(255, 255, 255, 85);
        }
    }

    .btn {
        &.active {
            color: rgba(38, 43, 57, 100);
            background-color: rgba(64, 132, 255, .2);
        }

        border: none;
        background-color: #f3f4f5;
        color: rgba(118, 119, 124, 100);
        float: left;
        border-radius: 2px;
        width: 186px;
        height: 26px;
        padding: 0;
        line-height: 26px;
        text-align: center;

        span {
            height: 24px;
            line-height: 24px;
        }

        &:not(:first-of-type) {
            margin-left: 8px;
        }
    }
}

.no-match-text {
    text-align: left;
    width: calc(100% - 2px);
    left: 1px;
    display: flex;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.selected-label {
    text-align: left;
    width: calc(100% - 2px);
    left: 1px;
    display: flex;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
  </style>
