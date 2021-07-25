<template>
    <!-- eslint-disable vue/no-mutating-props, vue/this-in-template -->
    <div
        class="el-tree-node"
        @dblclick="dbhandleClick"
        @click.stop="handleClick"
        @contextmenu="($event) => this.handleContextMenu($event)"
        v-show="node.visible"
        :class="{
            'is-expanded': expanded,
            'is-current': node.isCurrent,
            'is-hidden': !node.visible,
            'is-focusable': !node.disabled,
            'is-checked': !node.disabled && node.checked
        }"
        role="treeitem"
        tabindex="-1"
        :aria-expanded="expanded"
        :aria-disabled="node.disabled"
        :aria-checked="node.checked"
        :draggable="tree.draggable"
        @dragstart.stop="handleDragStart"
        @dragover.stop="handleDragOver"
        @dragend.stop="handleDragEnd"
        @drop.stop="handleDrop"
        ref="node"
    >
        <!-- :title="node.label" -->
        <div
            class="el-tree-node__content collectionInfo"
            :title="!node.isLeaf && node.data.rdsName"
            :class="{'select-icon':node.checked && !needTextColor,'selectedTextColor':node.checked && needTextColor,'disabled':treeFatherDisabledStyle&&!node.isLeaf || disabledLevels.indexOf(node.level) > -1 || node.disabled,'isFolder':!node.isLeaf}"
            style="position: relative;"
            :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px'}"
            @mouseenter="mouseenter(node.data)"
            @mouseleave="mouseleave(node.data)"
            :id="node.data.id"
        >
            <el-tooltip
                v-if="showItemTip && node.isLeaf"
                :manual="true"
                :value="node.data.tip"
                :content="node.data.label"
                placement="top"
            >
                <div style="position: absolute; width: 100%; height: 0; top: 0; left: 0; overflow: hidden;">{{ node.data.tip }}</div>
            </el-tooltip>
            <i
                v-if="node.data.readOnly && detailKey == 'localUpload'"
                class="iconfont is-readOnly iconjinyongtubiao"
            ></i>
            <span
                v-if="showCarpetBtn"
                @click.stop="handleExpandIconClick"
                :class="[
                    { 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded },
                    'el-tree-node__expand-icon',
                    tree.iconClass ? tree.iconClass : 'el-icon-caret-right'
                ]"
            >
            </span>
            <el-checkbox
                v-if="showCheckbox"
                v-model="node.checked"
                :indeterminate="node.indeterminate"
                :disabled="!!node.disabled"
                @click.native.stop
                @change="handleCheckChange"
            >
            </el-checkbox>
            <span
                v-if="node.loading"
                class="el-tree-node__loading-icon el-icon-loading"
            >
            </span>
            <span
                v-if="node.data.updateState"
                class="dot-tip"
                :style="{'background': node.data.updateState == 'updating' ? '' : updateStateObj[node.data.updateState].color, 'border': node.data.updateState == 'updating' ? '1px solid '+updateStateObj[node.data.updateState].color : ''}"
            ></span>
            <span
                v-else
                style="margin-right: 4px;"
            ></span>
            <node-content
                :node="node"
                :style="{'color': (node.data.status == 'DELETE' || node.data.status == 'DISBANDED' || node.data.status == 1) ? '#CCCCCC' : ''}"
            ></node-content>
            <i
                v-if="node.data.isShowLock"
                class="iconfont iconsuoding icon-locked others-locked"
            ></i>
            <el-tooltip
                width="230"
                :transition="'no-transition'"
                :visible-arrow="false"
                popper-class="collectionInfoTip"
                v-if="DATA_MAP_LINKAGE == '1' && (!node.data.folder && showCollectionInfo)"
                placement="right-start"
            >
                <!-- v-if="node.data.updateState"  -->
                <span
                    class="iconfont opdateTipShow"
                    :class="tipStateList[node.data.updateState] || tipStateList.empty"
                    :style="{'left':offsetLeft+nodeIconLeft+'px','color':updateStateObj[node.data.updateState || 'empty'].color,'font-size':'13px','background-color':$route.name !== 'dashboard' && $route.name !== 'selfSupportTemplete' && $route.name !== 'spreadExcel' && $route.name !== 'customeInterfaceTemplete' ? '#F5F7FA' : (node.checked && needTextColor ? '#4084FF' : '#313B55')}"
                >
                </span>
                <div slot="content">
                    <div
                        class="tool-tips-easy-node-select scrollbar"
                        v-if="node.data"
                        style="max-height: 186px; word-break: break-all; overflow: overlay;"
                    >
                        <!-- <p>{{updateStateObj[node.data.updateState].label}}：</p> -->
                        <div
                            v-if="node.data.updateState"
                            style="margin-bottom: 8px;"
                            class="base-font scene-2"
                        >
                            <span
                                class="iconfont"
                                :class="tipStateList[node.data.updateState] || tipStateList.empty"
                                style="margin-right: 4px;"
                                :style="{'color':updateStateObj[node.data.updateState || 'empty'].color,'font-size':'12px'}"
                            >
                            </span>{{ node.data.updateState && updateStateObj[node.data.updateState].label }}
                        </div>
                        <div
                            class="base-font scene-2"
                            v-if="node.data.updateState"
                        >
                            <p :class="node.data.updateState == 'updating' || node.data.updateState == 'warning' ? 'margin-b-4' : 'margin-b-8'">最近更新时间：{{ node.data.actualTime || '暂无' }}</p>
                            <p
                                class="margin-b-8"
                                v-if="node.data.updateState == 'updating' || node.data.updateState == 'warning'"
                            >预计更新时间：{{ node.data.predictTime || '暂无' }}</p>
                            <p class="margin-b-8">更新频率：{{ node.data.updateFrequency || '暂无' }}</p>
                        </div>
                        <span
                            class="tipLine margin-b-8"
                            v-if="node.data.updateState"
                        ></span>
                        <div class="base-font scene-3">
                            <p :class="{'margin-b-4':node.data.updateState}">时间范围：{{ node.data.timeRange || '暂无' }}</p>
                            <p v-if="node.data.updateState">备注描述：{{ node.data.collectionDesc || '暂无' }}</p>
                        </div>
                    </div>
                </div>
            </el-tooltip>
        </div>
        <el-collapse-transition>
            <div
                class="el-tree-node__children"
                v-if="!renderAfterExpand || childNodeRendered"
                v-show="expanded"
                role="group"
                :aria-expanded="expanded"
            >
                <el-tree-node
                    :show-item-tip="showItemTip"
                    :render-content="renderContent"
                    :is-db-for-table-join="isDbForTableJoin"
                    v-for="child in node.childNodes"
                    :render-after-expand="renderAfterExpand"
                    :show-checkbox="showCheckbox"
                    :key="getNodeKey(child)"
                    :need-text-color="needTextColor"
                    :show-collection-info="showCollectionInfo"
                    :offset="offset"
                    :show-carpet-btn="showCarpetBtn"
                    :tree-father-disabled-style="treeFatherDisabledStyle"
                    :node="child"
                    :detail-key="detailKey"
                    :disabled-levels="disabledLevels"
                    @node-expand="handleChildNodeExpand"
                >
                </el-tree-node>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script type="text/jsx">
