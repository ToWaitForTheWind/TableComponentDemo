<template>
  <div class="region_select">
    <el-select
      v-model="province"
      placeholder="请选择省"
      @change="provinceChange"
    >
      <el-option
        v-for="item in options"
        :key="item.code"
        :label="item.name"
        :value="item.code"
      ></el-option>
    </el-select>
    省
    <el-select v-model="city" placeholder="请选择市" @change="cityChange">
      <el-option
        v-for="item in cityList"
        :key="item.code"
        :label="item.name"
        :value="item.code"
      ></el-option>
    </el-select>
    市
    <el-select v-model="area" placeholder="请选择区" @change="areaChange">
      <el-option
        v-for="item in areaList"
        :key="item.code"
        :label="item.name"
        :value="item.code"
      ></el-option>
    </el-select>
    区
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: { type: Array, default: () => [] },
    options: { type: Array, default: () => [] }
  },
  data() {
    return {
      province: '',
      city: '',
      area: '',
      trueValue: []
    }
  },
  computed: {
    cityList() {
      let res = []
      if (!this.province) return res
      let provinceList = this.options
      for (let item of provinceList) {
        if (item.code === this.province) {
          res = JSON.parse(JSON.stringify(item.cities))
          break
        }
      }
      return res
    },
    areaList() {
      let res = []
      if (!this.city) return res
      let cityList = this.cityList
      for (let item of cityList) {
        if (item.code === this.city) {
          res = JSON.parse(JSON.stringify(item.areas))
          break
        }
      }
      return res
    }
  },
  watch: {},
  created() {
    ;[this.province, this.city, this.area] = [...this.value]
  },
  mounted() {},
  methods: {
    provinceChange(val) {
      this.trueValue = val ? [val] : []
      this.city = ''
      this.area = ''
      this.$emit('input', this.trueValue)
      this.$emit('change', this.trueValue)
    },
    cityChange(val) {
      this.trueValue = val ? [this.trueValue[0], val] : [this.trueValue[0]]
      this.area = ''
      this.$emit('input', this.trueValue)
      this.$emit('change', this.trueValue)
    },
    areaChange(val) {
      this.trueValue = val
        ? [this.trueValue[0], this.trueValue[1], val]
        : [this.trueValue[0], this.trueValue[1]]
      this.$emit('input', this.trueValue)
      this.$emit('change', this.trueValue)
    }
  }
}
</script>

<style lang="scss"></style>
