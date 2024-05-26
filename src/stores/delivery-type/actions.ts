// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** DeliveryType
import {
  createDeliveryType,
  deleteMultipleDeliveryType,
  deleteDeliveryType,
  editDeliveryType,
  getAllDeliveryType
} from 'src/services/delivery-type'
import {
  TParamsCreateDeliveryType,
  TParamsDeleteManyDeliveryType,
  TParamsEditDeliveryType,
  TParamsGetDeliveryType
} from 'src/types/delivery-type'

// ** Type

export const serviceName = 'DeliveryType'

export const getAllDeliveryTypeAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetDeliveryType }) => {
    const response = await getAllDeliveryType(data)

    return response
  }
)

export const editDeliveryTypeAsync = createAsyncThunk(`${serviceName}/edit`, async (data: TParamsEditDeliveryType) => {
  const response = await editDeliveryType(data)

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

export const createDeliveryTypeAsync = createAsyncThunk(
  `${serviceName}/create`,
  async (data: TParamsCreateDeliveryType) => {
    const response = await createDeliveryType(data)

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
  }
)

export const deleteDeliveryTypeAsync = createAsyncThunk(`${serviceName}/delete`, async (idDeliveryType: string) => {
  const response = await deleteDeliveryType(idDeliveryType)

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

export const deleteMultipleDeliveryTypeAsync = createAsyncThunk(
  `${serviceName}/delete-many`,
  async (data: TParamsDeleteManyDeliveryType) => {
    const response = await deleteMultipleDeliveryType(data)
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
