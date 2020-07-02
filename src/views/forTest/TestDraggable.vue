<template>
  <div class="test_draggable">
    <VueDraggable class="left" tag="div" v-model="sourceList" group="lucky" ghost-class="ghost" :move="onMove">
      <transition-group tag="div" class="source_group" :name="'source_group'">
        <div v-for="item in sourceList" :key="item.order" class="item">{{ `${item.order}_${item.name}` }}</div>
      </transition-group>
    </VueDraggable>
    <VueDraggable class="right" v-model="targetList" group="lucky" ghost-class="ghost" :move="onMove">
      <transition-group tag="div" class="target_group" :name="'target_group'">
        <div v-for="item in targetList" :key="item.order" class="item">{{ `${item.order}_${item.name}` }}</div>
      </transition-group>
    </VueDraggable>
  </div>
</template>

<script>
import VueDraggable from 'vuedraggable'
const message = ['aa', 'bb', 'cc', 'dd', 'ee']
export default {
  components: { VueDraggable },
  props: {},
  data() {
    return {
      sourceList: message.map((name, index) => {
        return { name, order: index + 1, fixed: false }
      }),
      targetList: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return !relatedElement || !relatedElement.fixed
    }
  }
}
</script>

<style lang="scss">
.test_draggable {
  .left {
    width: 50%;
    min-height: 400px;
    float: left;
  }
  .right {
    width: 50%;
    min-height: 400px;
    float: right;
    .target_group {
      height: 400px;
    }
  }
  .item {
    cursor: pointer;
  }
  .source_group-move {
    transition: transform 0.5s;
  }
  .target_group-move {
    transition: transform 0.5s;
  }
  .ghost {
    opacity: 0.5;
  }
}
</style>
