<template>
  <div class="operate_user">
    {{ pageType === 'add' ? '创建用户' : '编辑用户' }}
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    pageType() {
      return this.$route.name.indexOf('edit') > 0 ? 'edit' : 'add'
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss"></style>
