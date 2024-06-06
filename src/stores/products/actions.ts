// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Services
import {
  createProducts,
  deleteMultipleProducts,
  deleteProducts,
  editProducts,
  getAllProducts,
  getListProductsLiked,
  getListProductsViewed,
  likeProduct,
  unLikeProduct
} from 'src/services/products'

// ** Types
import {
  TActionProduct,
  TParamsCreateProducts,
  TParamsDeleteManyProducts,
  TParamsEditProducts,
  TParamsGetProducts,
  TParamsGetProductsLiked,
  TParamsGetProductsViewed
} from 'src/types/products'

export const serviceName = 'Products'

export const getAllProductsAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetProducts }) => {
    const response = await getAllProducts(data)

    return response
  }
)

export const getListProductsLikedAsync = createAsyncThunk(
  `${serviceName}/get-product-liked`,
  async (data: { params: TParamsGetProductsLiked }) => {
    const response = await getListProductsLiked(data)

    return response
  }
)

export const getListProductsViewedAsync = createAsyncThunk(
  `${serviceName}/get-product-view`,
  async (data: { params: TParamsGetProductsViewed }) => {
    const response = await getListProductsViewed(data)

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
    return {
      data: {
        _id: 1
      },
      message: response?.message,
      typeError: response?.typeError
    }
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
    return {
      data: {
        _id: 1
      },
      message: response?.message,
      typeError: response?.typeError
    }
  }

  return {
    data: {
      _id: null
    },
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})
