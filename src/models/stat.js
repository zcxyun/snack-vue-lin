/* eslint-disable class-methods-use-this */
import _ from 'lodash'
import {
  post,
  get,
} from '@/lin/plugins/axios'
import { formatDate } from '@/libs/utils.js'

class Stat {
  async getDateSectionForAll() {
    const dateSection = await get('cms/stat/date/section/for/all', { handleError: true })
    return dateSection
  }

  async statAll(date_str) {
    const res = await post('cms/stat/all', { date_str }).catch(() => {})
    return res
  }

  // 近一月数据
  async dashboard() {
    const res = await get('cms/stat/dashboard').catch(() => { })
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

  async getOrder(dateFrom, dateTo) {
    const [date_from, date_to] = this.getDateSection(dateFrom, dateTo)
    const res = await get('cms/stat/all', { date_from, date_to }).catch(() => {})
    if (res) {
      const dates = res.map(item => item.date)
      const prices = res.map(item => parseFloat(item.price_str))
      const orderCounts = res.map(item => item.order_count)
      return {
        dates,
        prices,
        orderCounts,
      }
    }
  }

  async getMemberAndAccess(dateFrom, dateTo) {
    const [date_from, date_to] = this.getDateSection(dateFrom, dateTo)
    const res = await get('cms/stat/all', { date_from, date_to }).catch(() => { })
    if (res) {
      const dates = res.map(item => item.date)
      const accesses = res.map(item => item.access)
      const memberCounts = res.map(item => item.member_count)
      return {
        dates,
        accesses,
        memberCounts,
      }
    }
  }

  // 暂不用
  // async statMember(date_str) {
  //   const res = await post('cms/stat/member', { date_str }).catch(() => {})
  //   return res
  // }

  // 暂不用
  // async getMember(member_id, date_from, date_to) {
  //   const res = await get(`cms/stat/member/${member_id}`, { date_from, date_to }).catch(() => {})
  //   return res
  // }

  async getDateSectionForProduct() {
    const dateSection = await get('cms/stat/date/section/for/product', { handleError: true })
    return dateSection
  }

  async statProduct(date_str) {
    const res = await post('cms/stat/product', { date_str }).catch(() => {})
    return res
  }

  async getProduct(product_id, dateFrom, dateTo) {
    const [date_from, date_to] = this.getDateSection(dateFrom, dateTo)
    const res = await get(`cms/stat/product/${product_id}`, { date_from, date_to }).catch(() => {})
    if (res) {
      const dates = res.map(item => item.date)
      const prices = res.map(item => parseFloat(item.total_price_str))
      const counts = res.map(item => item.total_count)
      return {
        dates,
        prices,
        counts,
      }
    }
  }

  getDateSection(dateFrom, dateTo) {
    if (!dateFrom && !dateTo) {
      const now = new Date()
      dateTo = formatDate(now) // eslint-disable-line
      now.setHours(now.getHours() - (7 * 24))
      dateFrom = formatDate(now)  // eslint-disable-line
    }
    if (dateFrom && dateTo) {
      dateFrom = formatDate(new Date(dateFrom)) // eslint-disable-line
      dateTo = formatDate(new Date(dateTo)) // eslint-disable-line
    } else {
      console.error('开始日期或结束日期不存在')
    }
    return [dateFrom, dateTo]
  }
}

export default new Stat()
