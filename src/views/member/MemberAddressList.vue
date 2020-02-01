<template>
  <div>
    <z-table
      :loading="loading"
      showSearch
      :title="title"
      :searchPlaceHolder="searchPlaceHolder"
      :tableData="tableData"
      :tableColumn="addressTableColumn"
      :currentPage="currentPage"
      :pageCount="pageCount"
      :total="total"
      @page-change="onPageChange"
      @search="onSearch"
    ></z-table>
  </div>
</template>

<script>
import address from '@/models/address.js'
import { addressTableColumn } from './data.js'
import ZTable from '@/components/base/table/z-table'

export default {
  components: {
    ZTable,
  },
  data() {
    return {
      title: '收货地址列表',
      searchPlaceHolder: '请输入会员名或收获人姓名',
      tableData: [],
      addressTableColumn,
      loading: false,
      searchKeyword: '',
      // 分页相关
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 2, // 每页10条数据
      total: 0, // 分组内的用户总数
    }
  },
  created() {
    // 获取数据
    this._getTableData()
  },
  methods: {
    // 获取数据
    async _getTableData() {
      const page = this.currentPage - 1
      const count = this.pageCount
      const q = this.searchKeyword.trim()
      try {
        this.loading = true
        const { total, models } = await address.getPaginate(page, count, q)
        this.tableData = models
        this.total = total
      } catch (err) {
        this.tableData = []
        this.total = 0
        console.log(err)
      }
      this.loading = false
    },
    // 切换分页
    async onPageChange(val) {
      this.currentPage = val
      this._getTableData()
    },
    // 搜索
    onSearch(query) {
      this.currentPage = 1
      this.searchKeyword = query
      this._getTableData()
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
