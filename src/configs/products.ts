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

export const OBJECT_STAR_PRODUCT = () => {
  const { t } = useTranslation()

  return {
    '0': {
      label: t('Từ 4.5 sao trở xuống'),
      value: 4.5
    },
    '1': {
      label: t('Từ 4 sao trở xuống'),
      value: 4
    },
    '2': {
      label: t('Từ 3.5 sao trở xuống'),
      value: 3.5
    },
    '3': {
      label: t('Từ 3 sao trở xuống'),
      value: 3
    }
  }
}
