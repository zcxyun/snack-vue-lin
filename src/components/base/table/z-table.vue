<template>
  <div>
    <!-- 列表页面 -->
    <div class="tableSample">
      <sticky-top>
        <div class="header">
          <div class="header-left">
            <p class="title">{{title}}</p>
          </div>
          <div class="header-right">
            <lin-date-picker
              @dateChange="handleDateChange"
              ref="searchDate" class="date" v-if="showDatePicker"></lin-date-picker>
            <el-dropdown style="margin-right: 20px;" v-if="showSearchTypes" @command="chooseSearchType">
              <el-button type="primary">
                {{searchTypes[currentSearchType] || '暂无搜索类型'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                v-for="(value, key) in searchTypes"
                :command="key"
                :key="key">{{value}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <lin-search @query="onQueryChange" :placeholder="searchPlaceHolder" v-if="showSearch"/>
            <div style="margin-left:30px">
              <el-button type="primary" @click="dialogTableVisible=!dialogTableVisible">列操作</el-button>
            </div>
          </div>
        </div>
      </sticky-top>
      <div class="table-main">
        <el-dialog top="5vh" width="60%" :visible.sync="dialogTableVisible">
          <!-- 定制列 -->
          <span>选择要展示的列:</span>
          <el-checkbox-group v-model="checkList" class="m-20">
            <el-checkbox
              :disabled="item === ''"
              :label="item"
              v-for="item in tempCheckList"
              :key="item"
            />
          </el-checkbox-group>
          <!-- 固定列 -->
          <span>选择固定在左侧的列:</span>
          <el-checkbox-group v-model="fixedLeftList" class="m-20">
            <el-checkbox
              :disabled="fixedRightList.indexOf(item) > -1 || checkList.indexOf(item) ===  -1"
              :label="item"
              v-for="item in tempCheckList"
              :key="item"
            />
          </el-checkbox-group>
          <span>选择固定在右侧的列:</span>
          <el-checkbox-group v-model="fixedRightList" class="m-20">
            <el-checkbox
              :disabled="fixedLeftList.indexOf(item) > -1 || checkList.indexOf(item) === -1"
              :label="item"
              v-for="item in tempCheckList"
              :key="item"
            />
          </el-checkbox-group>
        </el-dialog>
        <el-table
          :data="_tableData"
          @row-dblclick="onRowDbClick"
          @expand-change="onExpandChange"
          v-loading="loading"
          highlight-current-row
          stripe
        >
          <!-- 展示摘要 -->
          <el-table-column type="expand" v-if="showExtend">
            <template #default="{row}">
              <div class="summary">
                <template v-for="column in filterTableColumn">
                  <el-image
                    :key="column.label"
                    v-if="column.isImage"
                    :src="row[column.prop]"
                    fit="contain"
                    class="summary-img"
                    @click.native="onImage(row[column.prop])">
                  </el-image>
                </template>
                <el-form label-position="right" class="table-expand" size="mini">
                  <template v-for="column in filterTableColumn">
                    <el-form-item
                      :label="column.label"
                      :key="column.label"
                      v-if="column.isText && row[column.prop].value">
                      <div class="form-item">       {{ row[column.prop].value }}</div>
                    </el-form-item>
                  </template>
                </el-form>
              </div>
            </template>
          </el-table-column>
          <!-- 开始循环 -->
          <template v-for="column in filterTableColumn">
            <!-- 切换 -->
            <el-table-column
              :label="column.label"
              v-if="column.isSwitch"
              :key="column.label"
              :fixed="column.fixed ? column.fixed : false"
              :width="column.width ? column.width : ''">
              <template #default="{row}">
                <el-switch
                  v-model="row[column.prop]"
                  active-color="#3963bc"
                  @change="onSwitch(row, row[column.prop])"
                ></el-switch>
              </template>
            </el-table-column>
            <!-- 首列图片 -->
            <el-table-column
              :key="column.label"
              v-else-if="column.isImage"
              :label="column.label"
              :fixed="column.fixed ? column.fixed : false"
              :width="column.width ? column.width : ''">
              <template #default="{row}">
                <el-image
                  :src="row[column.prop]"
                  fit="contain"
                  @click.native="onImage(row[column.prop])"
                  ></el-image>
              </template>
            </el-table-column>
            <!-- 标签列 -->
            <el-table-column
              :key="column.label"
              v-else-if="column.isTag"
              :label="column.label"
              :fixed="column.fixed ? column.fixed : false"
              :width="column.width ? column.width : ''"
              show-overflow-tooltip>
              <template #default="{row}">
                <template v-if="typeof row[column.prop] === 'string'">
                  <el-tag>{{row[column.prop]}}</el-tag>
                </template>
                <template v-else-if="Array.isArray(row[column.prop])">
                  <el-tag v-for="(item, index) in row[column.prop]" :key="index">{{item}}</el-tag>
                  <!-- <el-tag>{{row[column.prop][0] + (row[column.prop].length > 1 ? '...' : '')}}</el-tag> -->
                </template>
                <template v-else><el-tag type="info">暂无数据</el-tag></template>
              </template>
            </el-table-column>
            <!-- 单元格编辑 -->
            <el-table-column
              v-else-if="column.isText"
              :key="column.label"
              :label="column.label"
              :prop="column.prop"
              :width="column.width ? column.width : ''"
              :fixed="column.fixed ? column.fixed : false"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <template v-if="row[column.prop]">
                  <div v-if="!row[column.prop].editFlag" class="table-edit">
                    <div @click="onCellEdit(row, column)" class="content" v-if="row[column.prop].value !== ''">{{row[column.prop].value}}</div>
                    <template v-else><el-tag type="info">暂无数据</el-tag></template>
                    <!-- <div class="cell-icon" @click="onCellEdit(row, column)" v-if="operate">
                      <i class="el-icon-edit"></i>
                    </div> -->
                  </div>
                  <div v-else class="table-edit">
                    <el-input v-model="row[column.prop].value"
                      :autofocus="true"
                      clearable
                      :ref="column.prop + '-' + row.id"
                    ></el-input>
                    <div class="cell-icon-edit">
                      <div class="cell-save" @click="onCellSave(row, column)">
                        <i class="el-icon-check"></i>
                      </div>
                      <div class="cell-cancel" @click="onCellCancel(row, column)">
                        <i class="el-icon-close"></i>
                      </div>
                    </div>
                  </div>
                </template>
                <el-tag type="info" v-else>暂无数据</el-tag>
              </template>
            </el-table-column> -->
          </template>
          <!-- 操作列 -->
          <el-table-column label="操作" fixed="right" width="174" v-if="operate">
            <template #default="scope" v-if="customOperate">
              <el-button
                v-for="(item,index) in customOperateList"
                :type="item.type"
                plain
                :key="index"
                size="mini"
                v-auth="{auth:item.auth ? item.auth : '', type: 'disabled'}"
                @click.native.prevent.stop="buttonMethods(item.func, scope.$index, scope.row)">{{item.name}}
              </el-button>
            </template>
            <template #default="{row}" v-else>
              <template v-if="row.delete_time">
                <el-tooltip effect="dark" content="上架" placement="top">
                  <el-button  type="warning" @click="onShow(row.id)" icon="el-icon-unlock" size="mini"></el-button>
                </el-tooltip>
              </template>
              <template v-else>
                <el-tooltip effect="dark" content="编辑" placement="top">
                  <el-button type="primary" @click="onEdit(row.id)" icon="el-icon-edit" size="mini"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="下架" placement="top">
                  <el-button type="success" @click="onHide(row.id)" icon="el-icon-lock" size="mini"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top">
                  <el-button type="danger" @click="onRemove(row.id)" icon="el-icon-delete" size="mini"></el-button>
                </el-tooltip>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            @current-change="onCurrentChange"
            :background="true"
            :page-size="pageCount"
            :current-page="currentPage"
            layout="prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LinSearch from '@/components/base/search/lin-search'
import LinDatePicker from '@/components/base/date-picker/lin-date-picker'
import utils from '@/lin/utils/util.js'

export default {
  components: {
    LinSearch, LinDatePicker,
  },
  props: {
    // 页面标题
    title: String,
    // 日期选择器相关
    showDatePicker: Boolean,
    // 搜索相关
    showSearch: Boolean,
    showSearchTypes: Boolean,
    searchTypes: Object,
    currentSearchType: String,
    searchPlaceHolder: String,
    // 表格相关
    loading: Boolean,
    tableData: Array,
    tableColumn: Array,
    showExtend: Boolean,
    // 操作表格相关
    operate: Boolean,
    customOperate: Boolean,
    cellOperate: Boolean,
    customOperateList: Array,
    // 分页相关
    currentPage: Number, // 默认获取第一页的数据
    pageCount: Number, // 每页10条数据
    total: Number, // 数据总数
  },
  data() {
    return {
      // 定制列相关
      checkList: [],
      filterTableColumn: [],
      tempCheckList: [],
      // 固定列相关
      dialogTableVisible: false,
      fixedLeftList: [],
      fixedRightList: [],
      // 单元格编辑相关
      editRow: 0,
      originCellValue: '',
      cellEditing: false,
    }
  },
  computed: {
    _tableData() {
      // 当数据变动时使单元格可编辑
      this.cellEditing = false // eslint-disable-line
      // 处理原表格数据, 使每个要显示的cell数据项等于{value: 原数据值, editFlag: false}
      let data = []
      // console.log(this.tableData)
      if (Array.isArray(this.tableData)) {
        data = utils.deepClone(this.tableData)
        data.forEach((item) => {
          const tempItem = item
          this.tableColumn.forEach((column) => {
            const { prop, isText } = column
            if (prop in tempItem && isText) {
              tempItem[prop] = {
                value: tempItem[prop],
                editFlat: false,
              }
            }
          })
        })
      }
      // console.log(data)
      return data
    },
  },
  created() {
    // 定制列
    this.tempCheckList = this.tableColumn.map(v => v.label)
    this.checkList = this.tempCheckList.slice()
    this.filterTableColumn = this.tableColumn.filter(
      v => this.checkList.includes(v.label),
    )
  },
  methods: {
    // 还原cell数据, 使单个cell数据项等于其自身的value
    _revertSingleData(data) {
      const { toString } = Object.prototype
      if (toString.call(data) === '[object Object]') {
        const res = utils.deepClone(data)
        this.tableColumn.forEach((column) => {
          const { prop, isText } = column
          if (prop in res && isText) {
            res[prop] = res[prop].value
          }
        })
        return res
      }
    },

    // 开发者自定义的函数
    buttonMethods(func, index, row) {
      const _this = this
      const { methods } = this.$options
      methods[func](_this, index, row)
    },

    operateOne(_this, index, row) {
      _this.$emit('operate-one', { index, row })
    },

    operateTwo(_this, index, row) {
      _this.$emit('operate-two', { index, row })
    },

    handleDateChange(date) {
      // console.log(date)
      this.$emit('date-change', date)
    },

    onRowDbClick(val) {
      // console.log(val)
      this.$emit('row-db-click', val)
    },

    chooseSearchType(type) {
      this.$emit('choose-search-type', type)
    },

    // 变更排序
    // onSort(val) {
    // },

    // 切换状态
    onSwitch(row, val) {
      const data = this._revertSingleData(row)
      this.$emit('switchStatus', { row: data, val })
    },

    onExpandChange(row, expandedRows) {
      // console.log(row, expandedRows)
      this.$emit('expand-change', { row, expandedRows })
    },

    // 单元格编辑
    onCellEdit(row, column) {
      if (!this.cellOperate) {
        return
      }
      if (this.cellEditing === true) {
        this.$message.warning('一次只能编辑一个单元格')
        return
      }
      const { prop } = column
      if (prop in row) {
        // 记录单元格当前数据, 如果未修改不做提交并恢复原数据
        this.originCellValue = row[prop].value
        this.$set(row[prop], 'editFlag', true)
        this.cellEditing = true
        // 在组件渲染后才能使用组件
        this.$nextTick(() => {
          const refKey = `${prop}-${row.id}`
          this.$refs[refKey][0].select()
        })
        this.editRow++
      }
    },

    // 单元格保存
    async onCellSave(row, column) {
      const { prop } = column
      if (prop in row) {
        const cell = row[prop]
        this.$set(cell, 'editFlag', false)
        this.cellEditing = false
        this.editRow--
        if (cell.value === this.originCellValue) {
          this.$message.warning('未做任何修改')
          return
        }
        if (cell.value === '') {
          cell.value = this.originCellValue
          this.$message.error('单元格数据不能为空')
          return
        }
        // 提交更新数据
        const data = this._revertSingleData(row)
        this.$emit('cell-save', data)
      }
    },

    // 单元格取消编辑
    onCellCancel(row, column) {
      const { prop } = column
      if (prop in row) {
        this.$set(row[prop], 'editFlag', false)
        this.$set(row[prop], 'value', this.originCellValue)
        this.cellEditing = false
        this.$message.warning('已取消编辑')
        this.editRow--
      }
    },

    // 切换分页
    async onCurrentChange(val) {
      this.$emit('page-change', val)
    },
    onEdit(id) {
      this.$emit('edit', id)
    },
    onRemove(id) {
      this.$emit('remove', id)
    },
    onHide(id) {
      this.$emit('hide', id)
    },
    onShow(id) {
      this.$emit('show', id)
    },
    // 搜索
    onQueryChange(query) {
      this.$emit('search', query)
    },
    // 预览图片
    onImage(image) {
      if (typeof image === 'string' && image) {
        this.$imagePreview({ images: [image] })
      }
    },
  },

  watch: {
    // 监听固定列变化
    fixedLeftList() {
      this.filterTableColumn.map((item, index) => {
        if (this.fixedLeftList.indexOf(item.label) > -1) {
          this.$set(this.filterTableColumn[index], 'fixed', 'left')
        } else if (this.fixedRightList.indexOf(item.label) === -1) {
          this.$set(this.filterTableColumn[index], 'fixed', false)
        }
        return ''
      })
    },
    fixedRightList() {
      this.filterTableColumn.map((item, index) => {
        if (this.fixedRightList.indexOf(item.label) > -1) {
          this.$set(this.filterTableColumn[index], 'fixed', 'right')
        } else if (this.fixedLeftList.indexOf(item.label) === -1) {
          this.$set(this.filterTableColumn[index], 'fixed', false)
        }
        return ''
      })
    },
    // 监听选择列变化
    checkList() {
      this.filterTableColumn = this.tableColumn.filter(
        v => this.checkList.includes(v.label),
      )
    },
  },
}
</script>

<style lang="scss">
.tableSample {
  padding: 0 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    border-bottom: 1px solid #dae1ed;

    .header-left {
      float: left;

      .title {
        height: 59px;
        line-height: 59px;
        color: $parent-title-color;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .header-right {
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .date {
        margin-right: 20px;
      }
    }
  }

  .table-main {
    padding: 0 30px;
    margin-top: 30px;
  }

  .top-operate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    margin-top: 30px;
  }

  .sort-input {
    width: 50px;
    background: none;
    justify-content: space-around;
  }

  .table-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cell-icon {
      cursor: pointer;
      color: #3963bc;
      font-size: 16px;
    }

    .cell-icon-edit {
      display: flex;
      margin-left: 20px;
      width: 50px;
      justify-content: space-between;

      .cell-cancel {
        cursor: pointer;
        color: #3963bc;
        font-size: 16px;
      }

      .cell-save {
        cursor: pointer;
        color: #3963bc;
        font-size: 16px;
        margin-right: -20px;
      }
    }
  }

  .m-20 {
    margin-bottom: 10px;
    margin-top: 5px;
  }

  .summary {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;

    .summary-img {
      width: 325px;
      height: 250px;
    }

    .table-expand {
      font-size: 0;
      margin-left: 30px;
      // display: flex;
      // flex-direction: column;

      label {
        width: 90px;
        color: #99a9bf;
      }

      .el-form-item {
        margin-right: 0;
        margin-bottom: 0px !important;
        width: 500px;
        // display: flex;
        // flex-direction: row;

        .form-item {
          white-space: pre-wrap;
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
// dialog
.tableSample >>> .el-dialog__footer {
  text-align: left;
  padding-left: 30px;
}

.tableSample >>> .el-dialog__header {
  padding-left: 30px;
}

.tableSample >>> .el-dialog__body {
  padding: 30px;
}
</style>
