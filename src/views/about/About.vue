<template>
  <div class="container">
    <el-progress
      :text-inside="true" :stroke-width="20" v-if="showProgress"
      :percentage="currentProgress"></el-progress>
    <div class="quantity-statistics">
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">总访问量</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">{{numEllipsis(totalAccess)}}</div>
          </div>
        </div>
        <div class="quantity-icon">
          <img src="../../assets/img/about/icon.png" alt="">
        </div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">新增访问量(月)</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">{{numEllipsis(monthAccess)}}</div>
          </div>
        </div>
        <div class="quantity-icon">
          <img src="../../assets/img/about/icon.png" alt="">
        </div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">总会员数</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">{{numEllipsis(totalMemberCount)}}</div>
          </div>
        </div>
        <div class="quantity-icon">
          <img src="../../assets/img/about/icon.png" alt="">
        </div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">新增会员数(月)</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">{{numEllipsis(monthMemberCount)}}</div>
          </div>
        </div>
        <div class="quantity-icon">
          <img src="../../assets/img/about/icon.png" alt="">
        </div>
      </div>
    </div>
    <div class="order-info">
      <div class="order-count">
        <chart :options="orderChartOptions"></chart>
      </div>
      <div class="order-price">
        <chart :options="memberChartOptions"></chart>
      </div>
    </div>
  </div>
</template>

<script>
import statModel from '@/models/stat.js'

export default {
  data() {
    return {
      totalMemberCount: 0,
      monthMemberCount: 0,
      totalAccess: 0,
      monthAccess: 0,
      currentProgress: 0,
      showProgress: false,
      orderChartOptions: {
        chart: {
          type: 'column',
        },
        title: {
          text: '近一个月订单信息',
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
      memberChartOptions: {
        chart: {
          type: 'spline',
        },
        title: {
          text: '近一个月会员和访问信息',
        },
        tooltip: {
          shared: true,
        },
        xAxis: {
          categories: [],
          labels: { step: 5 },
        },
        yAxis: {
          title: {
            text: '数目',
          },
        },
        series: [{
          name: '会员新增个数',
          data: [],
        }, {
          name: '访问次数',
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
      await this.stat() // 先统计后台数据
      await this.getData() // 再得到数据
    },

    async getData() {
      const res = await statModel.dashboard()
      if (res) {
        this.totalMemberCount = res.totalMemberCount
        this.monthMemberCount = res.monthMemberCount
        this.totalAccess = res.totalAccess
        this.monthAccess = res.monthAccess

        this.orderChartOptions.xAxis.categories = res.dates
        this.orderChartOptions.series[0].data = res.orderCounts
        this.orderChartOptions.series[1].data = res.prices
        this.orderChartOptions.xAxis.labels.step = Math.floor(res.dates.length / 8)

        this.memberChartOptions.xAxis.categories = res.dates
        this.memberChartOptions.series[0].data = res.memberCounts
        this.memberChartOptions.series[1].data = res.accesses
        this.memberChartOptions.xAxis.labels.step = Math.floor(res.dates.length / 8)
      }
    },
    async stat() {
      try {
        const dateSection = await statModel.getDateSectionForAll()
        if (dateSection && Array.isArray(dateSection)) {
          this.showProgress = true
          let i = 0
          for (const date_str of dateSection) {
            const res = await statModel.statAll(date_str)  // eslint-disable-line
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
    numEllipsis(n) {
      return n >= 100000 ? '10万+' : n
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
  .order-info {
    margin-top: 20px;
  //   display: flex;
    width: 100%;
  //   .order-count {
  //     flex: 1;
  //   }
  //   .order-price {
  //     flex: 1;
  //   }
  }
  .quantity-statistics {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    height: 90px;
    .quantity-item {
      display: flex;
      width: 23%;
      height:100%;
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 14px 0px rgba(243,243,243,1);
      border-radius:8px;
      .quantity-detail {
        flex: 1;
        .quantity-detail-box{
          margin: 12px 0 0 30px;
          .quantity-title {
            margin-bottom: 2px;
            height: 20px;
            line-height: 20px;
            color: #495468;
            font-size: 14px;
            font-weight: 400;
          }
          .quantity-border-line {
            width:46px;
            height:2px;
            background:rgba(73,84,104,1);
          }
          .quantity {
            margin-top: 7px;
            height:48px;
            font-size:32px;
            color:rgba(73,84,104,1);
            line-height:38px;
            letter-spacing:2px
          }
        }
      }
      .quantity-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90px;
        height:100%;
        background:rgba(69,119,255,0.1);
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        img {
          width: 28px;
          height: 33px;
        }
      }
    }
  }
}

@media screen and (max-width: 1200px){
  .container .lin-info .lin-info-right{
    display: none;
  }
  .container .lin-info .lin-info-left{
    width: 100%;
  }
  .container .quantity-statistics .quantity-item{
    width: 32%;
    &:last-child {
      display: none;
    }
  }
  .container .information .personal{
    display: none;
  }
}

@media screen and (max-width: 1200px){
  .container .lin-info .lin-info-left{
    width: 100%;
  }
}
</style>
