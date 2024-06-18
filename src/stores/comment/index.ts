// ** Redux
import { createSlice } from '@reduxjs/toolkit'

// ** Action
import {
  // createCommentsAsync,
  deleteMultipleCommentsAsync,
  deleteCommentsAsync,
  // deleteCommentsMeAsync,
  editCommentsAsync,
  // editCommentsMeAsync,
  getAllCommentsAsync,
  serviceName
} from './actions'

const initialState = {
  isLoading: false,
  typeError: '',
  comments: {
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

export const commentsSlice = createSlice({
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
      state.comments = {
        data: [],
        total: 0
      }
    }
  },
  extraReducers: builder => {
    // Get all Comments
    builder.addCase(getAllCommentsAsync.pending, (state, actions) => {
      state.isLoading = true
    })

    builder.addCase(getAllCommentsAsync.fulfilled, (state, actions) => {
      state.isLoading = false
      state.comments.data = actions?.payload?.data?.comments
      state.comments.total = actions?.payload?.data?.totalCount
    })

    // // create Comments
    // builder.addCase(createCommentsAsync.pending, (state, actions) => {
    //   state.isLoading = true
    // }),
    // builder.addCase(createCommentsAsync.fulfilled, (state, actions) => {
    //   state.isLoading = false
    //   state.isSuccessCreate = !!actions.payload?.data?._id
    //   state.isErrorCreate = !actions.payload?.data?._id
    //   state.isMessageCreate = actions.payload?.message
    //   state.typeError = actions.payload?.typeError
    // })

    // edit Comments
    builder.addCase(editCommentsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(editCommentsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessUpdate = !!actions.payload?.data?._id
        state.isErrorUpdate = !actions.payload?.data?._id
        state.isMessageUpdate = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete Comments
    builder.addCase(deleteCommentsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteCommentsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessDelete = !!actions.payload?.data?._id
        state.isErrorDelete = !actions.payload?.data?._id
        state.isMessageDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // // edit Comments Me
    // builder.addCase(editCommentsMeAsync.pending, (state, actions) => {
    //   state.isLoading = true
    // }),
    //   builder.addCase(editCommentsMeAsync.fulfilled, (state, actions) => {
    //     state.isLoading = false
    //     state.isSuccessUpdate = !!actions.payload?.data?._id
    //     state.isErrorUpdate = !actions.payload?.data?._id
    //     state.isMessageUpdate = actions.payload?.message
    //     state.typeError = actions.payload?.typeError
    //   })

    // // Delete Comments Me
    // builder.addCase(deleteCommentsMeAsync.pending, (state, actions) => {
    //   state.isLoading = true
    // }),
    //   builder.addCase(deleteCommentsMeAsync.fulfilled, (state, actions) => {
    //     state.isLoading = false
    //     state.isSuccessDelete = !!actions.payload?.data?._id
    //     state.isErrorDelete = !actions.payload?.data?._id
    //     state.isMessageDelete = actions.payload?.message
    //     state.typeError = actions.payload?.typeError
    //   })

    // Delete multiple Comments
    builder.addCase(deleteMultipleCommentsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteMultipleCommentsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessMultipleDelete = !actions.payload?.typeError
        state.isErrorMultipleDelete = !!actions.payload?.typeError
        state.isMessageMultipleDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })
  }
})

const { actions, reducer } = commentsSlice

export const { resetInitialState } = actions
export default reducer
