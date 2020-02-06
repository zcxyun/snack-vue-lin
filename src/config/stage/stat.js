const statRouter = {
  route: null,
  name: null,
  title: '统计管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tongji1',
  filePath: 'views/stat/', // 文件路径
  order: null,
  inNav: true,
  right: ['超级管理员独有权限'],
  children: [
    {
      title: '订单统计',
      type: 'view',
      name: 'orderStat',
      route: '/stat/order',
      filePath: 'views/stat/OrderStat.vue',
      inNav: true,
      icon: 'iconfont icon-plus-square',
    },
    {
      title: '会员统计',
      type: 'view',
      name: 'memberStat',
      route: '/stat/member',
      filePath: 'views/stat/MemberStat.vue',
      inNav: true,
      icon: 'iconfont icon-detail',
    },
    {
      title: '商品统计',
      type: 'view',
      name: 'productStat',
      route: '/stat/product',
      filePath: 'views/stat/ProductStat.vue',
      inNav: true,
      icon: 'iconfont icon-detail',
    },
  ],
}

export default statRouter
