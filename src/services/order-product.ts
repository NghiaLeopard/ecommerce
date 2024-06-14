// Helper
import instanceAxios from 'src/helpers/axios'

// ** Configs
import { API_ENDPOINT } from 'src/configs/api'

import {
  TCreateOrderProduct,
  TItemOrderCMS,
  TParamsGetOrderCMS,
  TParamsGetOrderMe,
  TUpdateOrderProduct
} from 'src/types/order-product'

export const getAllOrderMe = async (data: { params: TParamsGetOrderMe }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/me`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const cancelOrderProductMe = async (orderId: string) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/me/cancel/${orderId}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const getDetailOrderMe = async (orderId: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/me/${orderId}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const getAllOrderProducts = async (data: { params: TParamsGetOrderCMS }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const getOrderProductsDetail = async (orderId: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/${orderId}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const updateOrderProducts = async (data: TUpdateOrderProduct) => {
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/${data._id}`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const deleteOrderProducts = async (orderId: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/${orderId}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const createOrderProducts = async (data: TCreateOrderProduct) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}`, data)

    return res.data
  } catch (error: any) {
    return error
  }
}
