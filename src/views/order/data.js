export const tableColumn = [  // eslint-disable-line
  {
    prop: 'member_avatarurl', label: '头像', isImage: true, width: 60,
  },
  {
    prop: 'member_name', label: '会员名', isText: true,
  },
  {
    prop: 'order_no', label: '订单号', isText: true,
  },
  {
    prop: 'total_price_str', label: '总价', isText: true,
  },
  {
    prop: 'total_count', label: '总数', isText: true,
  },
  {
    prop: 'order_status_desc', label: '订单状态', isTag: true,
  },
  {
    prop: 'pay_time_format', label: '支付时间', isText: true,
  },
  {
    prop: 'create_time_str', label: '创建时间', isText: true,
  },
]

export const customOperateList = [
  { name: '发货', func: 'operateOne', type: 'primary' },
  { name: '详情', func: 'operateTwo', type: 'danger' },
]

export const addressColumns = [
  { prop: 'userName', label: '收获人姓名' },
  { prop: 'telNumber', label: '收获人电话' },
  { prop: 'postalCode', label: '邮编' },
  { prop: 'nationalCode', label: '国家码' },
  { prop: 'provinceName', label: '省' },
  { prop: 'cityName', label: '市' },
  { prop: 'countyName', label: '县' },
  { prop: 'detailInfo', label: '详细地址' },
]

export const productColumns = [
  { prop: 'name', label: '商品名' },
  { prop: 'image', label: '图片', isImage: true },
  { prop: 'price_str', label: '价格' },
  { prop: 'old_price_str', label: '原价' },
  { prop: 'count', label: '数量' },
  { prop: 'total_price_str', label: '总价' },
  { prop: 'old_total_price_str', label: '原总价' },
]
