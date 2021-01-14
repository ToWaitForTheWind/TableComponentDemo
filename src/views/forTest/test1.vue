<template>
  <div class="test">
    <RegionSelect
      v-model="value"
      :options="provinces"
      @change="handleRegionChange"
    ></RegionSelect>
  </div>
</template>

<script>
import RegionSelect from './RegionSelect'
export default {
  components: { RegionSelect },
  props: {},
  data() {
    return {
      value: [1, 11, 111],
      provinces: [
        {
          name: '浙江省',
          code: 1,
          cities: [
            {
              name: '杭州市',
              code: 11,
              areas: [
                { name: '西湖区', code: 111 },
                { name: '余杭区', code: 112 }
              ]
            },
            {
              name: '宁波市',
              code: 12,
              areas: [
                { name: '江北区', code: 121 },
                { name: '江东区', code: 122 }
              ]
            }
          ]
        },
        {
          name: '广东省',
          code: 2,
          cities: [
            {
              name: '广州市',
              code: 21,
              areas: [
                { name: '白云区', code: 211 },
                { name: '天河区', code: 212 }
              ]
            },
            {
              name: '深圳市',
              code: 22,
              areas: [
                { name: '宝安区', code: 221 },
                { name: '南山区', code: 222 }
              ]
            }
          ]
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleRegionChange(val) {
      console.log(this.value, 'model')
      console.log(val, 'change')
    }
  }
}
</script>

<style lang="scss"></style>
