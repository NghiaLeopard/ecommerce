import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { registerAuth } from 'src/services/auth'

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

const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: ''
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
    }
  },
  extraReducers: builder => {
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
  }
})

const { actions, reducer } = authSlice

export const { resetInitialState } = actions
export default reducer
