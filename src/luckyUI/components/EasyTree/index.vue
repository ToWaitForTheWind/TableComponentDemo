<template>
    <div
        class="easy-tree"
        ref="treeWrap"
    >
        <template v-for="(item, i) in stateTree">
            <tree-node
                v-if="!item[currentProps.delete]"
                :key="i"
                :data="item"
                visible
                :default-props="currentProps"
                :basic-config="currentConfig"
                :checked-values="checkedValues"
                :search-value="searchValue"
                :level="0"
            >
                <template #listItem="{ listItem }">
                    <slot
                        name="listItem"
                        :listItem="listItem"
                    >
                    </slot>
                </template>
            </tree-node>
        </template>
    </div>
</template>

<script>
import TreeNode from './TreeNode';
import Emitter from './mixins/emitter';
import { cloneDeep } from 'lodash-es';

export default {
    name: 'Tree',
    components: { TreeNode },
    mixins: [Emitter],
    props: {
        basicConfig: { type: Object, default: () => {} },
        data: { type: Array, default: () => [] },
        defaultProps: { type: Object, default: () => {} }, // 可以选择性设置，不要求全部传递
        checkedValues: { type: Array, default: () => [] }, // 当前选中项
        searchValue: { type: String, default: '' }, // 筛选字段
    },
    data () {
        return {
            stateTree: cloneDeep(this.data),
            flatState: [],
        };
    },
    computed: {
        currentConfig () {
            let config = {
                multiple: false, // 是否多选（不支持cascader）
                defaultExpandLevel: 1, // tree模式下默认展开层级数
                defaultExpandAll: false, // tree模式下默认是否展开全部
                canNotSelectLevel: 0, // tree模式下默认前几级不可选
            };
            return { ...config, ...this.basicConfig };
        },
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
    },
    watch: {
        data: {
            handler (val) {
                this.stateTree = cloneDeep(val);
                this.flatState = this.compileFlatState();
                this.setDefaultExpand(val, this.checkedValues);
            },
            deep: true,
            immediate: true,
        },
    },
    created () {},
    mounted () {
        this.$on('on-checked', this.handleSelect);
        this.$on('toggle-expand', node => this.$emit('on-toggle-expand', node));
    },
    methods: {
        compileFlatState () {
            // 拍平树节点，并标记父子节点
            let that = this;
            let keyCounter = 0;
            let childrenKey = that.currentProps.children;
            let flatTree = [];
            function flattenChildren (node, parent) {
                node.easyNodeKey = keyCounter++;
                flatTree[node.easyNodeKey] = { node, easyNodeKey: node.easyNodeKey };
                if (typeof parent !== 'undefined') {
                    flatTree[node.easyNodeKey].parent = parent.easyNodeKey;
                    flatTree[parent.easyNodeKey][childrenKey].push(node.easyNodeKey);
                }

                if (node[childrenKey]) {
                    flatTree[node.easyNodeKey][childrenKey] = [];
                    node[childrenKey].forEach(child => flattenChildren(child, node));
                }
            }
            that.stateTree.forEach(rootNode => {
                flattenChildren(rootNode);
            });
            return flatTree;
        },
        handleSelect (nodeKey) {
            if (!this.flatState[nodeKey]) return;
            let node = this.flatState[nodeKey].node;
            // let parents = this.getParentsList(this.flatState[nodeKey]); // 获取节点的所以父节点
            this.$emit('change', node);
        },
        setDefaultExpand (array, checkedArray) {
            let that = this;
            let pathList = [];
            function travel (list, level) {
                list.forEach(item => {
                    // 当设置默认展开全部或者处于搜索中时
                    if (that.currentConfig.defaultExpandAll || that.searchValue || level > 0) that.$set(item, 'expand', true);
                    else if (checkedArray.find(checked => checked == item[that.defaultProps.value])) {
                        pathList.forEach(path => that.$set(path, 'expand', true));
                    }
                    if (item[that.currentProps.children] && item[that.currentProps.children].length > 0) {
                        pathList.push(item);
                        travel(item[that.currentProps.children], level - 1);
                    }
                });
            }
            travel(array, that.currentConfig.defaultExpandLevel);
        },
    },
};
</script>
<style lang="scss">
.easy-tree {
    position: relative;

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
        font-size: 12px;

        &.easy-dropdown-menu {
            padding: 0;
        }

        li {
            list-style: none;
            margin: 0;
            padding: 0;
            white-space: nowrap;
            outline: none;
        }
    }

    li {
        ul {
            margin: 0;
            padding: 0 0 0 18px;
        }
    }

    .node-item {
        height: 27px;
        line-height: 27px;
        display: flex;

        &:hover {
            background: #F6F6F6;
        }

        &.is-disabled {
            cursor: not-allowed;

            &:hover {
                background: transparent;
            }

            .easy-tree-label {
                cursor: not-allowed;
                color: rgba(25, 34, 74, .4);
            }
        }
    }

    .easy-tree-label {
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

    .easy-tree-arrow {
        cursor: pointer;
        width: 12px;
        text-align: center;
        display: inline-block;

        i {
            transition: all .2s ease-in;
            transform: scale(.7);
            font-size: 12px;
            color: #C7CCD4;
            display: inline-block;
        }

        &-open {
            i {
                transform: scale(.7) rotate(90deg);
            }
        }
    }

    .is-multiple {
        padding-right: 4px;

        .easy-tree-label {
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
