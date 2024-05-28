// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Products
import {
  createProducts,
  deleteMultipleProducts,
  deleteProducts,
  editProducts,
  getAllProducts
} from 'src/services/products'
import {
  TParamsCreateProducts,
  TParamsDeleteManyProducts,
  TParamsEditProducts,
  TParamsGetProducts
} from 'src/types/products'

// ** Type

export const serviceName = 'Products'

export const getAllProductsAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetProducts }) => {
    const response = await getAllProducts(data)

    return response
  }
)

export const editProductsAsync = createAsyncThunk(`${serviceName}/edit`, async (data: TParamsEditProducts) => {
  const response = await editProducts(data)

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

export const createProductsAsync = createAsyncThunk(`${serviceName}/create`, async (data: TParamsCreateProducts) => {
  const response = await createProducts(data)

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

export const deleteProductsAsync = createAsyncThunk(`${serviceName}/delete`, async (idProducts: string) => {
  const response = await deleteProducts(idProducts)

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

export const deleteMultipleProductsAsync = createAsyncThunk(
  `${serviceName}/delete-many`,
  async (data: TParamsDeleteManyProducts) => {
    const response = await deleteMultipleProducts(data)

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
