const categoryRouter = {
  route: null,
  name: null,
  title: '分类管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-appstore',
  filePath: 'views/category/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加分类',
      type: 'view',
      name: 'categoryAdd',
      route: '/category/add',
      filePath: 'views/category/CategoryAdd.vue',
      inNav: true,
      icon: 'iconfont icon-plus-square',
      right: ['创建分类'],
    },
    {
      title: '分类列表',
      type: 'view',
      name: 'categoryList',
      route: '/category/list',
      filePath: 'views/category/CategoryList.vue',
      inNav: true,
      icon: 'iconfont icon-detail',
      right: ['分页查询所有分类'],
    },
  ],
}

export default categoryRouter
