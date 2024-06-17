import { createSlice } from '@reduxjs/toolkit'
import {
  changePasswordAuthSync,
  forgotPasswordAuthSync,
  registerAuthFacebookSync,
  registerAuthGoogleSync,
  registerAuthSync,
  resetPasswordAuthSync,
  updateAuthMeSync
} from './actions'

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
  isSuccessForgotPassword: false,
  isErrorForgotPassword: false,
  messageForgotPassword: '',
  
  isSuccessResetPassword: false,
  isErrorResetPassword: false,
  messageResetPassword: '',

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

      state.isSuccessForgotPassword = false
      state.isErrorForgotPassword = false
      state.messageForgotPassword = ''

      state.isSuccessResetPassword = false
      state.isErrorResetPassword = false
      state.messageResetPassword = ''
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

    // Register google
    builder.addCase(registerAuthGoogleSync.pending, (state, actions) => {
      state.isLoading = true
    })
    builder.addCase(registerAuthGoogleSync.fulfilled, (state, actions) => {
      state.isLoading = true
      state.isSuccess = !!actions.payload?.data?.email
      state.isError = !actions.payload?.data?.email
      state.message = actions?.payload?.message
      state.typeError = actions?.payload?.typeError
    })

    // Register facebook
    builder.addCase(registerAuthFacebookSync.pending, (state, actions) => {
      state.isLoading = true
    })
    builder.addCase(registerAuthFacebookSync.fulfilled, (state, actions) => {
      state.isLoading = true
      state.isSuccess = !!actions.payload?.data?.email
      state.isError = !actions.payload?.data?.email
      state.message = actions?.payload?.message
      state.typeError = actions?.payload?.typeError
    })

    // Update me
    builder.addCase(updateAuthMeSync.pending, (state, actions) => {
      state.isLoading = true
    })

    builder.addCase(updateAuthMeSync.fulfilled, (state, actions) => {
      state.isLoading = false
      state.typeError = actions?.payload?.typeError
      state.isSuccessUpdateMe = !!actions.payload?.data?.email
      state.isErrorUpdateMe = !actions.payload?.data?.email
      state.messageUpdateMe = actions?.payload?.message
      state.userData = { ...actions.payload?.data }
    })

    // change password
    builder.addCase(changePasswordAuthSync.pending, (state, actions) => {
      state.isLoading = true
    })

    builder.addCase(changePasswordAuthSync.fulfilled, (state, actions) => {
      state.isLoading = true
      state.isSuccessChangePassword = !!actions.payload?.message
      state.isErrorChangePassword = !actions.payload?.message
      state.messageChangePassword = actions?.payload?.message
    })

    // forgot password
    builder.addCase(forgotPasswordAuthSync.pending, (state, actions) => {
      state.isLoading = true
    })

    builder.addCase(forgotPasswordAuthSync.fulfilled, (state, actions) => {
      state.isLoading = true
      state.isSuccessForgotPassword = !!actions.payload?.data?.email
      state.isErrorForgotPassword = !actions.payload?.data?.email
      state.typeError = actions?.payload?.typeError
      state.messageForgotPassword = actions?.payload?.message
    })

    // reset password
    builder.addCase(resetPasswordAuthSync.pending, (state, actions) => {
      state.isLoading = true
    })

    builder.addCase(resetPasswordAuthSync.fulfilled, (state, actions) => {
      console.log(actions.payload)
      state.isLoading = true
      state.isSuccessResetPassword = !!actions.payload?.data?.email
      state.isErrorResetPassword = !actions.payload?.data?.email
      state.typeError = actions?.payload?.typeError
      state.messageResetPassword = actions?.payload?.message
    })
  }
})

const { actions, reducer } = authSlice

export const { resetInitialState } = actions
export default reducer
