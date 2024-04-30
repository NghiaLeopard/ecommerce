import { createSlice } from '@reduxjs/toolkit'
import { registerAuthSync, updateAuthMeSync } from './actions'

const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',
  isSuccessUpdateMe: true,
  isErrorUpdateMe: false,
  messageUpdateMe: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetInitialState(state) {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
      state.typeError = ''
      state.isSuccessUpdateMe = false
      state.isErrorUpdateMe = false
      state.messageUpdateMe = ''
    }
  },
  extraReducers: builder => {
    // Register
    builder.addCase(registerAuthSync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(registerAuthSync.fulfilled, (state, actions) => {
        state.isLoading = true
        state.isSuccess = !!actions.payload?.data?.email
        state.isError = !actions.payload?.data?.email
        state.message = actions?.payload?.message
        state.typeError = actions?.payload?.typeError
      }),
      builder.addCase(registerAuthSync.rejected, (state, actions) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
        state.message = ''
        state.typeError = ''
      })

    // Update me
    builder.addCase(updateAuthMeSync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(updateAuthMeSync.fulfilled, (state, actions) => {
        state.isLoading = true
        state.isSuccess = !!actions.payload?.data?.email
        state.isError = !actions.payload?.data?.email
        state.message = actions?.payload?.message
        state.typeError = actions?.payload?.typeError
        state.isSuccessUpdateMe = !!actions.payload?.data?.email
        state.isErrorUpdateMe = !actions.payload?.data?.email
        state.messageUpdateMe = actions?.payload?.message
      }),
      builder.addCase(updateAuthMeSync.rejected, (state, actions) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
        state.message = ''
        state.typeError = ''
        state.isSuccessUpdateMe = false
        state.isErrorUpdateMe = false
        state.messageUpdateMe = ''
      })
  }
})

const { actions, reducer } = authSlice

export const { resetInitialState } = actions
export default reducer
