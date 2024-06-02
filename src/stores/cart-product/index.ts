// ** Redux
import { createSlice } from '@reduxjs/toolkit'
import { serviceName } from './actions'

// ** Action

const initialState = {
  orderItem: []
}

export const cartProductSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    updateToCart(state, action) {
      state.orderItem = action.payload.orderItem
    }
  }
})

const { actions, reducer } = cartProductSlice

export const { updateToCart } = actions
export default reducer
