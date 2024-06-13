// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'
import { cancelOrderProductMe, createOrderProducts, getAllOrderMe, getAllOrderProducts } from 'src/services/order-product'

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
import { TCreateOrderProduct, TParamsGetOrderCMS, TParamsGetOrderMe } from 'src/types/order-product'

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

export const cancelOrderProductMeAsync = createAsyncThunk(`${serviceName}/delete`, async (orderId: string) => {
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

// export const deleteMultipleProductsAsync = createAsyncThunk(
//   `${serviceName}/delete-many`,
//   async (data: TParamsDeleteManyProducts) => {
//     const response = await deleteMultipleProducts(data)

//     if (response?.message) {
//       return response
//     }

//     return {
//       data: {
//         _id: null
//       },
//       message: response?.response?.data?.message,
//       typeError: response?.response?.data?.typeError
//     }
//   }
// )
