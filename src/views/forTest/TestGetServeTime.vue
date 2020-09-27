<template>
  <div class=""></div>
</template>

<script>
import axios from 'axios'
export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.checkDate()
  },
  methods: {
    checkDate() {
      let that = this
      const instance = axios.create({
        timeout: 20000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      instance.interceptors.request.use((config) => config, (err) => Promise.reject(err))
      instance.interceptors.response.use((response) => response)
      instance.get('/resource/time/time.html?t=' + Date.parse(new Date())).then((res) => {
        let headers = null
        if (res.headers) headers = res.headers
        else if (res.Headers) headers = res.Headers
        let date = null
        if (!headers) return
        if (headers.date) date = headers.date
        else if (headers.Date) date = headers.Date
        if (date) console.log(Date.parse(new Date(date)))
      })
    }
  }
}
</script>

<style lang="scss"></style>
