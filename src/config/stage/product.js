const productRouter = {
  route: null,
  name: null,
  title: '产品管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-shopping',
  filePath: 'views/product/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加产品',
      type: 'view',
      name: 'productAdd',
      route: '/product/add',
      filePath: 'views/product/ProductAdd.vue',
      inNav: true,
      icon: 'iconfont icon-plus-square',
      right: ['创建商品'],
    },
    {
      title: '产品列表',
      type: 'view',
      name: 'productList',
      route: '/product/list',
      filePath: 'views/product/ProductList.vue',
      inNav: true,
      icon: 'iconfont icon-detail',
      right: ['分页查询所有商品'],
    },
  ],
}

export default productRouter
