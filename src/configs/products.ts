import { useTranslation } from 'react-i18next'

export const OBJECT_STATUS_PRODUCTS = () => {
  const { t } = useTranslation()

  return {
    '0': {
      label: t('Public'),
      value: '1'
    },
    '1': {
      label: t('Private'),
      value: '0'
    }
  }
}
