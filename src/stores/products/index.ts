// ** Redux
import { createSlice } from '@reduxjs/toolkit'

// ** Action
import {
  createProductsAsync,
  deleteMultipleProductsAsync,
  deleteProductsAsync,
  editProductsAsync,
  getAllProductsAsync,
  serviceName
} from './actions'

const initialState = {
  isLoading: false,
  typeError: '',
  products: {
    data: [],
    total: 0
  },
  isSuccessCreateEdit: false,
  isErrorCreateEdit: false,
  isMessageCreateEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  isMessageDelete: '',
  isSuccessMultipleDelete: false,
  isErrorMultipleDelete: false,
  isMessageMultipleDelete: ''
}

export const productsSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetInitialState(state) {
      state.isLoading = false
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = false
      state.isMessageCreateEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.isMessageDelete = ''
      state.isSuccessMultipleDelete = false
      state.isErrorMultipleDelete = false
      state.isMessageMultipleDelete = ''
      state.products = {
        data: [],
        total: 0
      }
    }
  },
  extraReducers: builder => {
    // Get all Products
    builder.addCase(getAllProductsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllProductsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.products.data = actions?.payload?.data?.Products
        state.products.total = actions?.payload?.data?.totalCount
      }),
      // eslint-disable-next-line lines-around-comment

      // create Products
      builder.addCase(createProductsAsync.pending, (state, actions) => {
        state.isLoading = true
      }),
      builder.addCase(createProductsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // edit Products
    builder.addCase(editProductsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(editProductsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete Products
    builder.addCase(deleteProductsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteProductsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessDelete = !!actions.payload?.data?._id
        state.isErrorDelete = !actions.payload?.data?._id
        state.isMessageDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete multiple Products
    builder.addCase(deleteMultipleProductsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteMultipleProductsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessMultipleDelete = !actions.payload?.typeError
        state.isErrorMultipleDelete = !!actions.payload?.typeError
        state.isMessageMultipleDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })
  }
})

const { actions, reducer } = productsSlice

export const { resetInitialState } = actions
export default reducer
