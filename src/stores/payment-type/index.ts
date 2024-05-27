// ** Redux
import { createSlice } from '@reduxjs/toolkit'

// ** Action
import {
  createPaymentTypeAsync,
  deleteMultiplePaymentTypeAsync,
  deletePaymentTypeAsync,
  editPaymentTypeAsync,
  getAllPaymentTypeAsync,
  serviceName
} from './actions'

const initialState = {
  isLoading: false,
  typeError: '',
  paymentType: {
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

export const PaymentTypeSlice = createSlice({
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
      state.paymentType = {
        data: [],
        total: 0
      }
    }
  },
  extraReducers: builder => {
    // Get all PaymentType
    builder.addCase(getAllPaymentTypeAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllPaymentTypeAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.paymentType.data = actions?.payload?.data?.paymentTypes
        state.paymentType.total = actions?.payload?.data?.totalCount
      }),
      // eslint-disable-next-line lines-around-comment

      // create PaymentType
      builder.addCase(createPaymentTypeAsync.pending, (state, actions) => {
        state.isLoading = true
      }),
      builder.addCase(createPaymentTypeAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // edit PaymentType
    builder.addCase(editPaymentTypeAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(editPaymentTypeAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete PaymentType
    builder.addCase(deletePaymentTypeAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deletePaymentTypeAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessDelete = !!actions.payload?.data?._id
        state.isErrorDelete = !actions.payload?.data?._id
        state.isMessageDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete multiple PaymentType
    builder.addCase(deleteMultiplePaymentTypeAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteMultiplePaymentTypeAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessMultipleDelete = !actions.payload?.typeError
        state.isErrorMultipleDelete = !!actions.payload?.typeError
        state.isMessageMultipleDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })
  }
})

const { actions, reducer } = PaymentTypeSlice

export const { resetInitialState } = actions
export default reducer
