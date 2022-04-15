<template>
    <!-- 外层 div 用于处理 disabled 的情况 -->
    <div
        class="easy-dropdown"
        :class="{'status-select': visible, 'disabled': disabled}"
    >
        <Dropdown
            :trigger="trigger"
            :placement="placement"
            :transfer="transfer"
            :transfer-class-name="transferClass"
            v-bind="$attrs"
            @on-visible-change="visibleChange"
        >
            <slot>展开/收起</slot>
            <span
                class="iconfont open-menu-icon"
                :class="visible ? 'iconshangsanjiaoxing' : 'iconxiasanjiaoxing'"
            ></span>
            <DropdownMenu
                slot="list"
                @click.native.stop
            >
                <slot name="content"></slot>
            </DropdownMenu>
        </Dropdown>
        <div
            v-if="disabled"
            class="dropdown-mask">
        </div>
    </div>
</template>

<script>

export default {
    props: {
        // 是否禁用组件
        disabled: {
            type: Boolean,
            default: false,
        },
        trigger: {
            type: String,
            default: 'click',
        },
        // 下拉列表位置
        placement: {
            type: String,
            default: 'bottom-start',
        },
        // 是否将下拉列表置于 body 内
        transfer: {
            type: Boolean,
            default: true,
        },
        // 是否阻止冒泡
        stopPropagation: {
            type: Boolean,
            default: false,
        },
        // 开启 transfer 时，给浮层添加额外的 class 名称
        transferClassName: {
            type: String,
            default: '',
        },
    },
    data () {
        return {
            visible: false, // 当前下拉框展示状态
            transferClass: 'easy-dropdown-transfer',
        };
    },
    created () {
        this.transferClassName && (this.transferClass = `${this.transferClass} ${this.transferClassName}`);
    },
    methods: {
        /**
         * @description: 下拉框展开状态切换回调
         */
        visibleChange () {
            this.visible = !this.visible;
        },
    },
};
</script>

<style lang="scss" scoped>
.easy-dropdown {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid rgba(215, 218, 231, 0);
    cursor: pointer;
    width: fit-content;

    &:not(.disabled):hover {
        border: 1px solid rgba(215, 218, 231, 1);
    }

    &:not(.disabled).status-select {
        background-color: #d7dae7;
    }

    &.disabled {
        cursor: not-allowed;
        opacity: .5;

        .dropdown-mask {
            position: absolute;
            width: 100%;
            height: 100%;
        }
    }

    .ivu-dropdown ::v-deep .ivu-dropdown-rel {
        display: flex;
        align-items: center;
        padding: 2px 4px;
        user-select: none;

        .open-menu-icon {
            display: inline-block;
            font-size: 12px;
            color: #bcbcbc;
            transform: scale(.7);
            transform-origin: right;
        }
    }
}
</style>
<style lang="scss">
.ivu-select-dropdown.easy-dropdown-transfer {
    border-radius: 2px;
    padding: 0;

    & > .ivu-dropdown-menu {
        min-width: 40px;
        padding: 12px;
    }
}
</style>
