import { cloneDeep } from 'lodash-es';
export const dragMixins = {
    data () {
        return {
            dragItem: {},
            lastHoverItem: {},
            isDragging: false,
            draggingList: [],
        };
    },
    computed: {
        selectedList () {
            let res = [];
            this.checkedList.forEach(i => {
                let findRes = this.currentDataList.find(item => item[this.currentProps.value] == i);
                if (findRes) res.push(findRes);
            });
            return res;
        },
    },
    mounted () {
        document.addEventListener('mouseup', this.onDragEnd);
    },
    beforeDestroy () {
        document.removeEventListener('mouseup', this.onDragEnd);
    },
    methods: {
        onDragStart (e, index) {
            if (!this.isSorting) return;
            document.onselectstart = function () {
                return false;
            };

            let currentDataList = cloneDeep(this.currentDataList);
            this.dragItem = currentDataList[index];
            this.startIndex = index;
            this.isDragging = true; // 开始拖拽
            let ifSelected = this.toFindIfSelected(this.dragItem);
            if (ifSelected === -1) {
                this.draggingList = [this.dragItem];
                return;
            }
            // 归拢选中项
            this.draggingList = this.selectedList;
            if (this.selectedList.length > 1) {
                if (index > 0) {
                    for (let i = index - 1; i >= 0; i--) {
                        // 从拖拽点开始向上遍历找到第一个未被选中项
                        let notSelectItem = currentDataList[i];
                        let findIndex = this.toFindIfSelected(notSelectItem);
                        if (findIndex === -1) {
                            // 删除已被选择的
                            this.removeSelectedData(this.selectedList, currentDataList);
                            // 在删除了已选中的列表中查找未被选中的元素的下标，然后将selectedList插入
                            let notSelectIndex = currentDataList.findIndex(
                                item => notSelectItem[this.currentProps.value]
                                    == item[this.currentProps.value],
                            );
                            if (notSelectIndex !== -1) currentDataList.splice(
                                notSelectIndex + 1,
                                0,
                                ...this.selectedList,
                            );
                            break;
                        }
                    }
                } else {
                    // 删除已被选择的
                    this.removeSelectedData(this.selectedList, currentDataList);
                    currentDataList.unshift(...this.selectedList);
                }
                this.$nextTick(() => {
                    this.currentDataList = currentDataList;
                });
            }
        },
        onDragEnd () {
            if (!this.isSorting) return;
            this.dragItem = null;
            this.startIndex = -1;
            this.isDragging = false;
            this.draggingList = [];
            document.onselectstart = function () {
                return true;
            };
        },
        onHover (e, index) {
            if (!this.isSorting) return;
            let currentItem = this.currentDataList[index];
            if (this.lastHoverItem[this.currentProps.value] === currentItem[this.currentProps.value]) return;
            else {
                this.lastHoverItem = currentItem;
                this.onDragOver(e, index);
            }
        },
        onDragOver (e, index) {
            if (!this.dragItem) return;
            let currentDataList = cloneDeep(this.currentDataList);
            let hoverItem = currentDataList[index];
            if (this.dragItem[this.currentProps.value] === hoverItem[this.currentProps.value]) return;

            if (this.startIndex < index) {
                // 从上往下拖拽
                let ifSelected = this.toFindIfSelected(this.dragItem);
                if (ifSelected === -1) {
                    // 删除已被选择的
                    this.removeSelectedData([this.dragItem], currentDataList);
                    currentDataList.splice(index, 0, this.dragItem);
                    this.startIndex = index;
                } else {
                    // 先计算拖拽了长度
                    let dragLength = index - this.startIndex;
                    let lastNotSelectIndex = -1;
                    for (let i = 0; i < currentDataList.length; i++) {
                        let ifSelected = this.toFindIfSelected(currentDataList[i]);
                        if (ifSelected === -1) lastNotSelectIndex = i;
                        else break;
                    }
                    // 删除已被选择的
                    this.removeSelectedData(this.selectedList, currentDataList);
                    let replaceIndex = lastNotSelectIndex + dragLength + 1;
                    currentDataList.splice(replaceIndex, 0, ...this.selectedList);
                    this.startIndex = replaceIndex + this.toFindIfSelected(this.dragItem);
                }
            } else if (this.startIndex > index) {
                // 从下往上拖拽
                let ifSelected = this.toFindIfSelected(this.dragItem);
                if (ifSelected === -1) {
                    // 删除已被选择的
                    this.removeSelectedData([this.dragItem], currentDataList);
                    currentDataList.splice(index, 0, this.dragItem);
                    this.startIndex = index;
                } else {
                    // 先计算拖拽了长度
                    let dragLength = this.startIndex - index;
                    let lastNotSelectIndex = -1;
                    for (let i = 0; i < currentDataList.length; i++) {
                        let ifSelected = this.toFindIfSelected(currentDataList[i]);
                        if (ifSelected === -1) lastNotSelectIndex = i;
                        else break;
                    }
                    // 删除已被选择的
                    this.removeSelectedData(this.selectedList, currentDataList);
                    let replaceIndex = lastNotSelectIndex - dragLength + 1;
                    if (replaceIndex < 0) replaceIndex = 0;
                    currentDataList.splice(replaceIndex, 0, ...this.selectedList);
                    this.startIndex = replaceIndex + this.toFindIfSelected(this.dragItem);
                }
            }
            this.$nextTick(() => {
                this.currentDataList = currentDataList;
            });
        },
        toFindIfSelected (item) {
            let findIndex = this.selectedList.findIndex(
                data => data[this.currentProps.value] == item[this.currentProps.value],
            );
            return findIndex;
        },
        toFindIfDragging (item) {
            let findIndex = this.draggingList.findIndex(
                data => data[this.currentProps.value] == item[this.currentProps.value],
            );
            return findIndex > -1;
        },
        // onClick (e, index) {
        //     if (e.button === 0 && e.ctrlKey) {
        //         // 左键 + ctrl
        //         let findIndex = this.toFindIfSelected(this.currentDataList[index]);
        //         if (findIndex > -1) {
        //             this.selectedList.splice(findIndex, 1);
        //         } else this.selectedList.push({ ...this.currentDataList[index], index });
        //     } else {
        //         this.selectedList = [];
        //         this.selectedList.push({ ...this.currentDataList[index], index });
        //     }
        //     this.selectedList.sort((a, b) => a.index - b.index); // 排序
        // },
        removeSelectedData (selectedList, currentDataList) {
            selectedList.forEach(item => {
                let findIndex = currentDataList.findIndex(
                    data => data[this.currentProps.value] == item[this.currentProps.value],
                );
                if (findIndex > -1) currentDataList.splice(findIndex, 1);
            });
        },
    },
};
