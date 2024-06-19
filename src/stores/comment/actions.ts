// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Comments
import {
  deleteMultipleComments,
  deleteComments,
  editComments,
  getAllComments,
  createComments,
  createCommentsReply,
  deleteCommentsMe,
  editCommentsMe
} from 'src/services/comments'

// ** Types
import {
  TCreateCommentsProduct,
  TCreateCommentsReply,
  TParamsDeleteManyComments,
  TParamsEditComments,
  TParamsGetComments
} from 'src/types/comments'

export const serviceName = 'Comments'

export const getAllCommentsAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetComments }) => {
    const response = await getAllComments(data)

    return response
  }
)

export const createCommentsAsync = createAsyncThunk(
  `${serviceName}/create-comment`,
  async (data: TCreateCommentsProduct) => {
    const response = await createComments(data)

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
  }
)

export const createCommentsReplyAsync = createAsyncThunk(
  `${serviceName}/create-comment-reply`,
  async (data: TCreateCommentsReply) => {
    const response = await createCommentsReply(data)

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

export const editCommentsMeAsync = createAsyncThunk(
  `${serviceName}/edit-comment-me`,
  async (data: TParamsEditComments) => {
    const response = await editCommentsMe(data)

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
  }
)

export const deleteCommentsMeAsync = createAsyncThunk(`${serviceName}/delete-comment-me`, async (commentId: string) => {
  const response = await deleteCommentsMe(commentId)

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
