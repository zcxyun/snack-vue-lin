/* eslint-disable class-methods-use-this */
import _ from 'lodash'
import {
  post,
  get,
} from '@/lin/plugins/axios'

class Stat {
  async getDateSection() {
    const dateSection = await get('cms/stat/date/section', { handleError: true })
    return dateSection
  }

  async stat(date_str) {
    const res = await post('cms/stat', { date_str }).catch(() => {})
    return res
  }

  // 近一月数据
  async dashboard() {
    const res = await get('cms/stat/dashboard').catch(() => {})
    if (res) {
      const dates = res.map(item => item.date)

      const prices = res.map(item => parseFloat(item.price_str))
      const totalPrice = _.maxBy(res, 'total_price_str').total_price_str

      const orderCounts = res.map(item => item.order_count)
      const monthOrderCount = _.sum(orderCounts)
      const totalOrderCount = _.maxBy(res, 'total_order_count').total_order_count

      const memberCounts = res.map(item => item.member_count)
      const monthMemberCount = _.sum(memberCounts)
      const totalMemberCount = _.maxBy(res, 'total_member_count').total_member_count

      const accesses = res.map(item => item.access)
      const monthAccess = _.sum(accesses)
      const totalAccess = _.maxBy(res, 'total_access').total_access
      return {
        dates,
        prices,
        totalPrice,
        orderCounts,
        monthOrderCount,
        totalOrderCount,
        memberCounts,
        monthMemberCount,
        totalMemberCount,
        accesses,
        monthAccess,
        totalAccess,
      }
    }
  }
}

export default new Stat()
