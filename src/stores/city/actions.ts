// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** City
import { createCity, deleteMultipleCity, deleteCity, editCity, getAllCity } from 'src/services/city'
import { TParamsCreateCity, TParamsDeleteManyCity, TParamsEditCity, TParamsGetCity } from 'src/types/city'

// ** Type

export const serviceName = 'City'

export const getAllCityAsync = createAsyncThunk(`${serviceName}/get-all`, async (data: { params: TParamsGetCity }) => {
  const response = await getAllCity(data)

  return response
})

export const editCityAsync = createAsyncThunk(`${serviceName}/edit`, async (data: TParamsEditCity) => {
  const response = await editCity(data)

  if (response?.data) {
    return response
  }

  return {
    data: {
      _id: null
    },
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})

export const createCityAsync = createAsyncThunk(`${serviceName}/create`, async (data: TParamsCreateCity) => {
  const response = await createCity(data)

  if (response?.data) {
    return response
  }

  console.log(response)

  return {
    data: {
      _id: null
    },
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})

export const deleteCityAsync = createAsyncThunk(`${serviceName}/delete`, async (idCity: string) => {
  const response = await deleteCity(idCity)

  if (response?.data) {
    return response
  }

  return {
    data: {
      _id: null
    },
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})

export const deleteMultipleCityAsync = createAsyncThunk(
  `${serviceName}/delete-many`,
  async (data: TParamsDeleteManyCity) => {
    const response = await deleteMultipleCity(data)
    console.log(response)

    if (response?.message) {
      return response
    }

    return {
      data: {
        _id: null
      },
      message: response?.response?.data?.message,
      typeError: response?.response?.data?.typeError
    }
  }
)
