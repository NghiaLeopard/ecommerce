// Helper
import instanceAxios from 'src/helpers/axios'

// ** Configs
import { API_ENDPOINT } from 'src/configs/api'
import {
  TParamsCreateProducts,
  TParamsDeleteManyProducts,
  TParamsEditProducts,
  TParamsGetProducts
} from 'src/types/products'

// ** Type

export const getAllProducts = async (data: { params: TParamsGetProducts }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCTS.INDEX}`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const getDetailProducts = async (idProducts: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCTS.INDEX}/${idProducts}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const editProducts = async (data: TParamsEditProducts) => {
  const { idProducts, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCTS.INDEX}/${data.idProducts}`, rests)

    return res.data
  } catch (error) {
    return error
  }
}

export const createProducts = async (data: TParamsCreateProducts) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCTS.INDEX}`, data)

    return res.data
  } catch (error: any) {
    return error
  }
}

export const deleteProducts = async (idProducts: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCTS.INDEX}/${idProducts}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const deleteMultipleProducts = async (data: TParamsDeleteManyProducts) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCTS.INDEX}/delete-many`, { data })

    return res.data
  } catch (error) {
    return error
  }
}