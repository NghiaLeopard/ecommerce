// ** Redux
import { createSlice } from '@reduxjs/toolkit'
import {
  cancelOrderProductMeAsync,
  createOrderProductsAsync,
  getAllOrderCMSAsync,
  getAllOrderMeAsync,
  serviceName
} from './actions'

// ** Action

const initialState = {
  orderItem: [],
  orderItemProduct: [],
  orderItemMe: [],
  isLoading: false,
  isSuccessCreateOrderMe: false,
  isErrorCreateOrderMe: false,
  isMessageCreateOrderMe: '',
  isSuccessCancelOrderMe: false,
  isErrorCancelOrderMe: false,
  isMessageCancelOrderMe: '',
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
      state.typeError = ''
      state.isSuccessCancelOrderMe = false
      state.isErrorCancelOrderMe = false
      state.isMessageCancelOrderMe = ''
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
  }
})

const { actions, reducer } = cartProductSlice

export const { updateToCart, resetInitialState } = actions
export default reducer
