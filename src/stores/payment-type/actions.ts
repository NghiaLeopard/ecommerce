// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** PaymentType
import {
  createPaymentType,
  deleteMultiplePaymentType,
  deletePaymentType,
  editPaymentType,
  getAllPaymentType
} from 'src/services/payment-type'
import {
  TParamsCreatePaymentType,
  TParamsDeleteManyPaymentType,
  TParamsEditPaymentType,
  TParamsGetPaymentType
} from 'src/types/payment-type'

// ** Type

export const serviceName = 'PaymentType'

export const getAllPaymentTypeAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetPaymentType }) => {
    const response = await getAllPaymentType(data)

    return response
  }
)

export const editPaymentTypeAsync = createAsyncThunk(`${serviceName}/edit`, async (data: TParamsEditPaymentType) => {
  const response = await editPaymentType(data)

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

export const createPaymentTypeAsync = createAsyncThunk(
  `${serviceName}/create`,
  async (data: TParamsCreatePaymentType) => {
    const response = await createPaymentType(data)

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

export const deletePaymentTypeAsync = createAsyncThunk(`${serviceName}/delete`, async (idPaymentType: string) => {
  const response = await deletePaymentType(idPaymentType)

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

export const deleteMultiplePaymentTypeAsync = createAsyncThunk(
  `${serviceName}/delete-many`,
  async (data: TParamsDeleteManyPaymentType) => {
    const response = await deleteMultiplePaymentType(data)
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
