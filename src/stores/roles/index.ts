import { createSlice } from '@reduxjs/toolkit'
import { getAllRolesAsync } from './actions'

const initialState = {
  isLoading: false,
  roles: {
    data: [],
    total: 0
  }
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
    }
  },
  extraReducers: builder => {
    // Get all role
    builder.addCase(getAllRolesAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllRolesAsync.fulfilled, (state, actions) => {
        console.log(actions.payload)
        state.isLoading = true
        state.roles.data = actions?.payload?.data?.roles
        state.roles.total = actions?.payload?.data?.totalCount
      }),
      builder.addCase(getAllRolesAsync.rejected, (state, actions) => {
        state.isLoading = false
      })
  }
})

const { actions, reducer } = roleSlice

export const { resetInitialState } = actions
export default reducer
