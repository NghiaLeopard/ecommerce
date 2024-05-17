// ** Redux
import { createSlice } from '@reduxjs/toolkit'

// ** Action
import { createUsersAsync, deleteUsersAsync, editUsersAsync, getAllUsersAsync, serviceName } from './actions'

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
  isMessageDelete: ''
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
    }
  },
  extraReducers: builder => {
    // Get all users
    builder.addCase(getAllUsersAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllUsersAsync.fulfilled, (state, actions) => {
        console.log(actions)
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
  }
})

const { actions, reducer } = usersSlice

export const { resetInitialState } = actions
export default reducer
