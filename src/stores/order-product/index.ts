// ** Redux
import { createSlice } from '@reduxjs/toolkit'
import {
  UpdateOrderProductsAsync,
  UpdateStatusOrderProductsAsync,
  cancelOrderProductMeAsync,
  createOrderProductsAsync,
  deleteOrderProductsAsync,
  getAllOrderCMSAsync,
  getAllOrderMeAsync,
  serviceName
} from './actions'

// ** Action

const initialState = {
  orderItem: [],
  orderItemProduct: [],
  totalPage: 0,
  orderItemMe: [],
  isLoading: false,
  isSuccessCreateOrderMe: false,
  isErrorCreateOrderMe: false,
  isMessageCreateOrderMe: '',
  isSuccessCancelOrderMe: false,
  isErrorCancelOrderMe: false,
  isMessageCancelOrderMe: '',
  isSuccessUpdateOrderProduct: false,
  isErrorUpdateOrderProduct: false,
  isMessageUpdateOrderProduct: '',
  isSuccessUpdateStatusOrderProduct: false,
  isErrorUpdateStatusOrderProduct: false,
  isMessageUpdateStatusOrderProduct: '',
  isSuccessDeleteOrderProduct: false,
  isErrorDeleteOrderProduct: false,
  isMessageDeleteOrderProduct: '',
  typeError: ''
}

export const cartProductSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    updateToCart(state, action) {
      state.orderItem = action.payload.orderItem
    },
    resetInitialState(state) {
      state.isLoading = false
      state.isSuccessCreateOrderMe = false
      state.isErrorCreateOrderMe = false
      state.isMessageCreateOrderMe = ''
      state.totalPage = 0
      state.typeError = ''
      state.isSuccessCancelOrderMe = false
      state.isErrorCancelOrderMe = false
      state.isMessageCancelOrderMe = ''
      state.isSuccessUpdateOrderProduct = false
      state.isErrorUpdateOrderProduct = false
      state.isMessageUpdateOrderProduct = ''
      state.isSuccessUpdateStatusOrderProduct = false
      state.isErrorUpdateStatusOrderProduct = false
      state.isMessageUpdateStatusOrderProduct = ''
      state.isSuccessDeleteOrderProduct = false
      state.isErrorDeleteOrderProduct = false
      state.isMessageDeleteOrderProduct = ''
    }
  },
  extraReducers: builder => {
    // get order product me
    builder.addCase(getAllOrderMeAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllOrderMeAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.orderItemMe = actions.payload?.data?.orders
      })

    // get order product
    builder.addCase(getAllOrderCMSAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllOrderCMSAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.orderItemProduct = actions.payload?.data?.orders
        state.totalPage = actions.payload?.data?.totalPage
      })

    // Create order product
    builder.addCase(createOrderProductsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(createOrderProductsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateOrderMe = !!actions.payload?.data?._id
        state.isErrorCreateOrderMe = !actions.payload?.data?._id
        state.isMessageCreateOrderMe = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Update order
    builder.addCase(UpdateOrderProductsAsync.pending, (state, actions) => {
      state.isLoading = true
    })

    builder.addCase(UpdateOrderProductsAsync.fulfilled, (state, actions) => {
      state.isLoading = false
      state.isSuccessUpdateOrderProduct = !!actions.payload?.data?._id
      state.isErrorUpdateOrderProduct = !actions.payload?.data?._id
      state.isMessageUpdateOrderProduct = actions.payload?.message
      state.typeError = actions.payload?.typeError
    })

    // Update status order
    builder.addCase(UpdateStatusOrderProductsAsync.pending, (state, actions) => {
      state.isLoading = true
    })

    builder.addCase(UpdateStatusOrderProductsAsync.fulfilled, (state, actions) => {
      state.isLoading = false
      state.isSuccessUpdateStatusOrderProduct = !!actions.payload?.data?._id
      state.isErrorUpdateStatusOrderProduct = !actions.payload?.data?._id
      state.isMessageUpdateStatusOrderProduct = actions.payload?.message
      state.typeError = actions.payload?.typeError
    })

    // cancel order product me
    builder.addCase(cancelOrderProductMeAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(cancelOrderProductMeAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCancelOrderMe = !!actions.payload?.data?._id
        state.isErrorCancelOrderMe = !actions.payload?.data?._id
        state.isMessageCancelOrderMe = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // delete order product
    builder.addCase(deleteOrderProductsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteOrderProductsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessDeleteOrderProduct = !!actions.payload?.data?._id
        state.isErrorDeleteOrderProduct = !actions.payload?.data?._id
        state.isMessageDeleteOrderProduct = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })
  }
})

const { actions, reducer } = cartProductSlice

export const { updateToCart, resetInitialState } = actions
export default reducer
