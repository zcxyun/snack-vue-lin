<template>
  <div class="order-stat">
    <div class="order-stat-header">
      <div class="header-left">
        <p class="title">订单统计</p>
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
        <lin-date-picker @dateChange="handleDateChange" ref="searchDate"></lin-date-picker>
      </div>
    </div>
    <el-divider></el-divider>
    <chart :options="orderChartOptions"></chart>
  </div>
</template>

<script>
import LinDatePicker from '@/components/base/date-picker/lin-date-picker'
import statModel from '@/models/stat.js'

export default {
  components: {
    LinDatePicker,
  },
  data() {
    return {
      // 日期相关
      dateFrom: '',
      dateTo: '',
      // 下拉菜单相关
      currentChartType: '柱状图',
      chartTypes: {
        column: '柱状图',
        bar: '条形图',
        line: '直线图',
        spline: '曲线图',
      },
      // 图表相关
      orderChartOptions: {
        chart: {
          type: 'column',
        },
        title: {
          text: '订单信息',
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
            text: '数量(个)',
          },
        }, {
          title: {
            text: '流水(元)',
          },
          opposite: true,
        }],
        series: [{
          name: '订单数',
          yAxis: 0,
          data: [],
        }, {
          name: '订单总额',
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
      // 暂不需要统计, 因为访问about时已经统计过了
      await this.getData()
    },
    async getData() {
      const res = await statModel.getOrder(this.dateFrom, this.dateTo)
      if (res) {
        this.orderChartOptions.xAxis.categories = res.dates
        this.orderChartOptions.series[0].data = res.orderCounts
        this.orderChartOptions.series[1].data = res.prices
        const xAxisLength = res.dates.length
        this.orderChartOptions.xAxis.labels.step = Math.floor(xAxisLength / 8)
      }
    },
    handleDateChange(date) {
      const dateIsValid = Array.isArray(date) && date.length > 0
      this.dateFrom = dateIsValid ? date[0] : ''
      this.dateTo = dateIsValid ? date[1] : ''
      this.getData()
    },
    changeChartType(type) {
      this.currentChartType = this.chartTypes[type]
      this.orderChartOptions.chart.type = type
    },
  },
}
</script>

<style lang="scss" scoped>
.order-stat {
  .order-stat-header {
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
    }
  }
}
</style>
