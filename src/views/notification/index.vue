<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="试题内容">
        <!-- <textarea id="textarea" rows="5" cols="50"></textarea> -->
        <el-input ref="aaa" id="textarea" v-model="form.name" type="textarea" :rows="3"></el-input>
      </el-form-item>
    </el-form>
    <lucky-button @click="insert">aaaa</lucky-button>
  </div>
</template>

<script>
import { testPost1 } from '@/api/index'
export default {
  components: {},
  props: {},
  data () {
    return {
      testPost1: testPost1,
      form: {
        name: ''
      }
    }
  },
  computed: {},
  watch: {
    value1: (val) => {
      // console.log(val)
    }
  },
  created () {},
  mounted () {
    // this.luckyMessage()
    // this.luckyNotify()
  },
  methods: {
    uploadSuccess () {
      console.log(1111)
    },
    insert () {
      var tb = document.getElementById('textarea')
      var str = 'hehe'
      tb.focus()
      if (document.all) {
        var r = document.selection.createRange()
        document.selection.empty()
        r.text = str
        r.collapse()
        r.select()
      } else {
        var newstart = tb.selectionStart + str.length
        tb.value = tb.value.substr(0, tb.selectionStart) + str + tb.value.substring(tb.selectionEnd)
        tb.selectionStart = newstart
        tb.selectionEnd = newstart
      }
      console.log(this.form.name)
      // var textarea = document.getElementById('textarea')
      // textarea.focus()
      // var value = this.form.name.split('')
      // console.log(textarea.selectionStart + '--' + textarea.selectionEnd)
      // var pos = textarea.selectionStart
      // // 光标处插入 4 位数随机值
      // var insertValue = 'hehe'
      // value.splice(pos, 0, insertValue)
      // this.form.name = value.join('')
      // // 定位新的光标位置
      // textarea.selectionStart = textarea.selectionEnd = pos + insertValue.length
    },
    nsertAtCursor(myField, model, myValue) {
      if (document.selection) {
        myField.focus()
        sel = document.selection.createRange()
        sel.text = myValue
      } else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.form[model] = this.form[model].substring(0, startPos) + myValue + this.form[model].substring(endPos, this.form[model].length)
        myField.selectionStart = startPos + myValue.length
        myField.selectionEnd = startPos + myValue.length
      } else {
        this.form[model] += myValue
      }
    }
  }
}
</script>

<style lang="scss">
</style>
