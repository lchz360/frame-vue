/**
 * {
 *  title: { String|Number }
 *         显示在侧边栏、面包屑和标签栏的文字
 *  icon: (-) 该页面在左侧菜单处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  to: { String|Object }跳转链接，可传入router-link支持的任何参数
 *  target:(-) 原生a标签的target属性
 * }
 */

export default [
  {
    title: '权限设置',
    icon: 'ios-cog',
    children: [
      { title: '管理员设置', to: '/admin' },
      { title: '用户角色', to: '/auth_group'  }
    ]
  },
]
