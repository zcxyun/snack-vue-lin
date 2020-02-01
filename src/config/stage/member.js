const memberRouter = {
  route: null,
  name: null,
  title: '会员管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-user',
  filePath: 'views/member/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '会员列表',
      type: 'view',
      name: 'memberList',
      route: '/member/list',
      filePath: 'views/member/MemberList.vue',
      inNav: true,
      icon: 'iconfont icon-detail',
      right: ['分页查询所有C端会员'],
    },
    {
      title: '收货地址列表',
      type: 'view',
      name: 'memberAdressList',
      route: '/member/address/list',
      filePath: 'views/member/MemberAddressList.vue',
      inNav: true,
      icon: 'iconfont icon-location',
      right: ['分页查询C端会员收货地址'],
    },
  ],
}

export default memberRouter
