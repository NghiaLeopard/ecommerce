// Helper
import instanceAxios from 'src/helpers/axios'

// ** Configs
import { API_ENDPOINT } from 'src/configs/api'

// ** Type
import { TParamsCreateRole, TParamsEditRole, TParamsGetRoles } from 'src/types/role'

export const getAllRoles = async (data: { params: TParamsGetRoles }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.ROLE.INDEX}`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const editRole = async (data: TParamsEditRole) => {
  const { idRole, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.ROLE.INDEX}/${data.idRole}`, rests)

    return res.data
  } catch (error) {
    return error
  }
}

export const createRole = async (data: TParamsCreateRole) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.ROLE.INDEX}`, data)

    return res.data
  } catch (error: any) {
    return error?.response?.data
  }
}

export const deleteRole = async (idRole: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.ROLE.INDEX}/${idRole}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const getDetailRole = async (idRole: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.ROLE.INDEX}/${idRole}`)

    return res.data
  } catch (error) {
    return error
  }
}
