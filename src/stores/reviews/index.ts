// ** Redux
import { createSlice } from '@reduxjs/toolkit'

// ** Action
import {
  createReviewsAsync,
  deleteMultipleReviewsAsync,
  deleteReviewsAsync,
  deleteReviewsMeAsync,
  editReviewsAsync,
  editReviewsMeAsync,
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
  isSuccessCreate: false,
  isErrorCreate: false,
  isMessageCreate: '',
  isSuccessUpdate: false,
  isErrorUpdate: false,
  isMessageUpdate: '',
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
      state.isSuccessCreate = false
      state.isErrorCreate = false
      state.isMessageCreate = ''
      state.isSuccessUpdate = false
      state.isErrorUpdate = false
      state.isMessageUpdate = ''
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
        state.isSuccessCreate = !!actions.payload?.data?._id
        state.isErrorCreate = !actions.payload?.data?._id
        state.isMessageCreate = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // edit Reviews
    builder.addCase(editReviewsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(editReviewsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessUpdate = !!actions.payload?.data?._id
        state.isErrorUpdate = !actions.payload?.data?._id
        state.isMessageUpdate = actions.payload?.message
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

    // edit Reviews Me
    builder.addCase(editReviewsMeAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(editReviewsMeAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessUpdate = !!actions.payload?.data?._id
        state.isErrorUpdate = !actions.payload?.data?._id
        state.isMessageUpdate = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete Reviews Me
    builder.addCase(deleteReviewsMeAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteReviewsMeAsync.fulfilled, (state, actions) => {
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