/* eslint-disable no-eval, vue/require-default-prop, vue/require-prop-types */
import ElCollapseTransition from 'element-ui/src/transitions/collapse-transition';
import ElCheckbox from 'element-ui/packages/checkbox';
import emitter from 'element-ui/src/mixins/emitter';
import { getNodeKey } from './model/util';
import Bus from '@/assets/js/event/paintBus.js';
import { dataMapLinkage } from '@/mixins';
export default {
    name: 'ElTreeNode',

    componentName: 'ElTreeNode',
    components: {
        ElCollapseTransition,
        ElCheckbox,
        NodeContent: {
            props: {
                node: {
                    required: true,
                },
            },
            render (h) {
                const parent = this.$parent;
                const tree = parent.tree;
                const node = this.node;
                const { data, store } = node;
                let keyValueCopy;
                if (!parent.renderContent && !tree.$scopedSlots.default && store.filterValue) {
                    keyValueCopy = store.filterValue;
                    // 一些特殊符号，需要进行转义，如| 要转成\|
                    keyValueCopy = keyValueCopy.replace(/\\/g, '\\\\').replace(/\//g, '\\/')
                        .replace(/\(/g, '\\(')
                        .replace(/\)/g, '\\)')
                        .replace(/(\||\^|\$|\*|\+|\?)/g, $ => `\\${$}`);
                }
                /* eslint-disable vue/script-indent */
                return parent.renderContent
                    ? (
                        parent.renderContent.call(parent._renderProxy, h, {
                            _self: tree.$vnode.context,
                            node,
                            data,
                            store,
                        })
                    )
                    : tree.$scopedSlots.default
                        ? (
                            tree.$scopedSlots.default({ node, data })
                        )
                        : store.filterValue
                            ? (
                                <span
                                    class="el-tree-node__label"
                                    domPropsInnerHTML={node.label.replace(
                                        eval(`/${keyValueCopy}/g`),
                                        `<span class='searchkey-color'>${store.filterValue}</span> `,
                                    )}
                                ></span>
                            )
                            : (
                                <span class="el-tree-node__label">{node.label}</span>
                            );
                /* eslint-enable vue/script-indent */
            },
        },
    },
    mixins: [emitter, dataMapLinkage],

    props: {
        showItemTip: {
            type: Boolean,
            default: false,
        },
        node: {
            default () {
                return {};
            },
        },
        showCollectionInfo: {
            type: Boolean,
            default: false,
        },
        offset: {
            default: () => {},
        },
        showTip: {
            type: Boolean,
            default: false,
        },
        store: {
            type: Object,
            default: null,
        },
        props: {},
        renderContent: Function,
        renderAfterExpand: {
            type: Boolean,
            default: true,
        },
        showCheckbox: {
            type: Boolean,
            default: false,
        },
        showCarpetBtn: {
            type: Boolean,
            default: true,
        },
        treeFatherDisabledStyle: {
            type: Boolean,
            default: false,
        },
        disabledLevels: {
            type: Array,
            default: () => [],
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
        needTextColor: {
            type: Boolean,
            default: false,
        },
    },

    data () {
        return {
            timer: null,
            tree: null,
            expanded: false,
            childNodeRendered: false,
            oldChecked: null,
            oldIndeterminate: null,
            timeout: null,
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
            offsetLeft: 0,
            nodeIconLeft: 352,
        };
    },

    watch: {
        'node.indeterminate' (val) {
            this.handleSelectChange(this.node.checked, val);
        },

        'node.checked' (val) {
            this.handleSelectChange(val, this.node.indeterminate);
        },

        'node.expanded' (val) {
            this.$nextTick(() => (this.expanded = val));
            if (val) {
                this.childNodeRendered = true;
            }
        },
    },
    mounted () {
        // console.log(this.offsetObj.scrollLeft,'')
        let _this = this;
        setTimeout(() => {
            Bus.$on('event-cancelDel', dbInfo => {
                if (_this.isDbForTableJoin) {
                    if (dbInfo.newRdsId == _this.node.parent.data.rdsId
                        && dbInfo.newDbId == _this.node.data.dbId) {
                        _this.node.checked = false;
                    }
                }
            });
        }, 1000);
    },

    created () {
        const parent = this.$parent;

        if (parent.isTree) {
            this.tree = parent;
        } else {
            this.tree = parent.tree;
        }

        const tree = this.tree;
        if (!tree) {
            console.warn("Can not find node's tree."); //eslint-disable-line
        }

        const props = tree.props || {};
        const childrenKey = props.children || 'children';

        this.$watch(`node.data.${childrenKey}`, () => {
            this.node.updateChildren();
        });

        if (this.node.expanded) {
            this.expanded = true;
            this.childNodeRendered = true;
        }

        if (this.tree.accordion) {
            this.$on('tree-node-expand', node => {
                if (this.node !== node) {
                    this.node.collapse();
                }
            });
        }
    },
    methods: {
        mouseenter (data) {
            data.label && (this.timer = setTimeout(() => {
                data.tip = true;
                this.$forceUpdate();
            }, 2000));

            this.offsetLeft = (this.offset && this.offset.parentElement.scrollLeft) || 0;
        },
        mouseleave (data) {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            data.tip = false;
            this.$forceUpdate();
        },
        filterShowName (val, keyValue) {
            if (!keyValue) {
                return val;
            }
            return val.replace(
                eval(`/${keyValue}/g`),
                `<span class='searchkey-color'>${keyValue}</span>`,
            );
        },

        getNodeKey (node) {
            return getNodeKey(this.tree.nodeKey, node.data);
        },

        handleSelectChange (checked, indeterminate) {
            if (
                this.oldChecked !== checked
                && this.oldIndeterminate !== indeterminate
            ) {
                this.tree.$emit('check-change', this.node.data, checked, indeterminate);
            }
            this.oldChecked = checked;
            this.indeterminate = indeterminate;
        },
        dbhandleClick () {
            clearTimeout(this.timeout);
        },
        setNodeByClick () {
            if (this.node.data.disabled) {
                return;
            }
            if (this.disabledLevels.indexOf(this.node.level) == -1) {
                const store = this.tree.store;
                store.setCurrentNode(this.node);
                this.tree.$emit(
                    'current-change',
                    store.currentNode ? store.currentNode.data : null,
                    store.currentNode,
                );
                this.tree.currentNode = this;
                if (this.tree.expandOnClickNode) {
                    this.handleExpandIconClick();
                }
                if (this.tree.checkOnClickNode && !this.node.disabled) {
                    this.handleCheckChange(null, {
                        target: { checked: !this.node.checked },
                    });
                }
                this.tree.$emit('node-click', this.node.data, this.node, this);
            }
        },
        handleClick () {
            let _this = this;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                console.log('获取isDbForTableJoin', _this.isDbForTableJoin); //eslint-disable-line
                _this.setNodeByClick();
            }, 500);
        },

        handleContextMenu (event) {
            if (
                this.tree._events['node-contextmenu']
                && this.tree._events['node-contextmenu'].length > 0
            ) {
                event.stopPropagation();
                event.preventDefault();
            }
            this.tree.$emit(
                'node-contextmenu',
                event,
                this.node.data,
                this.node,
                this,
            );
        },

        handleExpandIconClick () {
            if (this.node.isLeaf) return;
            if (this.expanded) {
                this.tree.$emit('node-collapse', this.node.data, this.node, this);
                this.node.collapse();
            } else {
                this.node.expand();
                this.$emit('node-expand', this.node.data, this.node, this);
            }
        },

        handleCheckChange (value, ev) {
            this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
            this.$nextTick(() => {
                const store = this.tree.store;
                this.tree.$emit('check', this.node.data, {
                    checkedNodes: store.getCheckedNodes(),
                    checkedKeys: store.getCheckedKeys(),
                    halfCheckedNodes: store.getHalfCheckedNodes(),
                    halfCheckedKeys: store.getHalfCheckedKeys(),
                });
            });
        },

        handleChildNodeExpand (nodeData, node, instance) {
            this.broadcast('ElTreeNode', 'tree-node-expand', node);
            this.tree.$emit('node-expand', nodeData, node, instance);
        },

        handleDragStart (event) {
            if (!this.tree.draggable) return;
            this.tree.$emit('tree-node-drag-start', event, this);
        },

        handleDragOver (event) {
            if (!this.tree.draggable) return;
            this.tree.$emit('tree-node-drag-over', event, this);
            event.preventDefault();
        },

        handleDrop (event) {
            event.preventDefault();
        },

        handleDragEnd (event) {
            if (!this.tree.draggable) return;
            this.tree.$emit('tree-node-drag-end', event, this);
        },
        mouseoverNode (node, type) {
            if (!node.data.updateState) return;
            let target = document.getElementById(`${node.data.id}`);
            let siteObj = target.getBoundingClientRect();
            Bus.$emit('update-currentHoverTreeContent', node, siteObj, type);
        },
    },
};
</script>
<style lang="scss">
/* stylelint-disable font-family-no-missing-generic-family-keyword */
.collectionInfoTip {
    .tool-tips-easy-node-select {
        max-width: 230px;
    }

    &:hover {
        padding-right: 0;

        .tool-tips-easy-node-select {
            max-width: 240px;
            padding-right: 12px;
        }
    }
}
</style>
<style   scoped lang="scss">
.selectedTextColor {
    color: #447ee7;
}

.opdateTipShow {
    position: absolute;
    display: inline-block;
    height: 22px;
    width: 28px;
    line-height: 20px;
    text-align: center;
    top: 3px;
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

.select-icon::after {
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
    top: 2px;
    right: 8px;
}

.el-tree-node__content.disabled {
    color: #999;
    cursor: not-allowed;
}

.tipLine {
    display: inline-block;
    height: 1px;
    width: 100%;
    border: 1px solid rgba(255, 255, 255, .12);
}

.el-tree-node__content {
    &:hover {
        .opdateTipShow {
            opacity: 1;
            // display: inline-block;
            // width: 20px;
            // height: 26px;
            // line-height: 26px;
            // padding-left: 5px;
            // background: #3a455c;
        }
    }
}

.el-tree-node {
    .is-readOnly {
        font-size: 10px;
        position: absolute;
        left: 18px;
        color: #c0c4cc;
        transform: scale(.9);
    }

    .dot-tip {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 4px;
    }
}
</style>
