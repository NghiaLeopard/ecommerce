// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Reviews
import { createReviews, deleteMultipleReviews, deleteReviews, editReviews, getAllReviews } from 'src/services/reviews'
import {
  TParamsCreateReviews,
  TParamsDeleteManyReviews,
  TParamsEditReviews,
  TParamsGetReviews
} from 'src/types/reviews'

// ** Type

export const serviceName = 'Reviews'

export const getAllReviewsAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetReviews }) => {
    const response = await getAllReviews(data)

    return response
  }
)

export const editReviewsAsync = createAsyncThunk(`${serviceName}/edit`, async (data: TParamsEditReviews) => {
  const response = await editReviews(data)

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

export const createReviewsAsync = createAsyncThunk(`${serviceName}/create`, async (data: TParamsCreateReviews) => {
  const response = await createReviews(data)

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

export const deleteReviewsAsync = createAsyncThunk(`${serviceName}/delete`, async (reviewId: string) => {
  const response = await deleteReviews(reviewId)

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

export const deleteMultipleReviewsAsync = createAsyncThunk(
  `${serviceName}/delete-many`,
  async (data: TParamsDeleteManyReviews) => {
    const response = await deleteMultipleReviews(data)

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
