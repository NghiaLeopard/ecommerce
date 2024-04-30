// ** Axios
import axios from 'axios'
import instanceAxios from 'src/helpers/axios'

// ** Config
import { CONFIG_API } from 'src/configs/api'

// ** Context
import { LoginParams, RegisterParams } from 'src/contexts/types'

export const loginAuth = async (data: LoginParams) => {
  try {
    const res = await instanceAxios.post(`${CONFIG_API.AUTH.INDEX}/login`, data)

    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const logoutAuth = async () => {
  try {
    const res = await instanceAxios.post(`${CONFIG_API.AUTH.INDEX}/logout`)

    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const registerAuth = async (data: RegisterParams) => {
  try {
    const res = await axios.post(`${CONFIG_API.AUTH.INDEX}/register`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const updateAuthMe = async (data: any) => {
  try {
    const res = await instanceAxios.put(`${CONFIG_API.AUTH.INDEX}/me`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const getAuthMe = async () => {
  try {
    const res = await instanceAxios.get(`${CONFIG_API.AUTH.INDEX}/me`)

    return res.data
  } catch (error) {
    return error
  }
}
