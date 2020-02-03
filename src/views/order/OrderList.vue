<template>
  <div>
    <z-table
      v-if="!showDetail"
      :loading="loading"
      showExtend
      showSearch
      showDatePicker
      operate
      customOperate
      showSearchTypes
      :searchTypes="searchTypes"
      :currentSearchType="currentSearchType"
      :customOperateList="customOperateList"
      :title="title"
      :searchPlaceHolder="searchPlaceHolder"
      :tableData="tableData"
      :tableColumn="tableColumn"
      :currentPage="currentPage"
      :pageCount="pageCount"
      :total="total"
      @page-change="onPageChange"
      @search="onSearch"
      @date-change="handleDateChange"
      @operate-one="onOperateOne"
      @operate-two="onOperateTwo"
      @choose-search-type="onChooseSearchType"
    ></z-table>
    <order-info
      v-else
      :editId="editId"
      @back="back"
    ></order-info>
  </div>
</template>

<script>
import orderModel from '@/models/order.js'
import { tableColumn, customOperateList } from './data.js'
import Config from '@/config'
import ZTable from '@/components/base/table/z-table'
import OrderInfo from './OrderInfo'

export default {
  components: {
    ZTable,
    OrderInfo,
  },
  data() {
    return {
      editId: 0,
      showDetail: false,
      title: '订单列表',
      // 搜索相关
      searchPlaceHolder: '请输入订单号',
      searchTypes: { all: '全部' },
      currentSearchType: 'all',
      searchKeyword: '',
      // 表格相关
      tableData: [],
      tableColumn,
      loading: false,
      // 分页相关
      currentPage: 1, // 默认获取第一页的数据
      pageCount: Config.pageSize, // 每页10条数据
      total: 0, // 分组内的用户总数
      // 日期
      dateStart: '',
      dateEnd: '',
      // 自定义操作列表
      customOperateList,
    }
  },
  created() {
    // 获取数据
    this._getSearchTypes()
    this._getTableData()
  },
  methods: {
    async _getSearchTypes() {
      const searchTypes = await orderModel.getAllOrderStatus().catch(() => {})
      if (searchTypes) {
        this.searchTypes = Object.assign(searchTypes, this.searchTypes)
      }
    },
    // 获取数据
    async _getTableData() {
      const page = this.currentPage - 1
      const count = this.pageCount
      const q = this.searchKeyword.trim()
      const orderStatus = this.currentSearchType
      try {
        this.loading = true
        const res = await orderModel.getPaginate(page, count, q, orderStatus, this.dateStart, this.dateEnd)
        if (res) {
          this.tableData = res.models
          this.total = res.total
        }
      } catch (err) {
        this.tableData = []
        this.total = 0
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
    // 搜索类型
    onChooseSearchType(type) {
      // console.log(type)
      this.currentSearchType = type
      this._getTableData()
    },
    // 处理搜索日期改变
    handleDateChange(date) {
      const dateIsValid = Array.isArray(date) && date.length > 0
      this.dateStart = dateIsValid ? date[0] : ''
      this.dateEnd = dateIsValid ? date[1] : ''
      this._getTableData()
    },
    // 订单发货
    async onOperateOne({ row }) {
      const res = await orderModel.delivery(row.member_id, row.id).catch(() => {})
      if (res && res.msg) {
        this.$message.success(res.msg)
        this._getTableData()
      }
    },
    // 订单详情
    onOperateTwo({ row }) {
      this.showDetail = true
      this.editId = row.id
    },
    back() {
      this.showDetail = false
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
