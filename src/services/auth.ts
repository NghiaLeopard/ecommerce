// ** Axios
import axios from 'axios'

// Helper
import instanceAxios from 'src/helpers/axios'

// ** Config
import { API_ENDPOINT } from 'src/configs/api'

// ** Context
import { LoginParams, RegisterParams } from 'src/contexts/types'

export const loginAuth = async (data: LoginParams) => {
  const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/login`, data)

  return res.data
}

export const logoutAuth = async () => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.AUTH.INDEX}/logout`)

    return res.data
  } catch (error) {
  }
}

export const registerAuth = async (data: RegisterParams) => {
  try {
    const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/register`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const updateAuthMe = async (data: any) => {
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.AUTH.INDEX}/me`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const getAuthMe = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.AUTH.INDEX}/me`)

    return res.data
  } catch (error) {
    return error
  }
}

export const changePasswordAuth = async (data: any) => {
  try {
    const res = await instanceAxios.patch(`${API_ENDPOINT.AUTH.INDEX}/change-password`, data)

    return res.data
  } catch (error) {
    return error
  }
}
