// ** Redux
import { createSlice } from '@reduxjs/toolkit'

// ** Action
import {
  createReviewsAsync,
  deleteMultipleReviewsAsync,
  deleteReviewsAsync,
  editReviewsAsync,
  getAllReviewsAsync,
  serviceName
} from './actions'

const initialState = {
  isLoading: false,
  typeError: '',
  reviews: {
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

export const reviewsSlice = createSlice({
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
      state.reviews = {
        data: [],
        total: 0
      }
    }
  },
  extraReducers: builder => {
    // Get all Reviews
    builder.addCase(getAllReviewsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllReviewsAsync.fulfilled, (state, actions) => {
        console.log(actions.payload)
        state.isLoading = false
        state.reviews.data = actions?.payload?.data?.reviews
        state.reviews.total = actions?.payload?.data?.totalCount
      }),
      // eslint-disable-next-line lines-around-comment

      // create Reviews
      builder.addCase(createReviewsAsync.pending, (state, actions) => {
        state.isLoading = true
      }),
      builder.addCase(createReviewsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // edit Reviews
    builder.addCase(editReviewsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(editReviewsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete Reviews
    builder.addCase(deleteReviewsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteReviewsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessDelete = !!actions.payload?.data?._id
        state.isErrorDelete = !actions.payload?.data?._id
        state.isMessageDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete multiple Reviews
    builder.addCase(deleteMultipleReviewsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteMultipleReviewsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessMultipleDelete = !actions.payload?.typeError
        state.isErrorMultipleDelete = !!actions.payload?.typeError
        state.isMessageMultipleDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })
  }
})

const { actions, reducer } = reviewsSlice

export const { resetInitialState } = actions
export default reducer
