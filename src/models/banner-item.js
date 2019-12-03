/* eslint-disable class-methods-use-this */
import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

class BannerItem {
  async get(id) {
    const res = await get(`cms/banner-item/${id}`)
    return res
  }

  async getAllTypes() {
    const res = await get('cms/banner-item/types')
    return res
  }

  async getPaginate(page = 0, count = 10, q = '', type = 0) {
    const info = { page, count, type }
    if (q) {
      info.q = q
    }
    const res = await get('cms/banner-item/paginate', info)
    return res
  }

  async add(info) {
    const res = await post('cms/banner-item', info)
    return res
  }

  async edit(id, info) {
    const res = await put(`cms/banner-item/${id}`, info)
    return res
  }

  async remove(id) {
    const res = await _delete(`cms/banner-item/${id}`)
    return res
  }

  async hide(id) {
    const res = await put(`cms/banner-item/hide/${id}`)
    return res
  }

  async show(id) {
    const res = await put(`cms/banner-item/show/${id}`)
    return res
  }
}

export default new BannerItem()
