// Helper
import instanceAxios from 'src/helpers/axios'

// ** Configs
import { API_ENDPOINT } from 'src/configs/api'
import {
  TParamsCreateDeliveryType,
  TParamsDeleteManyDeliveryType,
  TParamsEditDeliveryType,
  TParamsGetDeliveryType
} from 'src/types/delivery-type'

// ** Type

export const getAllDeliveryType = async (data: { params: TParamsGetDeliveryType }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.SETTINGS.DELIVERY_TYPE.INDEX}`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const getDetailDeliveryType = async (idDeliveryType: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.SETTINGS.DELIVERY_TYPE.INDEX}/${idDeliveryType}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const editDeliveryType = async (data: TParamsEditDeliveryType) => {
  const { idDeliveryType, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.SETTINGS.DELIVERY_TYPE.INDEX}/${data.idDeliveryType}`, rests)

    return res.data
  } catch (error) {
    return error
  }
}

export const createDeliveryType = async (data: TParamsCreateDeliveryType) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.SETTINGS.DELIVERY_TYPE.INDEX}`, data)

    return res.data
  } catch (error: any) {
    return error
  }
}

export const deleteDeliveryType = async (idDeliveryType: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.SETTINGS.DELIVERY_TYPE.INDEX}/${idDeliveryType}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const deleteMultipleDeliveryType = async (data: TParamsDeleteManyDeliveryType) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.SETTINGS.DELIVERY_TYPE.INDEX}/delete-many`, { data })

    return res.data
  } catch (error) {
    return error
  }
}
