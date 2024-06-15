// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Reviews
import {
  createReviews,
  deleteMultipleReviews,
  deleteReviews,
  deleteReviewsMe,
  editReviews,
  editReviewsMe,
  getAllReviews
} from 'src/services/reviews'
import {
  TParamsCreateReviews,
  TParamsDeleteManyReviews,
  TParamsEditReviews,
  TParamsEditReviewsMe,
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

export const editReviewsMeAsync = createAsyncThunk(`${serviceName}/edit-me`, async (data: TParamsEditReviewsMe) => {
  const response = await editReviewsMe(data)

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

export const deleteReviewsMeAsync = createAsyncThunk(`${serviceName}/delete-me`, async (reviewId: string) => {
  const response = await deleteReviewsMe(reviewId)

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
