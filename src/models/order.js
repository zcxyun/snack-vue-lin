/* eslint-disable class-methods-use-this */
import {
  get,
  post,
} from '@/lin/plugins/axios'

class Order {
  async getPaginate(page = 0, count = 10, q = '', orderStatus = '', dateStart = '', dateEnd = '') {
    const info = { page, count }
    if (q) {
      info.q = q
    }
    if (dateStart && dateEnd) {
      info.date_start = dateStart
      info.date_end = dateEnd
    }
    if (['-1', '0', '1', '2', '3'].includes(orderStatus)) {
      info.order_status = orderStatus
    }
    const res = await get('cms/order/paginate', info)
    return res
  }

  async delivery(member_id, order_id) {
    const res = await post('cms/order/delivery', { member_id, order_id })
    return res
  }

  async getAllOrderStatus() {
    const res = await get('cms/order/all/order_status')
    return res
  }
}

export default new Order()
