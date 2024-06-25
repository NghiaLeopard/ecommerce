// ** Redux
import { createSlice } from '@reduxjs/toolkit'

// ** Action
import {
  deleteNotificationAsync,
  getAllNotificationAsync,
  markReadAllNotificationAsync,
  markReadNotificationAsync,
  serviceName
} from './actions'

const initialState = {
  isLoading: false,
  typeError: '',
  notification: {
    data: [],
    total: 0,
    totalNew: 0
  },
  isSuccessMarkRead: false,
  isErrorMarkRead: false,
  isMessageMarkRead: '',
  isSuccessMarkReadAll: false,
  isErrorMarkReadAll: false,
  isMessageMarkReadAll: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  isMessageDelete: ''
}

export const notificationSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetInitialState(state) {
      state.isLoading = false
      state.isSuccessMarkRead = false
      state.isErrorMarkRead = false
      state.isMessageMarkRead = ''
      state.isSuccessMarkReadAll = false
      state.isErrorMarkReadAll = false
      state.isMessageMarkReadAll = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.isMessageDelete = ''

      state.notification = {
        data: [],
        total: 0,
        totalNew: 0
      }
    }
  },
  extraReducers: builder => {
    // Get all Notification
    builder.addCase(getAllNotificationAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllNotificationAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.notification.data = actions?.payload?.data?.notifications
        state.notification.total = actions?.payload?.data?.totalCount
        state.notification.totalNew = actions?.payload?.data?.totalNew
      })

    // mark notification
    builder.addCase(markReadNotificationAsync.pending, (state, actions) => {
      state.isLoading = true
    })

    builder.addCase(markReadNotificationAsync.fulfilled, (state, actions) => {
      state.isLoading = false
      state.isSuccessMarkRead = !!actions.payload?.data?._id
      state.isErrorMarkRead = !actions.payload?.data?._id
      state.isMessageMarkRead = actions.payload?.message
      state.typeError = actions.payload?.typeError
    })

    // mark all notification
    builder.addCase(markReadAllNotificationAsync.pending, (state, actions) => {
      state.isLoading = true
    })

    builder.addCase(markReadAllNotificationAsync.fulfilled, (state, actions) => {
      state.isLoading = false
      state.isSuccessMarkReadAll = !!actions.payload?.data?._id
      state.isErrorMarkReadAll = !actions.payload?.data?._id
      state.isMessageMarkReadAll = actions.payload?.message
      state.typeError = actions.payload?.typeError
    })

    // Delete Notification
    builder.addCase(deleteNotificationAsync.pending, (state, actions) => {
      state.isLoading = true
    })

    builder.addCase(deleteNotificationAsync.fulfilled, (state, actions) => {
      state.isLoading = false
      state.isSuccessDelete = !!actions.payload?.data?._id
      state.isErrorDelete = !actions.payload?.data?._id
      state.isMessageDelete = actions.payload?.message
      state.typeError = actions.payload?.typeError
    })
  }
})

const { actions, reducer } = notificationSlice

export const { resetInitialState } = actions
export default reducer
