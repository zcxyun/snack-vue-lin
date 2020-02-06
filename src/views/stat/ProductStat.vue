<template>
  <div class="product-stat">
    <el-progress
      :text-inside="true" :stroke-width="20" v-if="showProgress"
      :percentage="currentProgress"></el-progress>
    <div class="product-stat-header">
      <div class="header-left">
        <p class="title">商品统计</p>
      </div>
      <div class="header-right">
        <el-dropdown @command="changeChartType" class="chart-types">
          <el-button type="primary">
            {{currentChartType}}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <template v-for="(v, k) in chartTypes">
              <el-dropdown-item :command="k" :key="k">{{v}}</el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
        <el-cascader
          v-model="curProductId"
          :options="categoriesWithProducts"
          :props="{
            expandTrigger: 'hover',
            emitPath: false,
            label: 'name',
            value: 'id',
            children: 'products'
          }"
          placeholder="请选择商品"
          :show-all-levels="true"
          size="small"
          class="product-cascader"
          @change="cascaderChange"></el-cascader>
        <lin-date-picker @dateChange="handleDateChange" ref="searchDate"></lin-date-picker>
      </div>
    </div>
    <el-divider></el-divider>
    <chart :options="productChartOptions"></chart>
  </div>
</template>

<script>
import LinDatePicker from '@/components/base/date-picker/lin-date-picker'
import statModel from '@/models/stat.js'
import cateModel from '@/models/category.js'

export default {
  components: {
    LinDatePicker,
  },
  data() {
    return {
      // 进度条相关
      showProgress: false,
      currentProgress: 0,
      // 日期相关
      dateFrom: '',
      dateTo: '',
      // 级联选择器相关
      curProductId: 0,
      categoriesWithProducts: [],
      // 下拉菜单相关
      currentChartType: '柱状图',
      chartTypes: {
        column: '柱状图',
        bar: '条形图',
        line: '直线图',
        spline: '曲线图',
      },
      // 图表相关
      productChartOptions: {
        chart: {
          type: 'column',
        },
        title: {
          text: '商品信息',
        },
        tooltip: {
          shared: true,
        },
        xAxis: {
          categories: [],
          labels: { step: 5 },
        },
        yAxis: [{
          title: {
            text: '数量',
          },
        }, {
          title: {
            text: '金额',
          },
          opposite: true,
        }],
        series: [{
          name: '商品总数',
          yAxis: 0,
          data: [],
        }, {
          name: '商品总额',
          yAxis: 1,
          data: [],
        }],
      },
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.getCategoriesWithProducts()
      await this.stat()
      await this.getData()
    },
    async getCategoriesWithProducts() {
      const res = await cateModel.getAllWithProducts().catch(() => {})
      if (res) {
        this.categoriesWithProducts = res
        this.curProductId = res[0].products[0].id
      }
    },
    async stat() {
      try {
        const dateSection = await statModel.getDateSectionForProduct()
        if (dateSection && Array.isArray(dateSection)) {
          this.showProgress = true
          let i = 0
          for (const date_str of dateSection) {
            const res = await statModel.statProduct(date_str)  // eslint-disable-line
            if (res) {
              i++
              this.currentProgress = parseInt(i / dateSection.length * 100, 10)
            }
          }
          this.showProgress = false
          if (i < dateSection.length) {
            this.$message.error('出现错误, 统计未完成')
            return false
          }
          this.$message.success('统计完成')
        }
      } catch (error) {
        if (error.error_code === 40000) {
          this.$message.success('已成功统计数据到昨天')
        }
      }
      return true
    },
    async getData() {
      const res = await statModel.getProduct(this.curProductId, this.dateFrom, this.dateTo)
      if (res) {
        this.productChartOptions.xAxis.categories = res.dates
        this.productChartOptions.series[0].data = res.counts
        this.productChartOptions.series[1].data = res.prices
        const xAxisLength = res.dates.length
        this.productChartOptions.xAxis.labels.step = Math.floor(xAxisLength / 8)
      }
    },
    cascaderChange(value) {
      this.curProductId = value
      this.getData()
    },
    handleDateChange(date) {
      const dateIsValid = Array.isArray(date) && date.length > 0
      this.dateFrom = dateIsValid ? date[0] : ''
      this.dateTo = dateIsValid ? date[1] : ''
      this.getData()
    },
    changeChartType(type) {
      this.currentChartType = this.chartTypes[type]
      this.productChartOptions.chart.type = type
    },
  },
}
</script>

<style lang="scss" scoped>
.product-stat {
  .product-stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-bottom: -24px;

    .header-left {
      float: left;

      .title {
        height: 59px;
        line-height: 59px;
        color: #4c76af;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .header-right {
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .chart-types {
        margin-right: 20px;
      }
      .product-cascader {
        margin-right: 20px;
      }
    }
  }
}
</style>
