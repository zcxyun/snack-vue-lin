const themeRouter = {
  route: null,
  name: null,
  title: '主题管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-gold',
  filePath: 'views/theme/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加主题',
      type: 'view',
      name: 'themeAdd',
      route: '/theme/add',
      filePath: 'views/theme/ThemeAdd.vue',
      inNav: true,
      icon: 'iconfont icon-plus-square',
    },
    {
      title: '主题列表',
      type: 'view',
      name: 'themeList',
      route: '/theme/list',
      filePath: 'views/theme/ThemeList.vue',
      inNav: true,
      icon: 'iconfont icon-detail',
    },
  ],
}

export default themeRouter
