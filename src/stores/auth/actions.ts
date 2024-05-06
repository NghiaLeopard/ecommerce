import { createAsyncThunk } from '@reduxjs/toolkit'
import { changePasswordAuth, registerAuth, updateAuthMe } from 'src/services/auth'

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
