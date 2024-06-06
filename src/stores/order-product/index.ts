// ** Redux
import { createSlice } from '@reduxjs/toolkit'
import { createOrderProductsAsync, serviceName } from './actions'

// ** Action

const initialState = {
  orderItem: [],
  isLoading: false,
  isSuccessCreateOrder: false,
  isErrorCreateOrder: false,
  isMessageCreateOrder: '',
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
    }
  },
  extraReducers: builder => {
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
  }
})

const { actions, reducer } = cartProductSlice

export const { updateToCart, resetInitialState } = actions
export default reducer
