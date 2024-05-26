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

// ** Type

export const getAllPaymentType = async (data: { params: TParamsGetPaymentType }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.SETTINGS.PAYMENT_TYPE.INDEX}`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const getDetailPaymentType = async (idPaymentType: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.SETTINGS.PAYMENT_TYPE.INDEX}/${idPaymentType}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const editPaymentType = async (data: TParamsEditPaymentType) => {
  const { idPaymentType, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.SETTINGS.PAYMENT_TYPE.INDEX}/${data.idPaymentType}`, rests)

    return res.data
  } catch (error) {
    return error
  }
}

export const createPaymentType = async (data: TParamsCreatePaymentType) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.SETTINGS.PAYMENT_TYPE.INDEX}`, data)

    return res.data
  } catch (error: any) {
    return error
  }
}

export const deletePaymentType = async (idPaymentType: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.SETTINGS.PAYMENT_TYPE.INDEX}/${idPaymentType}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const deleteMultiplePaymentType = async (data: TParamsDeleteManyPaymentType) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.SETTINGS.PAYMENT_TYPE.INDEX}/delete-many`, { data })

    return res.data
  } catch (error) {
    return error
  }
}
