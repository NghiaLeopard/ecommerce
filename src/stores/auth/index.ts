import { createSlice } from '@reduxjs/toolkit'
import { changePasswordAuthSync, registerAuthSync, updateAuthMeSync } from './actions'

// ** Type
import { UserDataType } from 'src/contexts/types'

type TInitialState = {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  message: string
  typeError: string
  isSuccessUpdateMe: boolean
  isErrorUpdateMe: boolean
  messageUpdateMe: string
  isSuccessChangePassword: boolean
  isErrorChangePassword: boolean
  messageChangePassword: string
  userDate: UserDataType | null
}

const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',
  isSuccessUpdateMe: true,
  isErrorUpdateMe: false,
  messageUpdateMe: '',
  isSuccessChangePassword: false,
  isErrorChangePassword: false,
  messageChangePassword: '',
  userData: null
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
      state.isSuccessChangePassword = false
      state.isErrorChangePassword = false
      state.messageChangePassword = ''
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
        state.isLoading = false
        state.isSuccess = !!actions.payload?.data?.email
        state.isError = !actions.payload?.data?.email
        state.message = actions?.payload?.message
        state.typeError = actions?.payload?.typeError
        state.isSuccessUpdateMe = !!actions.payload?.data?.email
        state.isErrorUpdateMe = !actions.payload?.data?.email
        state.messageUpdateMe = actions?.payload?.message
        state.userData = { ...actions.payload?.data }
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

    // change password
    builder.addCase(changePasswordAuthSync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(changePasswordAuthSync.fulfilled, (state, actions) => {
        state.isLoading = true
        state.isSuccess = !!actions.payload?.data?.email
        state.isError = !actions.payload?.data?.email
        state.message = actions?.payload?.message
        state.typeError = actions?.payload?.typeError
        state.isSuccessUpdateMe = !!actions.payload?.data?.email
        state.isErrorUpdateMe = !actions.payload?.data?.email
        state.messageUpdateMe = actions?.payload?.message
        state.isSuccessChangePassword = !!actions.payload?.message
        state.isErrorChangePassword = !actions.payload?.message
        state.messageChangePassword = actions?.payload?.message
      }),
      builder.addCase(changePasswordAuthSync.rejected, (state, actions) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
        state.message = ''
        state.typeError = ''
        state.isSuccessUpdateMe = false
        state.isErrorUpdateMe = false
        state.messageUpdateMe = ''
        state.isSuccessChangePassword = false
        state.isErrorChangePassword = false
        state.messageChangePassword = ''
      })
  }
})

const { actions, reducer } = authSlice

export const { resetInitialState } = actions
export default reducer
