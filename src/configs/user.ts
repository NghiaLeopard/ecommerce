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
