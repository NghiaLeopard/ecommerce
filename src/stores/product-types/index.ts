// ** Redux
import { createSlice } from '@reduxjs/toolkit'

// ** Action
import {
  createProductTypesAsync,
  deleteMultipleProductTypesAsync,
  deleteProductTypesAsync,
  editProductTypesAsync,
  getAllProductTypesAsync,
  serviceName
} from './actions'

const initialState = {
  isLoading: false,
  typeError: '',
  productTypes: {
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

export const productTypesSlice = createSlice({
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
      state.productTypes = {
        data: [],
        total: 0
      }
    }
  },
  extraReducers: builder => {
    // Get all ProductTypes
    builder.addCase(getAllProductTypesAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllProductTypesAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.productTypes.data = actions?.payload?.data?.productTypes
        state.productTypes.total = actions?.payload?.data?.totalCount
      }),
      // eslint-disable-next-line lines-around-comment

      // create ProductTypes
      builder.addCase(createProductTypesAsync.pending, (state, actions) => {
        state.isLoading = true
      }),
      builder.addCase(createProductTypesAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // edit ProductTypes
    builder.addCase(editProductTypesAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(editProductTypesAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete ProductTypes
    builder.addCase(deleteProductTypesAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteProductTypesAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessDelete = !!actions.payload?.data?._id
        state.isErrorDelete = !actions.payload?.data?._id
        state.isMessageDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete multiple ProductTypes
    builder.addCase(deleteMultipleProductTypesAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteMultipleProductTypesAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessMultipleDelete = !actions.payload?.typeError
        state.isErrorMultipleDelete = !!actions.payload?.typeError
        state.isMessageMultipleDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })
  }
})

const { actions, reducer } = productTypesSlice

export const { resetInitialState } = actions
export default reducer
