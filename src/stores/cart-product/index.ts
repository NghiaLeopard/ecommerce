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
    addToCart(state, action) {
      state.orderItem = action.payload.orderItem
    }
  }
})

const { actions, reducer } = cartProductSlice

export const { addToCart } = actions
export default reducer
