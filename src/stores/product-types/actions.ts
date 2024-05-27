// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** ProductTypes
import {
  createProductTypes,
  deleteMultipleProductTypes,
  deleteProductTypes,
  editProductTypes,
  getAllProductTypes
} from 'src/services/product-types'
import {
  TParamsCreateProductTypes,
  TParamsDeleteManyProductTypes,
  TParamsEditProductTypes,
  TParamsGetProductTypes
} from 'src/types/product-types'

// ** Type

export const serviceName = 'ProductTypes'

export const getAllProductTypesAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetProductTypes }) => {
    const response = await getAllProductTypes(data)

    return response
  }
)

export const editProductTypesAsync = createAsyncThunk(`${serviceName}/edit`, async (data: TParamsEditProductTypes) => {
  const response = await editProductTypes(data)

  if (response?.data) {
    return response
  }

  return {
    data: {
      _id: null
    },
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})

export const createProductTypesAsync = createAsyncThunk(
  `${serviceName}/create`,
  async (data: TParamsCreateProductTypes) => {
    const response = await createProductTypes(data)

    if (response?.data) {
      return response
    }

    return {
      data: {
        _id: null
      },
      message: response?.response?.data?.message,
      typeError: response?.response?.data?.typeError
    }
  }
)

export const deleteProductTypesAsync = createAsyncThunk(`${serviceName}/delete`, async (idProductTypes: string) => {
  const response = await deleteProductTypes(idProductTypes)

  if (response?.data) {
    return response
  }

  return {
    data: {
      _id: null
    },
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})

export const deleteMultipleProductTypesAsync = createAsyncThunk(
  `${serviceName}/delete-many`,
  async (data: TParamsDeleteManyProductTypes) => {
    const response = await deleteMultipleProductTypes(data)

    if (response?.message) {
      return response
    }

    return {
      data: {
        _id: null
      },
      message: response?.response?.data?.message,
      typeError: response?.response?.data?.typeError
    }
  }
)
