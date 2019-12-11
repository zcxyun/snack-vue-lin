const orderRouter = {
  route: null,
  name: null,
  title: '订单管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-snippets',
  filePath: 'views/order/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '订单列表',
      type: 'view',
      name: 'orderList',
      route: '/order/list',
      filePath: 'views/order/OrderList.vue',
      inNav: true,
      icon: 'iconfont icon-detail',
    },
  ],
}

export default orderRouter
