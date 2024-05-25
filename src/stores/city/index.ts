// ** Redux
import { createSlice } from '@reduxjs/toolkit'

// ** Action
import {
  createCityAsync,
  deleteMultipleCityAsync,
  deleteCityAsync,
  editCityAsync,
  getAllCityAsync,
  serviceName
} from './actions'

const initialState = {
  isLoading: false,
  typeError: '',
  city: {
    data: [],
    total: 0
  },
  isSuccessCreateEdit: false,
  isErrorCreateEdit: false,
  isMessageCreateEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  isMessageDelete: '',
  isSuccessMultipleDelete: false,
  isErrorMultipleDelete: false,
  isMessageMultipleDelete: ''
}

export const citySlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetInitialState(state) {
      state.isLoading = false
      state.city = {
        data: [],
        total: 0
      }
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = false
      state.isMessageCreateEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.isMessageDelete = ''
      state.isSuccessMultipleDelete = false
      state.isErrorMultipleDelete = false
      state.isMessageMultipleDelete = ''
    }
  },
  extraReducers: builder => {
    // Get all City
    builder.addCase(getAllCityAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllCityAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.city.data = actions?.payload?.data?.cities
        state.city.total = actions?.payload?.data?.totalCount
      }),
      // eslint-disable-next-line lines-around-comment

      // create City
      builder.addCase(createCityAsync.pending, (state, actions) => {
        state.isLoading = true
      }),
      builder.addCase(createCityAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // edit City
    builder.addCase(editCityAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(editCityAsync.fulfilled, (state, actions) => {
        console.log(actions)
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete City
    builder.addCase(deleteCityAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteCityAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessDelete = !!actions.payload?.data?._id
        state.isErrorDelete = !actions.payload?.data?._id
        state.isMessageDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete multiple City
    builder.addCase(deleteMultipleCityAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteMultipleCityAsync.fulfilled, (state, actions) => {
        console.log(actions.payload)
        state.isLoading = false
        state.isSuccessMultipleDelete = !actions.payload?.typeError
        state.isErrorMultipleDelete = !!actions.payload?.typeError
        state.isMessageMultipleDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })
  }
})

const { actions, reducer } = citySlice

export const { resetInitialState } = actions
export default reducer
