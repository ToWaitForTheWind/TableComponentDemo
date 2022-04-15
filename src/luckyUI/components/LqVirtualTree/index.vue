<template>
    <div
        :ref="`treeContainer${randomNum}`"
        class="lq-virtual-tree"
        :style="`height: ${(showFlattedTreeList.length > showNumber ? showNumber : showFlattedTreeList.length) * itemHeight}px;`"
    >
        <div
            v-if="useVirtualScroll"
            class="scroll-blank"
            :style="`height: ${showFlattedTreeList.length * itemHeight}px;`"
        ></div>
        <div
            class="scroll-data"
            :style="useVirtualScroll ? `margin-top: ${positionTop}px;` : ''"
        >
            <div
                v-for="(item, index) in useVirtualScroll ? activeList : showFlattedTreeList"
                :key="index"
                class="scroll-item"
                :class="[{ 'is-disabled': item[currentProps.disabled], 'is-multiple': currentConfig.multiple }, item[currentProps.className]]"
                :style="`height: ${itemHeight}px; line-height: ${itemHeight}px;`"
            >
                <div
                    class="inner-box"
                    :style="`padding-left: ${item.level * 18}px;`"
                >
                    <span
                        class="arrow"
                        :class="{ 'not-open': !item.isExpand }"
                    >
                        <i
                            v-if="item[currentProps.children] && item[currentProps.children].length > 0"
                            class="iconfont iconln_sanjiaoyou"
                            @click="toggleExpand(item)"
                        ></i>
                    </span>
                    <span
                        class="lq-tree-label"
                        :class="{ 'lq-tree-label-checked': ifCurrentChecked(item) }"
                        :title="item[currentProps.label]"
                        @click="handleSelect(item)"
                    >
                        <slot
                            name="listItem"
                            :listItem="item"
                            :listIndex="useVirtualScroll ? index + startNum : index"
                        >
                            <span>{{ item[currentProps.label] }}</span>
                        </slot>
                    </span>
                    <i
                        v-if="currentConfig.multiple"
                        :class="{ 'is-show': ifCurrentChecked(item) }"
                        class="iconfont iconxuanzhong tree-node-checked-icon"
                    ></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { cloneDeep } from 'lodash-es';
