// Helper
import instanceAxios from 'src/helpers/axios'

// ** Configs
import { API_ENDPOINT } from 'src/configs/api'
import { TParamsCreateUsers, TParamsDeleteMany, TParamsEditUsers, TParamsGetUsers } from 'src/types/users'

// ** Type

export const getAllUsers = async (data: { params: TParamsGetUsers }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.USERS.INDEX}`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const getDetailUsers = async (idUsers: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.USERS.INDEX}/${idUsers}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const editUsers = async (data: TParamsEditUsers) => {
  const { idUsers, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.USERS.INDEX}/${data.idUsers}`, rests)

    return res.data
  } catch (error) {
    return error
  }
}

export const createUsers = async (data: TParamsCreateUsers) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.USERS.INDEX}`, data)

    return res.data
  } catch (error: any) {
    return error
  }
}

export const deleteUsers = async (idUsers: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.USERS.INDEX}/${idUsers}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const deleteMultipleUsers = async (data: TParamsDeleteMany) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.USERS.INDEX}/delete-many`, { data })

    return res.data
  } catch (error) {
    return error
  }
}
