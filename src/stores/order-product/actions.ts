// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  cancelOrderProductMe,
  createOrderProducts,
  deleteOrderProducts,
  getAllOrderMe,
  getAllOrderProducts,
  updateOrderProducts
} from 'src/services/order-product'

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
import { TCreateOrderProduct, TParamsGetOrderCMS, TParamsGetOrderMe, TUpdateOrderProduct } from 'src/types/order-product'

// ** Types

export const serviceName = 'orderProduct'

export const getAllOrderMeAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetOrderMe }) => {
    const response = await getAllOrderMe(data)

    return response
  }
)

export const getAllOrderCMSAsync = createAsyncThunk(
  `${serviceName}/get-all-CMS`,
  async (data: { params: TParamsGetOrderCMS }) => {
    const response = await getAllOrderProducts(data)

    return response
  }
)

export const createOrderProductsAsync = createAsyncThunk(`${serviceName}/create`, async (data: TCreateOrderProduct) => {
  const response = await createOrderProducts(data)

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
export const UpdateOrderProductsAsync = createAsyncThunk(`${serviceName}/update`, async (data: TUpdateOrderProduct) => {
  const response = await updateOrderProducts(data)

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

export const cancelOrderProductMeAsync = createAsyncThunk(`${serviceName}/cancel`, async (orderId: string) => {
  const response = await cancelOrderProductMe(orderId)

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

export const deleteOrderProductsAsync = createAsyncThunk(`${serviceName}/delete`, async (orderId: string) => {
  const response = await deleteOrderProducts(orderId)

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
