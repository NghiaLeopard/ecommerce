// ** Redux
import { createSlice } from '@reduxjs/toolkit'

// ** Action
import {
  createDeliveryTypeAsync,
  deleteMultipleDeliveryTypeAsync,
  deleteDeliveryTypeAsync,
  editDeliveryTypeAsync,
  getAllDeliveryTypeAsync,
  serviceName
} from './actions'

const initialState = {
  isLoading: false,
  typeError: '',
  deliveryType: {
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

export const deliveryTypeSlice = createSlice({
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
      state.deliveryType = {
        data: [],
        total: 0
      }
    }
  },
  extraReducers: builder => {
    // Get all DeliveryType
    builder.addCase(getAllDeliveryTypeAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllDeliveryTypeAsync.fulfilled, (state, actions) => {
        console.log(actions.payload)
        state.isLoading = false
        state.deliveryType.data = actions?.payload?.data?.deliveryTypes
        state.deliveryType.total = actions?.payload?.data?.totalCount
      }),
      // eslint-disable-next-line lines-around-comment

      // create DeliveryType
      builder.addCase(createDeliveryTypeAsync.pending, (state, actions) => {
        state.isLoading = true
      }),
      builder.addCase(createDeliveryTypeAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // edit DeliveryType
    builder.addCase(editDeliveryTypeAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(editDeliveryTypeAsync.fulfilled, (state, actions) => {
        console.log(actions)
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete DeliveryType
    builder.addCase(deleteDeliveryTypeAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteDeliveryTypeAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessDelete = !!actions.payload?.data?._id
        state.isErrorDelete = !actions.payload?.data?._id
        state.isMessageDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete multiple DeliveryType
    builder.addCase(deleteMultipleDeliveryTypeAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteMultipleDeliveryTypeAsync.fulfilled, (state, actions) => {
        console.log(actions.payload)
        state.isLoading = false
        state.isSuccessMultipleDelete = !actions.payload?.typeError
        state.isErrorMultipleDelete = !!actions.payload?.typeError
        state.isMessageMultipleDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })
  }
})

const { actions, reducer } = deliveryTypeSlice

export const { resetInitialState } = actions
export default reducer
