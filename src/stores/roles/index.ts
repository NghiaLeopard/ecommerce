// ** Redux
import { createSlice } from '@reduxjs/toolkit'

// ** Action
import { createRolesAsync, deleteRolesAsync, editRolesAsync, getAllRolesAsync } from './actions'

const initialState = {
  isLoading: false,
  typeError: '',
  roles: {
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

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    resetInitialState(state) {
      state.isLoading = false
      state.roles = {
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
    // Get all role
    builder.addCase(getAllRolesAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllRolesAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.roles.data = actions?.payload?.data?.roles
        state.roles.total = actions?.payload?.data?.totalCount
      }),
      builder.addCase(getAllRolesAsync.rejected, (state, actions) => {
        state.isLoading = false
      })

    // create role
    builder.addCase(createRolesAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(createRolesAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // edit role
    builder.addCase(editRolesAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(editRolesAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete role
    builder.addCase(deleteRolesAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteRolesAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessDelete = !!actions.payload?.data?._id
        state.isErrorDelete = !actions.payload?.data?._id
        state.isMessageDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })
  }
})

const { actions, reducer } = roleSlice

export const { resetInitialState } = actions
export default reducer
