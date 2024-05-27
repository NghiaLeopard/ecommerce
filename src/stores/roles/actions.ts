// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Role
import { createRole, deleteRole, editRole, getAllRoles } from 'src/services/role'

// ** Type
import { TParamsCreateRole, TParamsEditRole, TParamsGetRoles } from 'src/types/role'

export const getAllRolesAsync = createAsyncThunk('role/get-all', async (data: { params: TParamsGetRoles }) => {
  const response = await getAllRoles(data)

  return response
})

export const editRolesAsync = createAsyncThunk('role/edit', async (data: TParamsEditRole) => {
  const response = await editRole(data)

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

export const createRolesAsync = createAsyncThunk('role/create', async (data: TParamsCreateRole) => {
  const response = await createRole(data)

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

export const deleteRolesAsync = createAsyncThunk('role/delete', async (idRole: string) => {
  const response = await deleteRole(idRole)

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
