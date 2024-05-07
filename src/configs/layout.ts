import { useTranslation } from 'react-i18next'
import { CONFIG_ROUTE } from './route'

export const VerticalItems = () => {
  const { t } = useTranslation()

  return [
    {
      title: t('system'),
      icon: 'eos-icons:file-system',
      children: [
        {
          title: t('user'),
          icon: 'solar:users-group-rounded-bold-duotone',
          path: CONFIG_ROUTE.SYSTEM.USER
        },
        {
          title: t('role'),
          icon: 'icon-park-outline:permissions',
          path: CONFIG_ROUTE.SYSTEM.ROLE
        }
      ]
    },
    {
      title: t('manage-product'),
      icon: 'eos-icons:products-outlined',
      children: [
        {
          title: t('list-product'),
          icon: 'fluent-mdl2:product',
          path: CONFIG_ROUTE.MANAGE_PRODUCT.MANAGE_PRODUCT
        },
        {
          title: t('category-product'),
          icon: 'material-symbols:category-outline',
          path: CONFIG_ROUTE.MANAGE_PRODUCT.MANAGE_TYPE_PRODUCT
        },
        {
          title: t('list-order'),
          icon: 'lets-icons:order-fill',
          path: CONFIG_ROUTE.MANAGE_PRODUCT.MANAGE_ORDER
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
