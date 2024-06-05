// Helper
import axios from 'axios'
import instanceAxios from 'src/helpers/axios'

// ** Configs
import { API_ENDPOINT } from 'src/configs/api'
import { TParamsCreateCity, TParamsDeleteManyCity, TParamsEditCity, TParamsGetCity } from 'src/types/city'

// ** Type

export const getAllCity = async (data: { params: TParamsGetCity }) => {
  try {
    const res = await axios.get(`${API_ENDPOINT.SETTINGS.CITY.INDEX}`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const getDetailCity = async (idCity: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.SETTINGS.CITY.INDEX}/${idCity}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const editCity = async (data: TParamsEditCity) => {
  const { idCity, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.SETTINGS.CITY.INDEX}/${data.idCity}`, rests)

    return res.data
  } catch (error) {
    return error
  }
}

export const createCity = async (data: TParamsCreateCity) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.SETTINGS.CITY.INDEX}`, data)

    return res.data
  } catch (error: any) {
    return error
  }
}

export const deleteCity = async (idCity: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.SETTINGS.CITY.INDEX}/${idCity}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const deleteMultipleCity = async (data: TParamsDeleteManyCity) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.SETTINGS.CITY.INDEX}/delete-many`, { data })

    return res.data
  } catch (error) {
    return error
  }
}
