import { useTranslation } from 'react-i18next'

export const OBJECT_STATUS_USER = () => {
  const { t } = useTranslation()

  return {
    '0': {
      label: t('Active'),
      value: '1'
    },
    '1': {
      label: t('Blocking'),
      value: '0'
    }
  }
}

export const OBJECT_TYPE_USER = () => {
  const { t } = useTranslation()

  return {
    '0': {
      label: t('Facebook'),
      value: 1
    },
    '1': {
      label: t('Google'),
      value: 2
    },
    '2': {
      label: t('Gmail'),
      value: 3
    }
  }
}
