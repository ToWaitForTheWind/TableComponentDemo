<template>
    <div
        class="easy-select-new"
        :class="basicConfig.size"
    >
        <Dropdown
            ref="dropDownRef"
            :visible="visible"
            trigger="custom"
            :placement="basicConfig.placement"
            :transfer="basicConfig.transfer"
            @on-clickoutside="onClickOutSide"
        >
            <div
                class="trigger-container"
                @click="toClickSearch"
                @mouseover="isHover = true"
                @mouseout="isHover = false"
            >
                <template v-if="$slots.trigger">
                    <slot name="trigger"></slot>
                </template>
                <template v-else>
                    <div class="trigger-search-area">
                        <div class="placeholder-text text-area">{{ placeholder }}</div>
                        <div class="selected-data text-area">{{value}}</div>
                        <i
                            v-if="!isHover"
                            class="iconfont iconxiasanjiaoxing"
                            :class="{ 'is-open': visible }"
                        ></i>
                        <i
                            v-if="isHover"
                            class="iconfont iconguanbicopy"
                        ></i>
                    </div>
                </template>
            </div>
            <DropdownMenu
                slot="list"
                class="dropdown-menu-area"
            >
                <div class="search-area">
                    <i-input
                        ref="searchRef"
                        v-model="searchValue"
                        class="search-input"
                        :size="basicConfig.size"
                        autofocus
                        clearable
                        prefix=""
                        :placeholder="searchPlaceholder"
                        style="width: 100%;"
                        @on-change="searchItem"
                    >
                        <i
                            class="iconfont iconsousuo3"
                            slot="prefix"
                        ></i>
                    </i-input>
                </div>
                <div class="data-container">
                    <div
                        v-if="loading"
                        class="loading-content"
                    >
                        <svg
                            class="circular"
                            viewBox="25 25 50 50"
                        >
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
                            <div
                                v-for="(item, index) in currentDataList"
                                :key="index"
                                class="data-item"
                                :title="item[defaultProps.label]"
                                :class="{ 'is-checked': item.isChecked, 'is-disabled': item.isDisabled }"
                                @click="toSelect(index, item)"
                            >
                                <div
                                    class="data-label"
                                    v-html="filterShowName(item[defaultProps.label], searchValue)"
                                ></div>
                                <i
                                    v-if="item.isChecked"
                                    class="iconfont icongou"
                                ></i>
                            </div>
                        </template>
                        <div
                            v-else
                            class="no-data"
                        >暂无数据</div>
                    </template>
                </div>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
import _ from 'lodash';

export default {
    components: {},
    props: {
        value: { // v-model绑定的值
            type: Array,
            default: () => [],
        },
        basicConfig: {
            type: Object,
            default: () => ({
                theme: 'light', // 主题风格（light, dark）
                placement: 'bottom-start', // dropdown位置（参考view-design的Dropdown组件）
                transfer: false, // 是否设置dropdown为transfer模式
                size: 'default', // 组件尺寸（small, default, large）
                multiple: false, // 是否多选
            }),
        },
        placeholder: { type: String, default: '请选择' }, // 外部选择器的placeholder
        searchPlaceholder: { type: String, default: '请输入' }, // 下拉内部搜索输入框的placeholder
        disabled: { type: Boolean, default: false }, // 是否禁用
        showSearch: { type: Boolean, default: true }, // 是否支持可搜索功能
        dataList: { type: Array, default: () => [{ label: 'aaa', value: 'a' }, { label: 'bbb', value: 'b' }, { label: 'ccc', value: 'c' }] }, // 用于渲染可选列表的数据
        defaultProps: {
            type: Object,
            default () {
                return {
                    label: 'label',
                    value: 'value',
                    children: 'children',
                };
            },
        },
        loading: { type: Boolean, default: false }, // 数据展示是否处于loading状态
        loadingText: { type: String, default: '加载中' }, // 数据展示loading状态展示文案
    },
    data () {
        return {
            visible: false,
            isHover: false, // 是否处于hover状态
            searchValue: '', // 搜索框绑定的值
            currentDataList: [], // 实际用于渲染的可选列表数据
            selectedDatas: [], // 已选择数据
            selectedDataValues: [], // 已选择数据value值
        };
    },
    computed: {},
    watch: {
        dataList: {
            handler (arr) {
                this.toSetCurrentDataList(arr);
            },
            immediate: true,
            deep: true,
        },
    },
    created () {
        this.initData();
    },
    mounted () {},
    methods: {
        initData () {
            this.selectedDataValues = _.cloneDeep(this.value);
            let selectedDatas = [];
            this.selectedDataValues.forEach(value => {
                let findRes = this.dataList.find(item => value === item[this.defaultProps.value]);
                if (findRes !== undefined) selectedDatas.push(findRes);
            });
            this.selectedDatas = _.cloneDeep(selectedDatas);
        },
        onClickOutSide () {
            this.visible = false;
        },
        toClickSearch () {
            this.visible = true;
        },
        searchItem: _.debounce(function () {
            this.toSetCurrentDataList(this.dataList);
        }, 500, { leading: true }),
        filterShowName (val, searchKey) {
            if (!searchKey || !val) return val;
            let keyValueCopy = searchKey;
            // 一些特殊符号，需要进行转义，如| 要转成\|
            keyValueCopy = keyValueCopy
                .replace(/(\||\\|\^|\/|\$|\*|\+|\?)/, $ => `\\${$}`)
                .replace(/\(/g, '\\(')
                .replace(/\)/g, '\\)');
            let reg = new RegExp(keyValueCopy, 'g');
            return String(val).replace(reg, `<span class='primary-color'>${searchKey}</span>`);
        },
        toSetCurrentDataList (arr) {
            if (!this.searchValue) this.currentDataList = _.cloneDeep(arr);
            else {
                let filterArr = [];
                arr.forEach(item => {
                    if (item[this.defaultProps.label].indexOf(this.searchValue) > -1) filterArr.push(item);
                });
                this.currentDataList = _.cloneDeep(filterArr);
            }
        },
        toSelect (index, selectItem) {
            if (!this.basicConfig.multiple) {
                // 单选
                this.selectedDataValues[0] = selectItem[this.defaultProps.value];
                this.selectedDatas[0] = selectItem;
                this.$set(this.currentDataList[index], 'isChecked', true);
                let findRes = this.currentDataList.findIndex(data => data.isChecked === true);
                this.$set(this.currentDataList[findRes], 'isChecked', false);
            } else {
                if (this.currentDataList[index][this.defaultProps.value] === selectItem[this.defaultProps.value]) {
                    let ifChecked = this.currentDataList[index].isChecked;
                    if (ifChecked) {
                        // 当前已选中，则取消
                        let findRes = this.selectedDataValues.findIndex(value => value === selectItem[this.defaultProps.value]);
                        if (findRes > -1) {
                            this.selectedDataValues.splice(findRes, 1);
                            this.selectedDatas.splice(findRes, 1);
                        }
                    } else {
                        // 当前未选中，则存储
                        this.selectedDataValues.push(selectItem[this.defaultProps.value]);
                        this.selectedDatas.push(selectItem);
                    }
                    this.$set(this.currentDataList[index], 'isChecked', !ifChecked);
                }
            }
            this.$emit('input', _.cloneDeep(this.selectedDataValues));
        },
    },
};
</script>

