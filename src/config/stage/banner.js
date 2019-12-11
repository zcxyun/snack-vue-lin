
const bannerRouter = {
  route: null,
  name: null,
  title: '横幅管理',
  type: 'folder',
  icon: 'iconfont icon-pic-center',
  filePath: 'views/banner/',
  order: null,
  inNav: true,
  children: [
    {
      route: '/banner/list',
      name: null,
      title: '主类管理',
      type: 'tab', // 取 route 为默认加载页
      icon: 'iconfont icon-pic-left',
      filePath: 'views/banner/BannerList.vue',
      inNav: true,
      children: [
        {
          title: '横幅列表',
          type: 'view',
          name: 'bannerList',
          route: '/banner/list',
          filePath: 'views/banner/BannerList.vue',
          inNav: true,
          icon: 'iconfont icon-detail',
        },
        {
          title: '添加横幅',
          type: 'view',
          inNav: true,
          route: '/banner/add',
          icon: 'iconfont icon-plus-square',
          name: 'bannerAdd',
          filePath: 'views/banner/BannerAdd.vue',
        },
      ],
    },
    {
      route: '/banner-item/list',
      name: null,
      title: '子类管理',
      type: 'tab', // 取 route 为默认加载页
      icon: 'iconfont icon-pic-right',
      filePath: 'views/banner-item/BannerItemList.vue',
      inNav: true,
      children: [
        {
          route: '/banner-item/list',
          type: 'view',
          name: 'bannerItemList',
          inNav: true,
          filePath: 'views/banner-item/BannerItemList.vue',
          title: '横幅子类列表',
          icon: 'iconfont icon-detail',
        },
        {
          route: '/banner-item/add',
          type: 'view',
          name: 'bannerItemAdd',
          filePath: 'views/banner-item/BannerItemAdd.vue',
          inNav: true,
          title: '添加横幅子类',
          icon: 'iconfont icon-plus-square',
        },
      ],
    },
  ],
}

export default bannerRouter
