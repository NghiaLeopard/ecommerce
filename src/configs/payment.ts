import { useTranslation } from 'react-i18next'

export const PAYMENT_TYPES = () => {
  const { t } = useTranslation()

  return {
    PAYMENT_LATER: { value: 'PAYMENT_LATER', label: t('Payment_later_type') },
    VN_PAYMENT: { value: 'VN_PAYMENT', label: t('Vn_pay_type') },
    PAYPAL: { value: 'PAYPAL', label: t('Paypal_type') }
  }
}
