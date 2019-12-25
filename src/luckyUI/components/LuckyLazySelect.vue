<template>
  <el-select
    v-model="value"
    :placeholder="placeholder"
    :filterable="filterable"
    :disabled="disabled"
    :clearable="clearable"
    :allow-create="allowCreate"
    :collapse-tags="collapseTags"
    :multiple-limit="multipleLimit"
    :loading="loading"
    v-lucky-lazy-load="loadMore"
    @change="handleChange"
    @clear="handleClear"
  >
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="item[optionProps.label]"
      :value="item[optionProps.value]"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  components: {},
  props: {
    value: { type: [String, Number, Array] },
    lazyLoad: { type: Boolean, default: false },
    size: { type: String },
    pageSize: { type: Number, default: 10 },
    placeholder: { type: String, default: '请选择' },
    getOptionFunc: { type: Function, required: true },
    params: { type: Object, default: () => { return {} } },
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    filterable: { type: Boolean, default: false }, // 暂只支持对已有数据搜索
    allowCreate: { type: Boolean, default: false }, // 暂不支持
    collapseTags: { type: Boolean, default: false },
    multipleLimit: { type: Number, default: 0 },
    optionProps: { type: Object, default: () => { return { label: 'label', value: 'value' } } }
  },
  directives: {
    'lucky-lazy-load': {
      bind (el, binding) {
        let selectDom = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        selectDom.addEventListener('scroll', function () {
          let condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) binding.value()
        })
      }
    }
  },
  data () {
    return {
      trueValue: null,
      pageInfo: { page: 1, size: 10, total: 0 },
      isOver: false,
      loading: false,
      options: []
    }
  },
  computed: {},
  watch: {},
  created () {
    this.pageInfo.size = this.pageSize
    if (this.multiple) this.trueValue = this.value
    if (this.lazyLoad && (typeof this.value) === 'object' && this.value.length > 0) this.toGetSelectedOptions()
  },
  mounted () {},
  methods: {
    async toGetSelectedOptions () {
      let res = {}
      res = await this.getOptionFunc({ ids: this.value })
      if (res.code && res.code === '00000') {
        this.options = JSON.parse(JSON.stringify(res.data.tbody))
      }
    },
    async toGetSelectOptions () {
      let res = {}
      if (this.lazyLoad) {
        this.loading = true
        res = await this.getOptionFunc({ size: this.pageInfo.size, page: this.pageInfo.page, ...this.params })
      } else res = await this.getOptionFunc({ ...this.params })
      if (res.code && res.code === '00000') {
        this.toSetOptions(JSON.stringify(res.data))
      }
      this.loading = false
    },
    toSetOptions (dataJson) {
      let newData = JSON.parse(dataJson)
      let that = this
      if (that.lazyLoad) {
        newData.tbody.forEach(item => {
          if (that.multiple) {
            if (!that.value.includes(item[that.optionProps.value])) that.options.push(item)
          } else {
            if (item[that.optionProps.value] !== that.value) that.options.push(item)
          }
        })
      } else that.options = newData
    },
    loadMore () {
      if (this.pageInfo.page * this.pageInfo.size >= this.pageInfo.total) return
      this.pageInfo.page++
      this.toGetSelectOptions()
    },
    handleChange () {
      this.$emit('input', this.trueValue)
      this.$emit('change', this.trueValue)
    },
    handleClear () {
      this.trueValue = null
      this.$emit('clear', this.trueValue)
    }
  }
}
</script>

<style lang="scss">
</style>
