// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Comments
import { deleteMultipleComments, deleteComments, editComments, getAllComments } from 'src/services/comments'

// ** Types
import { TParamsDeleteManyComments, TParamsEditComments, TParamsGetComments } from 'src/types/comments'

export const serviceName = 'Comments'

export const getAllCommentsAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetComments }) => {
    const response = await getAllComments(data)

    return response
  }
)

export const editCommentsAsync = createAsyncThunk(`${serviceName}/edit`, async (data: TParamsEditComments) => {
  const response = await editComments(data)

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

export const deleteCommentsAsync = createAsyncThunk(`${serviceName}/delete`, async (commentId: string) => {
  const response = await deleteComments(commentId)

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

export const deleteMultipleCommentsAsync = createAsyncThunk(
  `${serviceName}/delete-many`,
  async (data: TParamsDeleteManyComments) => {
    const response = await deleteMultipleComments(data)

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
