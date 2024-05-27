// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Users
import { createUsers, deleteMultipleUsers, deleteUsers, editUsers, getAllUsers } from 'src/services/users'
import { TParamsCreateUsers, TParamsDeleteMany, TParamsEditUsers, TParamsGetUsers } from 'src/types/users'

// ** Type

export const serviceName = 'users'

export const getAllUsersAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetUsers }) => {
    const response = await getAllUsers(data)

    return response
  }
)

export const editUsersAsync = createAsyncThunk(`${serviceName}/edit`, async (data: TParamsEditUsers) => {
  const response = await editUsers(data)

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

export const createUsersAsync = createAsyncThunk(`${serviceName}/create`, async (data: TParamsCreateUsers) => {
  const response = await createUsers(data)

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

export const deleteUsersAsync = createAsyncThunk(`${serviceName}/delete`, async (idUsers: string) => {
  const response = await deleteUsers(idUsers)

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

export const deleteMultipleUsersAsync = createAsyncThunk(
  `${serviceName}/delete-many`,
  async (data: TParamsDeleteMany) => {
    const response = await deleteMultipleUsers(data)

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
