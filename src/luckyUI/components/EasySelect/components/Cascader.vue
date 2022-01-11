<template>
    <div class="easy-cascader">
        <CascaderPanel
            :list="data"
            :all-data="data"
            :search-value="searchValue"
            :checked-datas="checkedDatas"
            :checked-values="checkedValues"
            :parent-nodes="parentNodes"
            :level="0"
            :visible="visible"
            @toEmitChecked="toEmitChecked"
            @changePathInfo="changePathInfo"
        ></CascaderPanel>
    </div>
</template>

<script>
import CascaderPanel from './CascaderPanel';
import { cloneDeep } from 'lodash-es';
export default {
    components: { CascaderPanel },
    inject: ['currentConfig', 'currentProps', 'toGetNodeParents'],
    props: {
        data: { type: Array, default: () => [] },
        checkedValues: { type: Array, default: () => [] }, // 当前选中项
        checkedDatas: { type: Array, default: () => [] }, // 当前选中项详细
        searchValue: { type: String, default: '' }, // 筛选字段
        visible: { type: Boolean, default: false }, // 下拉是否展开
    },
    data () {
        return {
            parentNodes: [],
            nodePath: [],
        };
    },
    computed: {},
    watch: {
        checkedValues: {
            handler (values) {
                if (!values.length) {
                    this.parentNodes = [];
                } else if (this.currentConfig.useValuePath) {
                    this.parentNodes = this.checkedDatas;
                } else {
                    let parentNodes = this.toGetNodeParents(values[0], this.data);
                    this.parentNodes = [...parentNodes, this.checkedDatas[0]];
                }
            },
            deep: true,
            immediate: true,
        },
    },
    created () {},
    mounted () {},
    methods: {
        toEmitChecked (item, level) {
            this.nodePath[level] = item;
            this.nodePath.splice(level + 1);
            if (this.currentConfig.useValuePath) this.$emit('change', this.nodePath);
            else this.$emit('change', cloneDeep(item));
        },
        changePathInfo (item, level) {
            this.nodePath[level] = item;
            this.nodePath.splice(level + 1);
        },
    },
};
</script>
