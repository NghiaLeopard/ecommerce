import { CONFIG_ROUTE } from './route'

export const VerticalItems = [
  {
    title: 'Hệ thống',
    icon: 'eos-icons:file-system',
    children: [
      {
        title: 'Người dùng',
        icon: 'solar:users-group-rounded-bold-duotone',
        path: CONFIG_ROUTE.SYSTEM.USER
      },
      {
        title: 'Nhóm vai trò',
        icon: 'icon-park-outline:permissions',
        path: CONFIG_ROUTE.SYSTEM.ROLE
      }
    ]
  },
  {
    title: 'Quản trị sản phẩm',
    icon: 'eos-icons:products-outlined',
    children: [
      {
        title: 'Danh sách sản phẩm',
        icon: 'fluent-mdl2:product',
        path: CONFIG_ROUTE.MANAGE_PRODUCT.MANAGE_PRODUCT
      },
      {
        title: 'Danh mục sản phẩm',
        icon: 'material-symbols:category-outline',
        path: CONFIG_ROUTE.MANAGE_PRODUCT.MANAGE_TYPE_PRODUCT
      },
      {
        title: 'Danh sách đơn hàng',
        icon: 'lets-icons:order-fill',
        path: CONFIG_ROUTE.MANAGE_PRODUCT.MANAGE_ORDER
      },
      {
        title: 'Danh sách đánh giá',
        icon: 'material-symbols:reviews-outline',
        path: CONFIG_ROUTE.MANAGE_PRODUCT.MANAGE_REVIEWS
      }
    ]
  },
  {
    title: 'Cài đặt',
    icon: 'uil:setting',
    children: [
      {
        title: 'Cài đặt thành phố',
        icon: 'solar:city-bold',
        path: CONFIG_ROUTE.SETTINGS.CITY
      },
      {
        title: 'Phương thức giao hàng',
        icon: 'carbon:delivery',
        path: CONFIG_ROUTE.SETTINGS.DELIVERY_TYPE
      },
      {
        title: 'Phương thức thanh toán',
        icon: 'streamline:payment-10',
        path: CONFIG_ROUTE.SETTINGS.PAYMENT_TYPE
      }
    ]
  }
]
