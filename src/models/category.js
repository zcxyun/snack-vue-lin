/* eslint-disable class-methods-use-this */
import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

class Category {
  async get(id) {
    const res = await get(`cms/category/${id}`)
    return res
  }

  async getAll() {
    const res = await get('cms/category/all')
    return res
  }

  async getPaginate(page = 0, count = 10, q = '') {
    const info = { page, count }
    if (q) {
      info.q = q
    }
    const res = await get('cms/category/paginate', info)
    return res
  }

  async add(info) {
    const res = await post('cms/category', info)
    return res
  }

  async edit(id, info) {
    const res = await put(`cms/category/${id}`, info)
    return res
  }

  async remove(id) {
    const res = await _delete(`cms/category/${id}`)
    return res
  }

  async hide(id) {
    const res = await put(`cms/category/hide/${id}`)
    return res
  }

  async show(id) {
    const res = await put(`cms/category/show/${id}`)
    return res
  }
}

export default new Category()
