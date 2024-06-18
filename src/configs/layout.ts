// ** React
import { useTranslation } from 'react-i18next'

// ** Config
import { CONFIG_ROUTE } from './route'
import { CONFIG_PERMISSIONS } from './permission'

export const VerticalItems = () => {
  const { t } = useTranslation()

  return [
    {
      title: t('Dashboard'),
      icon: 'material-symbols:dashboard-outline',
      path: CONFIG_ROUTE.DASHBOARD,
      permissions: CONFIG_PERMISSIONS.DASHBOARD
    },
    {
      title: t('System'),
      icon: 'eos-icons:file-system',
      path: '/system',
      children: [
        {
          title: t('User'),
          icon: 'solar:users-group-rounded-bold-duotone',
          path: CONFIG_ROUTE.SYSTEM.USER,
          permissions: CONFIG_PERMISSIONS.SYSTEM.USER.VIEW
        },
        {
          title: t('Role'),
          icon: 'icon-park-outline:permissions',
          path: CONFIG_ROUTE.SYSTEM.ROLE,
          permissions: CONFIG_PERMISSIONS.SYSTEM.ROLE.VIEW
        }
      ]
    },
    {
      title: t('Manage_product'),
      icon: 'eos-icons:products-outlined',
      path: '/manage-product',

      children: [
        {
          title: t('List_product'),
          icon: 'fluent-mdl2:product',
          path: CONFIG_ROUTE.MANAGE_PRODUCT.PRODUCT,
          permissions: CONFIG_PERMISSIONS.MANAGE_PRODUCT.PRODUCT.VIEW
        },
        {
          title: t('Type_product'),
          icon: 'material-symbols:category-outline',
          path: CONFIG_ROUTE.MANAGE_PRODUCT.TYPE_PRODUCT
        },
        {
          title: t('Comment'),
          icon: 'material-symbols:comment-outline',
          path: CONFIG_ROUTE.MANAGE_PRODUCT.COMMENT
        }
      ]
    },
    {
      title: t('Manage_order'),
      icon: 'carbon:order-details',
      path: '/manage-order',

      children: [
        {
          title: t('List_order'),
          icon: 'lets-icons:order-fill',
          path: CONFIG_ROUTE.MANAGE_ORDER.ORDER,
          permissions: CONFIG_PERMISSIONS.MANAGE_ORDER.ORDER.VIEW
        },
        {
          title: t('List_review'),
          icon: 'material-symbols:reviews-outline',
          path: CONFIG_ROUTE.MANAGE_ORDER.REVIEWS
        }
      ]
    },
    {
      title: t('Setting'),
      icon: 'uil:setting',
      path: '/setting',
      children: [
        {
          title: t('Setting_city'),
          icon: 'solar:city-bold',
          path: CONFIG_ROUTE.SETTINGS.CITY
        },
        {
          title: t('Method_delivery'),
          icon: 'carbon:delivery',
          path: CONFIG_ROUTE.SETTINGS.DELIVERY_TYPE
        },
        {
          title: t('Method_payment'),
          icon: 'streamline:payment-10',
          path: CONFIG_ROUTE.SETTINGS.PAYMENT_TYPE
        }
      ]
    }
  ]
}
