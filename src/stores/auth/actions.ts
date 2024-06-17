// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Context
import { RegisterParamsFacebook, RegisterParamsGoogle, TForgotPassword, TResetPassword } from 'src/contexts/types'

// ** Service
import {
  changePasswordAuth,
  forgotPasswordAuth,
  registerAuth,
  registerAuthFacebook,
  registerAuthGoogle,
  resetPasswordAuth,
  updateAuthMe
} from 'src/services/auth'

export const registerAuthSync = createAsyncThunk('auth/register', async (data: any) => {
  const response = await registerAuth(data)

  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.data?.typeError
  }
})

export const forgotPasswordAuthSync = createAsyncThunk('auth/forgot-password', async (data: TForgotPassword) => {
  const response = await forgotPasswordAuth(data)

  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.data?.typeError
  }
})

export const resetPasswordAuthSync = createAsyncThunk('auth/reset-password', async (data: TResetPassword) => {
  const response = await resetPasswordAuth(data)

  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.data?.typeError
  }
})

export const registerAuthGoogleSync = createAsyncThunk('auth/register-google', async (data: RegisterParamsGoogle) => {
  const response = await registerAuthGoogle(data)

  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.data?.typeError
  }
})

export const registerAuthFacebookSync = createAsyncThunk(
  'auth/register-facebook',
  async (data: RegisterParamsFacebook) => {
    const response = await registerAuthFacebook(data)

    if (response?.data) {
      return response
    }

    return {
      data: null,
      message: response?.response?.data?.message,
      typeError: response?.data?.typeError
    }
  }
)

export const updateAuthMeSync = createAsyncThunk('auth/update-me', async (data: any) => {
  const response = await updateAuthMe(data)

  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.data?.typeError
  }
})

export const changePasswordAuthSync = createAsyncThunk('auth/change-password', async (data: any) => {
  const response = await changePasswordAuth(data)

  if (response?.message) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.data?.typeError
  }
})
