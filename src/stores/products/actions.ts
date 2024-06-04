// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Services
import {
  createProducts,
  deleteMultipleProducts,
  deleteProducts,
  editProducts,
  getAllProducts,
  likeProduct,
  unLikeProduct
} from 'src/services/products'

// ** Types
import {
  TActionProduct,
  TParamsCreateProducts,
  TParamsDeleteManyProducts,
  TParamsEditProducts,
  TParamsGetProducts
} from 'src/types/products'

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

export const likeProductAsync = createAsyncThunk(`${serviceName}/like-product`, async (data: TActionProduct) => {
  const response = await likeProduct(data)

  if (response?.message) {
    return response?.response?.data
  }

  return {
    data: {
      _id: null
    },
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})
export const unLikeProductAsync = createAsyncThunk(`${serviceName}/unlike-product`, async (data: TActionProduct) => {
  const response = await unLikeProduct(data)

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
})
