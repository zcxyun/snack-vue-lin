<template>
  <div>
    <z-table
      v-if="!showEdit"
      :loading="loading"
      showExtend
      showSearch
      :title="title"
      :searchPlaceHolder="searchPlaceHolder"
      :tableData="tableData"
      :tableColumn="tableColumn"
      :operate="operate"
      :currentPage="currentPage"
      :pageCount="pageCount"
      :total="total"
      @cell-save="onCellSave"
      @page-change="onPageChange"
      @edit="onEdit"
      @remove="onRemove"
      @hide="onHide"
      @show="onShow"
      @search="onSearch"
    ></z-table>
    <product-info
      v-else
      :editId="editId"
      @edit-save="onEditSave"
      @edit-back="onEditBack"
    ></product-info>
  </div>
</template>

<script>
import product from '@/models/product.js'
import ProductInfo from './ProductInfo'
import { tableColumn } from './data.js'
import Config from '@/config'
import ZTable from '@/components/base/table/z-table'

export default {
  components: {
    ProductInfo,
    ZTable,
  },
  data() {
    return {
      title: '产品列表',
      searchPlaceHolder: '请输入产品名',
      editId: 0,
      showEdit: false,
      tableData: [],
      tableColumn,
      loading: false,
      operate: true,
      searchKeyword: '',
      // 分页相关
      // refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      currentPage: 1, // 默认获取第一页的数据
      pageCount: Config.pageSize, // 每页10条数据
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
        const { total, models } = await product.getPaginate(page, count, q)
        this.tableData = models
        this.total = total
      } catch (err) {
        this.tableData = []
        this.total = 0
        console.log(err)
      }
      this.loading = false
    },

    rowClick(val) {
      console.log(val)
    },

    // 单元格保存
    async onCellSave(data) {
      try {
        data.stock = Number(data.stock)
        const res = await product.edit(data.id, data)
        if (res && res.error_code === 0) {
          this.$message.success(`${res.msg}`)
        }
      } catch (err) {
        console.log(err)
      }
      this._getTableData()
    },

    // 切换分页
    async onPageChange(val) {
      this.currentPage = val
      this._getTableData()
    },

    onEdit(id) {
      this.showEdit = true
      this.editId = id
    },
    onRemove(id) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await product.remove(id)
          this.$message.success(res.msg)
          // 如果当前页的数据只剩一个, 并且不是第一页就切换到上一页
          if (this.total % this.pageCount === 1 && this.currentPage !== 1) {
            this.currentPage--
          }
          this._getTableData()
        } catch (err) {
          console.log(err)
        }
        this.loading = false
      }).catch(() => {
        this.$message.warning('已取消删除')
      })
    },

    async onHide(id) {
      try {
        this.loading = true
        const res = await product.hide(id)
        this.$message.success(res.msg)
        this._getTableData()
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },

    async onShow(id) {
      try {
        this.loading = true
        const res = await product.show(id)
        this.$message.success(res.msg)
        this._getTableData()
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },

    // async onSwitch({ row, val }) {
    //   this.loading = true
    //   const data = {
    //     classic_id: row.id,
    //     type: ClassicType.MOVIE,
    //   }
    //   let res = null
    //   try {
    //     if (val) {
    //       res = await classic.addClassic(data)
    //     } else {
    //       res = await classic.deleteClassic(data)
    //     }
    //     if (res && res.error_code === 0) {
    //       this.$message.success(res.msg)
    //     }
    //   } catch (err) {
    //     console.log(err)
    //   }
    //   this._getTableData()
    //   this.loading = false
    // },
    // 搜索
    onSearch(query) {
      this.currentPage = 1
      this.searchKeyword = query
      this._getTableData()
    },
    // 保存并关闭编辑页面
    onEditSave() {
      this.showEdit = false
      this._getTableData()
    },
    // 返回并关闭编辑页面不刷新数据
    onEditBack() {
      this.showEdit = false
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