import { filterShowName } from '../../utils/CommonMethods';
export default {
    components: {},
    props: {
        showNumber: { type: Number, default: 8 }, // 当前视窗展示条数
        itemHeight: { type: Number, default: 20 }, // 每一条内容的高度
        dataList: { type: Array, default: () => [] },
        checkedValues: { type: Array, default: () => [] }, // 当前选中项
        defaultProps: { type: Object, default: () => {} }, // 可以选择性设置，不要求全部传递
        basicConfig: { type: Object, default: () => {} },
    },
    data () {
        return {
            startNum: 0, // 当前视窗范围内第一个元素下标
            positionTop: 0, // 当前视窗范围内第一个元素偏移量
            randomNum: '', // 一个随机数
            currentDataList: [],
            flattedTreeList: [], // 拍平之后的数据
        };
    },
    computed: {
        currentProps () {
            let props = {
                label: 'label',
                value: 'value',
                children: 'children',
                disabled: 'disabled', // 下拉节点置灰不可选
                canNotSelect: 'canNotSelect', // 下拉节点正常显示，但是不可选
                delete: 'delete', // 下拉节点不显示同时回显置灰
            };
            return { ...props, ...this.defaultProps };
        },
        currentConfig () {
            let config = {
                multiple: false, // 是否多选
                defaultExpandLevel: 1, // tree模式下默认展开层级数
                defaultExpandAll: true, // tree模式下默认是否展开全部
                canNotSelectLevel: 0, // tree模式下默认前几级不可选
                useVirtualScrollNumber: 50, // 使用虚拟滚动的临界值
            };
            return { ...config, ...this.basicConfig };
        },
        activeList () {
            const start = this.startNum;
            return this.showFlattedTreeList.slice(start, start + this.showNumber);
        },
        showFlattedTreeList () {
            return this.flattedTreeList.filter(item => item.isShow && !item[this.currentProps.delete]);
        },
        useVirtualScroll () {
            // 当拍平后的数据长度大于虚拟滚动限制数字时候启用虚拟滚动
            return this.showFlattedTreeList.length > this.currentConfig.useVirtualScrollNumber;
        },
    },
    watch: {
        dataList: {
            handler (data) {
                this.currentDataList = cloneDeep(data);
                this.toSetFlattedData(this.currentDataList);
            },
            deep: true,
            immediate: true,
        },
    },
    created () {
        this.randomNum = Math.random();
    },
    mounted () {
        this.$refs[`treeContainer${this.randomNum}`].addEventListener('scroll', this.scrollEvent);
    },
    beforeDestroyed () {
        this.$refs[`treeContainer${this.randomNum}`].removeEventListener('scroll');
    },
    methods: {
        filterShowName,
        scrollEvent (event) {
            const { scrollTop } = event.target;
            this.startNum = parseInt(scrollTop / this.itemHeight);
            this.positionTop = scrollTop;
        },
        flatTreeToList  (data) {
            let that = this;
            let resList = [];
            function travelTree (tree, level) {
                tree.forEach(item => {
                    that.$set(item, 'level', level);
                    // 当设置默认展开全部或者处于搜索中时
                    if (that.currentConfig.defaultExpandAll) {
                        that.$set(item, 'isExpand', true);
                        that.$set(item, 'isShow', true);
                    } else {
                        that.$set(item, 'isExpand', item.level < that.currentConfig.defaultExpandLevel);
                        that.$set(item, 'isShow', item.level <= that.currentConfig.defaultExpandLevel);
                    }
                    resList.push(item);
                    if (item[that.currentProps.children] && item[that.currentProps.children].length) travelTree(item[that.currentProps.children], level + 1);
                });
            }
            travelTree(data, 0);
            return resList;
        },
        setCheckedProperty (tree, checkedArray) {
            // 设置已勾选节点展开及其父节点展开
            let that = this;
            let pathList = [];
            function travel (list) {
                list.forEach(item => {
                    if (checkedArray.findIndex(checked => checked == item[that.currentProps.value]) > -1) {
                        // 已勾选节点的展开处理
                        pathList.forEach(path => {
                            that.$set(path, 'isExpand', true);
                            that.$set(path, 'isShow', true);
                            path[that.currentProps.children].forEach(p => {
                                that.$set(p, 'isShow', true);
                            });
                        });
                    }
                    if (item[that.currentProps.children] && item[that.currentProps.children].length > 0) {
                        pathList.push(item);
                        travel(item[that.currentProps.children]);
                        pathList.pop();
                    }
                });
            }
            travel(tree);
        },
        toSetFlattedData (data) {
            this.flattedTreeList = this.flatTreeToList(data);
            this.setCheckedProperty(data, this.checkedValues);
        },
        ifCurrentChecked (current) {
            return this.checkedValues.findIndex(item => item == current[this.currentProps.value]) > -1;
        },
        // 点击展开收拢
        toggleExpand (item) {
            let isExpand = item.isExpand;
            item.isExpand = !isExpand;
            if (item[this.currentProps.children] && item[this.currentProps.children].length) this.setTreeStatus(item[this.currentProps.children], !isExpand);
        },
        // 处理相应节点状态
        setTreeStatus (children, status) {
            const travel = list => {
                list.forEach(child => {
                    child.isShow = status;
                    if (child[this.currentProps.children] && child[this.currentProps.children].length) {
                        if ((status && child.isExpand) || !status) travel(child[this.currentProps.children]);
                    }
                });
            };
            travel(children);
        },
        handleSelect (item) {
            if (item.level < this.currentConfig.canNotSelectLevel) return; // 低于设置的层级不可点击
            this.$emit('change', item);
        },
    },
};
</script>

<style lang="scss" scoped>
.lq-virtual-tree {
    overflow-y: auto;
    display: flex;

    .scroll-data {
        width: 100%;
    }

    .scroll-item {
        &:hover {
            background: #F6F6F6;
        }

        &.is-disabled {
            cursor: not-allowed;

            &:hover {
                background: transparent;
            }

            .lq-tree-label {
                cursor: not-allowed;
                color: rgba(25, 34, 74, .4);
            }
        }

        .inner-box {
            display: flex;
        }
    }

    .arrow {
        cursor: pointer;
        width: 12px;
        text-align: center;
        display: inline-block;

        .iconfont {
            transition: all .2s ease-in;
            transform: scale(.7) rotate(90deg);
            font-size: 12px;
            color: #C7CCD4;
            display: inline-block;
        }
    }

    .not-open {
        .iconfont {
            transform: scale(.7);
        }
    }

    .lq-tree-label {
        display: inline-block;
        margin: 0;
        padding: 0 4px;
        width: calc(100% - 12px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #262B39;
        cursor: pointer;
        transition: all .2s ease-in-out;

        &-checked {
            color: #4084FF;
        }
    }

    .is-multiple {
        padding-right: 4px;

        .lq-tree-label {
            width: calc(100% - 28px);
        }

        .tree-node-checked-icon {
            transform: scale(.7);
            width: calc(12px / .7);
            font-size: 12px;
            color: #4084FF;
            opacity: 0;

            &.is-show {
                opacity: 1;
            }
        }
    }
}

</style>
