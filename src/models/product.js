/* eslint-disable class-methods-use-this */
import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

class Product {
  async get(id) {
    const res = await get(`cms/product/${id}`)
    return res
  }

  async getPaginate(page = 0, count = 10, q = '') {
    const info = { page, count }
    if (q) {
      info.q = q
    }
    const res = await get('cms/product/paginate', info)
    return res
  }

  async add(info) {
    const res = await post('cms/product', info)
    return res
  }

  async edit(id, info) {
    const res = await put(`cms/product/${id}`, info)
    return res
  }

  async remove(id) {
    const res = await _delete(`cms/product/${id}`)
    return res
  }

  async hide(id) {
    const res = await put(`cms/product/hide/${id}`)
    return res
  }

  async show(id) {
    const res = await put(`cms/product/show/${id}`)
    return res
  }
}

export default new Product()
