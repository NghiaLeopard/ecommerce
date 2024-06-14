import { useTranslation } from 'react-i18next'

export const OBJECT_STAR_REVIEW = () => {
  const { t } = useTranslation()

  return {
    '0': {
      label: t('Từ 4.5 sao trở lên'),
      value: 4.5
    },
    '1': {
      label: t('Từ 4 sao trở lên'),
      value: 4
    },
    '2': {
      label: t('Từ 3.5 sao trở lên'),
      value: 3.5
    },
    '3': {
      label: t('Từ 3 sao trở lên'),
      value: 3
    },
    '4': {
      label: t('Từ 2.5 sao trở lên'),
      value: 2.5
    },
    '5': {
      label: t('Từ 2 sao trở lên'),
      value: 2
    },
    '6': {
      label: t('Từ 1.5 sao trở lên'),
      value: 1.5
    },
    '7': {
      label: t('Từ 1 sao trở lên'),
      value: 1
    }
  }
}
