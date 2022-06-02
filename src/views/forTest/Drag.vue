<template>
  <div class="test-drag">
    <LuckyButton>aaaaaa</LuckyButton>
    <LuckyDrag v-model="list">
      <template #listItem="{ listItem }">
        <div class="item">{{ listItem.value }}</div>
      </template>
    </LuckyDrag>
  </div>
</template>

<script>
import LuckyDrag from '@/luckyUI/components/LuckyDrag'
export default {
  components: { LuckyDrag },
  props: {},
  data() {
    return {
      list: [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.test-drag {
  .item {
    height: 40px;
    border: 1px solid;
  }
}
</style>
