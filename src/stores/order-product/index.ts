// ** Redux
import { createSlice } from '@reduxjs/toolkit'
import { cancelOrderProductAsync, createOrderProductsAsync, getAllOrderMeAsync, serviceName } from './actions'

// ** Action

const initialState = {
  orderItem: [],
  orderItemMe: [],
  isLoading: false,
  isSuccessCreateOrder: false,
  isErrorCreateOrder: false,
  isMessageCreateOrder: '',
  isSuccessCancelOrder: false,
  isErrorCancelOrder: false,
  isMessageCancelOrder: '',
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
      state.isSuccessCreateOrder = false
      state.isErrorCreateOrder = false
      state.isMessageCreateOrder = ''
      state.typeError = ''
      state.isSuccessCancelOrder = false
      state.isErrorCancelOrder = false
      state.isMessageCancelOrder = ''
    }
  },
  extraReducers: builder => {
    // Create order product
    builder.addCase(getAllOrderMeAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllOrderMeAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.orderItemMe = actions.payload?.data?.orders
      })

    // Create order product
    builder.addCase(createOrderProductsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(createOrderProductsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateOrder = !!actions.payload?.data?._id
        state.isErrorCreateOrder = !actions.payload?.data?._id
        state.isMessageCreateOrder = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // cancel order product
    builder.addCase(cancelOrderProductAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(cancelOrderProductAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCancelOrder = !!actions.payload?.data?._id
        state.isErrorCancelOrder = !actions.payload?.data?._id
        state.isMessageCancelOrder = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })
  }
})

const { actions, reducer } = cartProductSlice

export const { updateToCart, resetInitialState } = actions
export default reducer
