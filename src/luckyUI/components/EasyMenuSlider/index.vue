<template>
    <div class="easy-menu-slider">
        <div
            v-show="showSlider"
            class="easy-menu-slider-button easy-menu-slider-prev-button"
            :class="{ 'easy-menu-slider-button-disable': status === 'left' }"
            @click="clickPrev"
        >
            <slot name="prev">
                <Icon
                    class="easy-menu-slider-button-icon"
                    type="md-arrow-dropleft"
                    size="14"
                    color="#262B39"
                />
            </slot>
        </div>
        <div
            ref="container"
            class="easy-menu-slider-container"
            :style="{margin: showSlider ? '0 4px': '0 16px'}"
        >
            <div
                ref="content"
                class="easy-menu-slider-content"
            >
                <slot></slot>
            </div>
        </div>
        <div
            v-show="showSlider"
            class="easy-menu-slider-button easy-menu-slider-next-button"
            :class="{ 'easy-menu-slider-button-disable': status === 'right' }"
            @click="clickNext"
        >
            <slot name="next">
                <Icon
                    class="easy-menu-slider-button-icon"
                    type="md-arrow-dropright"
                    size="14"
                    color="#262B39"
                />
            </slot>
        </div>
    </div>
</template>

<script>
import { debounce } from 'lodash-es';
import Vue from 'vue';

export default {
    props: {
        isDebounce: {
            type: Boolean,
            default: true,
        },
        debounceTime: {
            type: Number,
            default: 50,
        },
        observeTarget: {
            type: HTMLElement,
            default: null,
        },
    },
    data () {
        return {
            showSlider: false, // 是否显示翻页按钮
            status: 'left', // 当前滚动状态
            finalObserveTarget: null, // 最终的观察对象
        };
    },
    created () {
        !Vue.leqeeuiWeakmap && (Vue.leqeeuiWeakmap = new WeakMap());
    },
    mounted () {
        this.finalObserveTarget = this.observeTarget || this.$refs.container;
        if (!Vue.leqeeuiWeakmap.has(this.finalObserveTarget)) {
            let cb = () => {
                Vue.leqeeuiWeakmap.get(this.finalObserveTarget).eventCenter.forEach(fn => {
                    fn();
                });
            };
            let debouncecb = this.isDebounce ? debounce(cb, this.debounceTime) : cb;
            let observer = new ResizeObserver(debouncecb);
            Vue.leqeeuiWeakmap.set(this.finalObserveTarget, {
                observer,
                eventCenter: [],
            });
            observer.observe(this.finalObserveTarget);
        }
        Vue.leqeeuiWeakmap.get(this.finalObserveTarget).eventCenter.push(this.reset);
        Vue.leqeeuiWeakmap.get(this.finalObserveTarget).observer.observe(this.$refs.content);
    },
    beforeDestroy () {
        Vue.leqeeuiWeakmap.get(this.finalObserveTarget).observer.unobserve(this.$refs.content);
        let eventCenter = Vue.leqeeuiWeakmap.get(this.finalObserveTarget).eventCenter;
        let index = eventCenter.findIndex(fun => fun === this.reset);
        index > -1 && eventCenter.splice(index, 1);
        if (!eventCenter.length) {
            Vue.leqeeuiWeakmap.get(this.finalObserveTarget).observer.unobserve(this.finalObserveTarget);
            Vue.leqeeuiWeakmap.delete(this.finalObserveTarget);
        }
    },
    methods: {
        /**
         * @description: 重置滚动状态
         */
        reset () {
            if (this.$refs.content.clientWidth > this.$refs.container.clientWidth) {
                this.showSlider = true;
                this.status === 'right' && this.clickNext();
            } else {
                this.showSlider = false;
                this.clickPrev();
            }
        },
        /**
         * @description: 点击 prev 后的回调
         */
        clickPrev () {
            this.status = 'left';
            this.$refs.content.style.left = '0';
        },
        /**
         * @description: 点击 next 后的回调
         */
        clickNext () {
            this.status = 'right';
            let left = this.$refs.container.clientWidth - this.$refs.content.clientWidth;
            this.$refs.content.style.left = `${left}px`;
        },
    },
};
</script>

<style lang="scss" scoped>
.easy-menu-slider {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;

    .easy-menu-slider-container {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        flex-grow: 1;

        .easy-menu-slider-content {
            position: absolute;
            height: 100%;
            left: 0;
            transition: left .2s ease;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
        }
    }

    .easy-menu-slider-button {
        width: 12px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background-color: #f6f7f9;
    }

    .easy-menu-slider-button-disable {
        cursor: not-allowed;

        .easy-menu-slider-button-icon {
            color: #b6b9be !important;
        }
    }
}
</style>
