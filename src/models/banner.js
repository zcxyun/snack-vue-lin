/* eslint-disable class-methods-use-this */
import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

class Banner {
  async get(id) {
    const res = await get(`cms/banner/${id}`)
    return res
  }

  async getAll() {
    const res = await get('cms/banner/all')
    return res
  }

  async getPaginate(page = 0, count = 10, q = '') {
    const info = { page, count }
    if (q) {
      info.q = q
    }
    const res = await get('cms/banner/paginate', info)
    return res
  }

  async add(info) {
    const res = await post('cms/banner', info)
    return res
  }

  async edit(id, info) {
    const res = await put(`cms/banner/${id}`, info)
    return res
  }

  async remove(id) {
    const res = await _delete(`cms/banner/${id}`)
    return res
  }

  async hide(id) {
    const res = await put(`cms/banner/hide/${id}`)
    return res
  }

  async show(id) {
    const res = await put(`cms/banner/show/${id}`)
    return res
  }
}

export default new Banner()
