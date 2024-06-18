// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Comments
import {
  // createComments,
  deleteMultipleComments,
  deleteComments,
  // deleteCommentsMe,
  editComments,
  // editCommentsMe,
  getAllComments
} from 'src/services/comments'
import {
  // TParamsCreateComments,
  TParamsDeleteManyComments,
  TParamsEditComments,
  TParamsEditCommentsMe,
  TParamsGetComments
} from 'src/types/comments'

// ** Type

export const serviceName = 'Comments'

export const getAllCommentsAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetComments }) => {
    const response = await getAllComments(data)

    return response
  }
)

// export const createCommentsAsync = createAsyncThunk(`${serviceName}/create`, async (data: TParamsCreateComments) => {
//   const response = await createComments(data)

//   if (response?.data) {
//     return response
//   }

//   return {
//     data: {
//       _id: null
//     },
//     message: response?.response?.data?.message,
//     typeError: response?.response?.data?.typeError
//   }
// })

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

// export const editCommentsMeAsync = createAsyncThunk(`${serviceName}/edit-me`, async (data: TParamsEditCommentsMe) => {
//   const response = await editCommentsMe(data)

//   if (response?.data) {
//     return response
//   }

//   return {
//     data: {
//       _id: null
//     },
//     message: response?.response?.data?.message,
//     typeError: response?.response?.data?.typeError
//   }
// })

// export const deleteCommentsMeAsync = createAsyncThunk(`${serviceName}/delete-me`, async (commentId: string) => {
//   const response = await deleteCommentsMe(commentId)

//   if (response?.data) {
//     return response
//   }

//   return {
//     data: {
//       _id: null
//     },
//     message: response?.response?.data?.message,
//     typeError: response?.response?.data?.typeError
//   }
// })
