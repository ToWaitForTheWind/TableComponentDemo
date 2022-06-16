<template>
  <div>
    <lq-table
      :thead="thead"
      :data-list="tableData"
      :is-sorting.sync="isSorting"
      :total="4"
      @toSaveSort="toSaveSort"
    >
      <template #name="{ dataItem }">
        <!-- 想要替换的渲染内容，listItem是当前行的值 -->
        <span style="color: red;">{{ dataItem.name }}</span>
      </template>
    </lq-table>
  </div>
</template>

<script>
import LqTable from '@/luckyUI/components/LqTable'
export default {
  components: { LqTable },
  data() {
    return {
      thead: [
        { prop: 'name', label: '姓名', width: 320, sticky: true },
        { prop: 'date', label: '日期', width: 400, sortable: true },
        { prop: 'address', label: '地址', width: 800 },
      ],
      tableData: [
        {
          value: 1,
          date: '2016-05-02',
          name: '张三',
          address:
            '张三的住址张三的住址张三的住址张三的住址张三的住址张三的住址张三的住址张三的住址',
        },
        {
          value: 2,
          date: '2016-05-04',
          name: '李四',
          address: '李四的住址李四的住址李四的住址李四的住址',
        },
        {
          value: 3,
          date: '2016-05-01',
          name: '王五',
          address:
            '王五的住址王五的住址王五的住址王五的住址王五的住址王五的住址王五的住址王五的住址',
        },
        {
          value: 4,
          date: '2016-05-03',
          name: '马六',
          address: '马六的住址马六的住址马六的住址马六的住址',
        },
        {
          value: 5,
          date: '2016-05-03',
          name: '赵七',
          address: '赵七的住址赵七的住址赵七的住址赵七的住址赵七的住址',
        },
      ],
      isSorting: false,
    }
  },
  methods: {
    toSaveSort(list) {
      this.tableData = list
    },
  },
}
</script>
