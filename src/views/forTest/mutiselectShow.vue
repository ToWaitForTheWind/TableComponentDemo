<template>
    <div
        :id="dragId"
        class="selectedArea mutiselectScrollbar"
        :style="{'width':'calc('+innerWidth+' - 26px)','max-height':'78px'}"
    >
        <span
            v-for="(item,index) in showData"
            :key="index"
            class="selectedItem"
            :style="{'height':itemHeight-10 +'px','min-height': '22px'}"
        >
            <Tooltip
                :content="item[keyValue.value]"
                placement="top"
                transfer
                :style="{'height':itemHeight-13 +'px','min-height': '18px','overflow':'hidden'}"
            >
                <span
                    class="selectedText"
                    :style="{'max-width':'48px'}"
                >{{ item[keyValue.value] }}</span>
            </Tooltip>
            <i
                class="clearIcon iconfont iconguanbi"
                style="font-size: 12px;"
                @click.stop="cancelSelect(item[keyValue.key],item)"
            ></i>
        </span>
    </div>
</template>

<script>
export default {
    props: {
        selectData: {
            type: Array,
            default: () => [],
        },
        innerWidth: {
            type: String,
            default () {
                return '250px';
            },
        },
        inputHeight: {
            type: Number,
            default () {
                return 32;
            },
        },
        itemHeight: {
            type: Number,
            default () {
                return 32;
            },
        },
        listArray: {
            type: Array,
            default: () => [],
        },
        keyValue: {
            type: Object,
            default: () => ({}),
        },
        isTree: {
            type: Boolean,
            default: () => false,
        },
        dragId: {
            type: String,
            default () {
                return '';
            },
        },
    },
    data () {
        return {
            showData: [],
            timeout: null,
        };
    },
    watch: {
        selectData () {
            this.getKeyValue();
        },
        showData () {
            this.$nextTick(() => {
                let dragIdEle = this.$el;
                if (dragIdEle) {
                    this.$emit('dragy', dragIdEle.offsetHeight + 6);
                }
            });
            /*
             * setTimeout(() => {
             *     // let dragIdEle = document.getElementById(this.dragId);
             *     let dragIdEle = this.$el;
             *     if (dragIdEle) {
             *         this.$emit('dragy', dragIdEle.offsetHeight + 10);
             *     }
             * }, 0);
             */
        },
    },
    mounted () {
        this.getKeyValue();
        this.timeout = setInterval(() => {
            if (this.showData.length) {
                // let dragIdEle = document.getElementById(this.dragId);
                let dragIdEle = this.$el;
                if (dragIdEle && dragIdEle.offsetHeight) {
                    this.$emit('dragy', dragIdEle.offsetHeight + 6);
                    clearInterval(this.timeout);
                }
            } else {
                clearInterval(this.timeout);
            }
        }, 100);
    },
    destroyed () {
        this.$emit('dragy', 20);
        clearInterval(this.timeout);
    },
    methods: {
        cancelSelect (item, nodeData) {
            this.$emit('cancelSelect', item, nodeData);
        },
        getKeyValue () {
            this.showData = [];
            if (this.isTree) {
                this.selectData.forEach(() => {
                    this.showData = this.selectData;
                });
            } else {
                if (this.listArray.length) {
                    this.selectData.forEach(item => {
                        let datas = this.listArray.find(ele => item == ele[this.keyValue.key]);
                        datas && this.showData.push(datas);
                    });
                    /*
                     * this.listArray.forEach(item => {
                     *     if (this.selectData.indexOf(item[this.keyValue.key]) != -1) {
                     *          this.showData.push(item);
                     *     }
                     * });
                     */
                } else {
                    this.showData = this.selectData.reduce((arr, item) => {
                        let obj = {};
                        obj[this.keyValue.key] = item;
                        arr.push(obj);
                        return arr;
                    }, []);
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.selectedArea {
    // padding-right: 30px;
    margin: 4 0;
    overflow: overlay;

    .selectedItem {
        padding: 0 5px 0 7px;
        width: fit-content;
        line-height: 21px;
        border-radius: 2px;
        float: left;
        margin-right: 4px;
        margin-bottom: 2px;
        margin-top: 2px;
        display: flex;
        align-items: center;
        background-color: rgba(247, 247, 247, 1);
        border: 1px solid rgba(217, 217, 217, 1);

        &:hover {
            background-color: rgba(68, 126, 231, .1);
            border: 1px solid rgba(68, 126, 231, 1);
            color: #447ee7;
        }

        .selectedText {
            display: inline-block;
            margin-right: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .clearIcon {
            cursor: pointer;
        }
    }
}

.mutiselectScrollbar {
    // &:focus-within{
    //     &::-webkit-scrollbar{
    //         width: 10px;
    //     }
    // }

    &::-webkit-scrollbar {
        width: 0;
        height: 0;
    }

    &:hover::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }
}
</style>
