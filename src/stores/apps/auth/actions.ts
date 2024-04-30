import { createAsyncThunk } from '@reduxjs/toolkit'
import { registerAuth, updateAuthMe } from 'src/services/auth'

export const registerAuthSync = createAsyncThunk('auth/register', async (data: any) => {
  const response = await registerAuth(data)

  console.log('response', { response })

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

  console.log('response', { response })

  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.data?.typeError
  }
})
