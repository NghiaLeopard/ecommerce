// Helper
import instanceAxios from 'src/helpers/axios'

// ** Configs
import { API_ENDPOINT } from 'src/configs/api'
import {
  TParamsCreateProductTypes,
  TParamsDeleteManyProductTypes,
  TParamsEditProductTypes,
  TParamsGetProductTypes
} from 'src/types/product-types'

// ** Type

export const getAllProductTypes = async (data: { params: TParamsGetProductTypes }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT_TYPES.INDEX}`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const getDetailProductTypes = async (idProductTypes: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT_TYPES.INDEX}/${idProductTypes}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const editProductTypes = async (data: TParamsEditProductTypes) => {
  const { idProductTypes, ...rests } = data
  try {
    const res = await instanceAxios.put(
      `${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT_TYPES.INDEX}/${data.idProductTypes}`,
      rests
    )

    return res.data
  } catch (error) {
    return error
  }
}

export const createProductTypes = async (data: TParamsCreateProductTypes) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT_TYPES.INDEX}`, data)

    return res.data
  } catch (error: any) {
    return error
  }
}

export const deleteProductTypes = async (idProductTypes: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT_TYPES.INDEX}/${idProductTypes}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const deleteMultipleProductTypes = async (data: TParamsDeleteManyProductTypes) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT_TYPES.INDEX}/delete-many`, { data })

    return res.data
  } catch (error) {
    return error
  }
}
