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
  {
    name: '发货', func: 'operateOne', type: 'primary'
  },
  {
    name: '详情', func: 'operateTwo', type: 'danger'
  },
]
