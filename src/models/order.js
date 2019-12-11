/* eslint-disable class-methods-use-this */
import {
  get,
} from '@/lin/plugins/axios'

class Order {
  async getPaginate(page = 0, count = 10, q = '') {
    const info = { page, count }
    if (q) {
      info.q = q
    }
    const res = await get('cms/order/paginate', info)
    return res
  }
}

export default new Order()
