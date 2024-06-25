// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Notification
import {
  deleteNotification,
  getAllNotification,
  markReadAllNotification,
  markReadNotification
} from 'src/services/notification'

// ** Type
import { TParamsGetNotification } from 'src/types/notification'

export const serviceName = 'Notification'

export const getAllNotificationAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetNotification }) => {
    const response = await getAllNotification(data)

    return response
  }
)

export const deleteNotificationAsync = createAsyncThunk(`${serviceName}/delete`, async (idNotification: string) => {
  const response = await deleteNotification(idNotification)

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

export const markReadNotificationAsync = createAsyncThunk(
  `${serviceName}/mark-read-notification`,
  async (notificationId: string) => {
    const response = await markReadNotification(notificationId)

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

export const markReadAllNotificationAsync = createAsyncThunk(`${serviceName}/mark-many-read`, async () => {
  const response = await markReadAllNotification()

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
})
