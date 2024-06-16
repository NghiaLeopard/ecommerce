// Helper
import instanceAxios from 'src/helpers/axios'

// ** Configs
import { API_ENDPOINT } from 'src/configs/api'
import {
  TParamsCreatePaymentType,
  TParamsDeleteManyPaymentType,
  TParamsEditPaymentType,
  TParamsGetPaymentType
} from 'src/types/payment-type'
import { TCreateVnPay, TGetVnPayIpn } from 'src/types/payment'

// ** Type

export const createUrlPaymentVNPay = async (data: TCreateVnPay) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.PAYMENT.VNPAY.INDEX}/create_payment_url`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const getVNPayIpnPaymentVNPay = async (data: { params: TGetVnPayIpn }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.PAYMENT.VNPAY.INDEX}/vnpay_ipn/`, data)

    return res.data
  } catch (error) {
    return error
  }
}
