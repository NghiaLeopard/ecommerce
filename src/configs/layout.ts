// ** React
import { useTranslation } from 'react-i18next'

// ** Config
import { CONFIG_ROUTE } from './route'
import { CONFIG_PERMISSIONS } from './permission'

export const VerticalItems = () => {
  const { t } = useTranslation()

  return [
    {
      title: t('dashboard'),
      icon: 'eos-icons:file-system',
      path: CONFIG_ROUTE.DASHBOARD,
      permissions: CONFIG_PERMISSIONS.DASHBOARD
    },
    {
      title: t('system'),
      icon: 'eos-icons:file-system',
      path: '/system',
      children: [
        {
          title: t('user'),
          icon: 'solar:users-group-rounded-bold-duotone',
          path: CONFIG_ROUTE.SYSTEM.USER,
          permissions: CONFIG_PERMISSIONS.SYSTEM.USER.VIEW
        },
        {
          title: t('role'),
          icon: 'icon-park-outline:permissions',
          path: CONFIG_ROUTE.SYSTEM.ROLE,
          permissions: CONFIG_PERMISSIONS.SYSTEM.ROLE.VIEW
        }
      ]
    },
    {
      title: t('manage-product'),
      icon: 'eos-icons:products-outlined',
      path: '/manage-product',

      children: [
        {
          title: t('list-product'),
          icon: 'fluent-mdl2:product',
          path: CONFIG_ROUTE.MANAGE_PRODUCT.MANAGE_PRODUCT,
          permissions: CONFIG_PERMISSIONS.MANAGE_PRODUCT.PRODUCT.VIEW
        },
        {
          title: t('category-product'),
          icon: 'material-symbols:category-outline',
          path: CONFIG_ROUTE.MANAGE_PRODUCT.MANAGE_TYPE_PRODUCT
        }
      ]
    },
    {
      title: t('manage-order'),
      icon: 'carbon:order-details',
      path: '/manage-order',

      children: [
        {
          title: t('list-order'),
          icon: 'lets-icons:order-fill',
          path: CONFIG_ROUTE.MANAGE_PRODUCT.MANAGE_ORDER,
          permissions: CONFIG_PERMISSIONS.MANAGE_ORDER.ORDER.VIEW
        },
        {
          title: t('list-review'),
          icon: 'material-symbols:reviews-outline',
          path: CONFIG_ROUTE.MANAGE_PRODUCT.MANAGE_REVIEWS
        }
      ]
    },
    {
      title: t('setting'),
      icon: 'uil:setting',
      path: '/setting',
      children: [
        {
          title: t('setting-city'),
          icon: 'solar:city-bold',
          path: CONFIG_ROUTE.SETTINGS.CITY
        },
        {
          title: t('method-delivery'),
          icon: 'carbon:delivery',
          path: CONFIG_ROUTE.SETTINGS.DELIVERY_TYPE
        },
        {
          title: t('method-payment'),
          icon: 'streamline:payment-10',
          path: CONFIG_ROUTE.SETTINGS.PAYMENT_TYPE
        }
      ]
    }
  ]
}
