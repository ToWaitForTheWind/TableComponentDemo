<template>
    <div
        :ref="`listContainer${randomNum}`"
        class="lq-virtual-list-dynamic"
        :class="{ 'use-virtual-scroll': useVirtualScroll }"
        :style="virtualBoxStyle"
    >
        <div
            v-if="useVirtualScroll"
            class="scroll-blank"
            :style="`height: ${listBoxHeight}px;`"
        ></div>
        <section
            v-if="useVirtualScroll"
            style="pointer-events: none; position: absolute; top: 0; z-index: -99; opacity: 0;"
            ref="outNodeToDelete"
        ></section>
        <div
            class="scroll-data"
            :style="scrollDataStyle"
        >
            <div
                v-for="(item, index) in useVirtualScroll ? activeList : dataList"
                ref="lqDynamicItem"
                :data-realindex="(startNum - preRenderCount < 0 ? 0 : startNum - preRenderCount) + index"
                :key="keyProps ? item[keyProps] : index"
                class="scroll-item"
                :style="`height: ${isDynamic ? 'auto' : itemHeight}px;`"
            >
                <slot
                    name="listItem"
                    :listItem="item"
                    :listIndex="(startNum - preRenderCount < 0 ? 0 : startNum - preRenderCount) + index"
                ></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        isDynamic: { type: Boolean, default: false }, // 是否动态高度
        showNumber: { type: Number, default: 8 }, // 当前视窗展示条数
        itemHeight: { type: Number, default: 20 }, // 每一条内容的高度
        dataList: { type: Array, default: () => [] },
        useVirtualScroll: { type: Boolean, default: false },
        preRenderCount: { type: Number, default: 0 }, // 预加载条数
        keyProps: { type: String, default: '' }, // list数据唯一标识的key值
    },
    data () {
        return {
            startNum: 0, // 当前视窗范围内第一个元素下标
            positionTop: 0, // 当前视窗范围内第一个元素偏移量
            randomNum: '', // 一个随机数
            dynamicListHeight: 0, // 动态时的盒子高度
            wheelDiffTime: 0, // 滚动间隔时间
        };
    },
    computed: {
        // 虚拟滚动状态下用于渲染当前的list
        activeList () {
            // 展示的列表
            let start = this.startNum - this.preRenderCount < 0 ? 0 : this.startNum - this.preRenderCount;
            return this.dataList.slice(start, this.startNum + this.showNumber + this.preRenderCount);
        },
        // 不定高虚拟滚动内容的实际高度
        listBoxHeight () {
            let res = 0;
            if (!this.isDynamic) res = this.dataList.length * this.itemHeight;
            else res = this.dynamicListHeight;
            return res;
        },
        // 外层盒子高度样式
        virtualBoxStyle () {
            let actualHeight = this.dataList.length * this.itemHeight;
            let maxHeight = this.showNumber * this.itemHeight;
            return `height: ${actualHeight < maxHeight ? actualHeight : maxHeight}px`;
        },
        // 偏移量计算
        scrollDataStyle () {
            let res = '';
            if (this.useVirtualScroll) res += `transform: translateY(${this.positionTop}px);`;
            return res;
        },
    },
    watch: {
        dataList: {
            handler () {
                // 一旦传入的数据发生变化就初始化一下
                this.toReset();
                if (this.isDynamic) this.toInitPositions();
            },
            deep: true,
            immediate: true,
        },
    },
    created () {
        this.preScrollTop = 0;
        this.preStartIndex = null;
        this.randomNum = Math.random();
    },
    mounted () {
        this.updateItemsSize();
        this.toSetObserve();
        this.scrollIo = null;
        this.lastWheelTime = Date.now();
        if (this.keyProps) this.$refs[`listContainer${this.randomNum}`].addEventListener('wheel', this.wheelEvent); // 有唯一key的时候才进行处理
    },
    updated () {
        this.$nextTick(() => {
            this.updateItemsSize();
        });
    },
    beforeDestroyed () {
        this.$el.onscroll = null;
        // this.io.unobserve(this.$el);
        // this.io.disconnect();
        this.$refs[`listContainer${this.randomNum}`].removeEventListener('wheel');
    },
    methods: {
        // 初始化各节点位置信息
        toInitPositions () {
            this.positions = this.dataList.map((item, index) => ({
                height: this.itemHeight,
                top: index * this.itemHeight,
                bottom: (index + 1) * this.itemHeight,
            }));
            if (this.positions.length) {
                this.dynamicListHeight = this.positions[this.positions.length - 1].bottom;
            }
        },
        // 设置滚动监听
        toSetObserve () {
            if (!this.useVirtualScroll) return;
            this.$el.onscroll = e => {
                let scrollTop = e.target.scrollTop;
                let positionTop = 0;
                if (!this.isDynamic) {
                    this.startNum = Math.floor(scrollTop / this.itemHeight);
                    let min = Math.min(this.startNum, this.preRenderCount);
                    positionTop = scrollTop - (scrollTop % this.itemHeight) - min * this.itemHeight;
                } else {
                    this.startNum = this.getDynamicStartIndex(scrollTop, this.preScrollTop < scrollTop);
                    let start = this.startNum - this.preRenderCount > 0 ? this.startNum - this.preRenderCount : 0;
                    if (this.positions.length) positionTop = start > 0 ? this.positions[start - 1].bottom : 0;
                    this.preScrollTop = scrollTop;
                }
                this.positionTop = positionTop;
            };
            // this.io = new IntersectionObserver(e => {
            //     if (e[0].intersectionRatio === 0) {
            //         this.toReset();
            //     }
            // });
            // this.io.observe(this.$el);
        },
        // 更新节点实际高度、位置信息
        updateItemsSize () {
            if (!this.isDynamic) return;
            let nodes = this.$refs.lqDynamicItem;
            if (!nodes?.length) return;
            let diffSum = 0;
            nodes.forEach(node => {
                let { height } = node.getBoundingClientRect();
                let index = Number(node.dataset?.realindex);
                let diffHeight = height - this.positions[index].height;
                diffSum += diffHeight;
                // 存在差值
                this.positions[index].height = height;
                this.positions[index].bottom = this.positions[index].top + height;
                if (index > 0) {
                    this.positions[index].top = this.positions[index - 1].bottom;
                    this.positions[index].bottom = this.positions[index].top + height;
                }
            });
            let index = Number(nodes[nodes.length - 1].dataset?.realindex);
            for (let k = index + 1; k < this.positions.length; k++) {
                this.positions[k].top += diffSum;
                this.positions[k].bottom += diffSum;
            }
            this.dynamicListHeight = this.positions[this.positions.length - 1].bottom;
        },
        // 获取第一个节点index
        getDynamicStartIndex (scrollTop = 0, isScrollDown) {
            let start;
            let end;
            if (isScrollDown) {
                start = this.preStartIndex;
                end = this.positions.length - 1;
            } else {
                start = 0;
                end = this.preStartIndex + Math.min(this.showNumber, this.positions.length - 1);
            }
            let tempIndex = null;
            while (start <= end) {
                let midIndex = parseInt((start + end) / 2);
                let midValue = this.positions[midIndex].bottom;
                if (midValue === scrollTop) {
                    this.preStartIndex = midIndex + 1;
                    return midIndex + 1;
                } else if (midValue < scrollTop) {
                    start = midIndex + 1;
                } else if (midValue > scrollTop) {
                    if (tempIndex === null || tempIndex > midIndex) {
                        tempIndex = midIndex;
                    }
                    end = end - 1;
                }
            }
            this.preStartIndex = tempIndex;
            return tempIndex;
        },
        // 重置
        toReset () {
            this.positionTop = 0;
            this.startNum = 0;
            if (this.$el) this.$el.scrollTop = 0;
            let deleteDom = this.$refs.outNodeToDelete;
            while (deleteDom && deleteDom.hasChildNodes()) {
                // 当div下还存在子节点时 循环继续
                deleteDom.removeChild(deleteDom.firstChild);
            }
        },
        // 设置滚轮事件
        wheelEvent (e) {
            this.wheelDiffTime = Date.now() - this.lastWheelTime;
            this.lastWheelTime = Date.now();
            if (this.wheelDiffTime > 1000) {
                let deleteDom = this.$refs.outNodeToDelete;
                while (deleteDom.hasChildNodes()) {
                    // 当div下还存在子节点时 循环继续
                    deleteDom.removeChild(deleteDom.firstChild);
                }
            }
            let eventPath = e.path;
            let findRes = eventPath.find(dom => dom.className === 'scroll-item');
            if (findRes) {
                let cloneDom = findRes.cloneNode(true);
                this.scrollIo = new IntersectionObserver(entries => {
                    if (!entries[0].isIntersecting) {
                        if (findRes.dataset?.realindex && this.lastNodeId != findRes.dataset?.realindex) {
                            this.$refs.outNodeToDelete.appendChild(e.target); // 把当前事件的dom进行缓存
                            entries[0].target.innerHTML = cloneDom.innerHTML; // 由于该dom被缓存，为了防止dom缺失，需要重新添加一份clone的
                            this.lastNodeId = entries[0].target.dataset?.realindex;
                        }
                    }
                }, {
                    root: this.$el,
                });
                this.scrollIo.observe(findRes);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.lq-virtual-list-dynamic {
    display: flex;

    &.use-virtual-scroll {
        overflow-y: auto;
        position: relative;
    }

    .scroll-blank {
        opacity: 0;
    }

    .scroll-data {
        // position: absolute;
        width: 100%;
    }
}
</style>
