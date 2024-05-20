// ** Redux
import { createSlice } from '@reduxjs/toolkit'

// ** Action
import {
  createUsersAsync,
  deleteMultipleUsersAsync,
  deleteUsersAsync,
  editUsersAsync,
  getAllUsersAsync,
  serviceName
} from './actions'

const initialState = {
  isLoading: false,
  typeError: '',
  users: {
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

export const usersSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetInitialState(state) {
      state.isLoading = false
      state.users = {
        data: [],
        total: 0
      }
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = false
      state.isMessageCreateEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.isMessageDelete = ''
      state.isSuccessMultipleDelete = false
      state.isErrorMultipleDelete = false
      state.isMessageMultipleDelete = ''
    }
  },
  extraReducers: builder => {
    // Get all users
    builder.addCase(getAllUsersAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllUsersAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.users.data = actions?.payload?.data?.users
        state.users.total = actions?.payload?.data?.totalCount
      }),
      // eslint-disable-next-line lines-around-comment

      // create users
      builder.addCase(createUsersAsync.pending, (state, actions) => {
        state.isLoading = true
      }),
      builder.addCase(createUsersAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // edit users
    builder.addCase(editUsersAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(editUsersAsync.fulfilled, (state, actions) => {
        console.log(actions)
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete users
    builder.addCase(deleteUsersAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteUsersAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessDelete = !!actions.payload?.data?._id
        state.isErrorDelete = !actions.payload?.data?._id
        state.isMessageDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete multiple users
    builder.addCase(deleteMultipleUsersAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteMultipleUsersAsync.fulfilled, (state, actions) => {
        console.log(actions.payload)
        state.isLoading = false
        state.isSuccessMultipleDelete = !actions.payload?.typeError
        state.isErrorMultipleDelete = !!actions.payload?.typeError
        state.isMessageMultipleDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })
  }
})

const { actions, reducer } = usersSlice

export const { resetInitialState } = actions
export default reducer