<style lang="scss">
.easy-select-new {
    font-size: 12px;
    color: #262b39;

    .trigger-search-area {
        width: 120px;
        height: 32px;
        border-radius: 1px;
        background-color: #ffffff;
        border: 1px solid #e0e3e6;
        cursor: pointer;
        padding: 0 8px;
        display: flex;
        align-items: center;

        &:hover {
            border: 1px solid #4084ff;
            box-shadow: 0px 0px 4px 0px rgba(37, 126, 255, 0.3);
        }

        .text-area {
            width: calc(100% - 32px);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .iconxiasanjiaoxing {
            transform: scale(0.8);
            transition: all ease-in-out .1s;

            &.is-open {
                transform: scale(0.8) rotate(-180deg);
            }
        }
    }

    .dropdown-menu-area {
        .search-area {
            margin: 7px 12px 4px;
        }

        .ivu-input-prefix, .ivu-input-suffix {
            width: 26px;
            color: #b9bac1;;
        }

        .ivu-input-with-prefix {
            padding-left: 26px;
        }

    }
    .data-container {
        .data-item {
            height: 32px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            cursor: pointer;

            .data-label {
                width: calc(100% - 10px);
                max-width: 378px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex-shrink: 0;
            }

            &:hover {
                background-color: #f5f5f5;
            }

            &.is-checked {
                // background-color: #f5f8ff;
                font-weight: bold;

                .iconfont {
                    color: #4084ff;
                }
            }

            &.is-disabled {
                color: #262b39;
                cursor: not-allowed;
            }
        }

        .no-data {
            color: #B9BAC1;
            text-align: center;
            margin-top: 16px;
            margin-bottom: 6px;
        }
    }

    .placeholder-text {
        user-select: none;
        color: #b9bac1;
    }

    .iconfont {
        font-size: 12px;

        &.iconguanbicopy {
            color: #dcdee0;
        }
    }

    .loading-content {
        text-align: center;
        margin-top: 19px;

        .circular {
            width: 26px;
            height: 26px;
            margin: 0 auto;
            animation: rotate 2s linear infinite;
            transform-origin: center center;

            .path {
                stroke-dasharray: 1, 200;
                stroke-dashoffset: 0;
                animation: dash 1.5s ease-in-out infinite;
                stroke-linecap: round;
            }
        }

        .loading-text {
            margin-top: 8px;
            margin-bottom: 6px;
        }
    }

    &.small {
        .trigger-search-area {
            height: 24px;
        }
    }

    &.large {
        font-size: 14px;

        .trigger-search-area {
            height: 40px;
        }
    }

    @keyframes dash {
        0% {
            stroke-dasharray: 1,200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89,200;
            stroke-dashoffset: -35;
        }
        100% {
            stroke-dasharray: 89,200;
            stroke-dashoffset: -124;
        }
    }
}
</style>
