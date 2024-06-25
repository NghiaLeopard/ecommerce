// Helper
import instanceAxios from 'src/helpers/axios'

// ** Configs
import { API_ENDPOINT } from 'src/configs/api'

import { TParamsGetNotification } from 'src/types/notification'

// ** Type

export const getAllNotification = async (data: { params: TParamsGetNotification }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.NOTIFICATION.INDEX}`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const deleteNotification = async (notificationId: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.NOTIFICATION.INDEX}/${notificationId}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const markReadNotification = async (notificationId: string) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.NOTIFICATION.INDEX}/${notificationId}/read`)

    return res.data
  } catch (error) {
    return error
  }
}

export const markReadAllNotification = async () => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.NOTIFICATION.INDEX}/all/read`)

    return res.data
  } catch (error: any) {
    return error
  }
}
