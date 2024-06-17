import { ACCESS_TOKEN, ORDER_ITEM, PRE_GOOGLE_TOKEN, REFRESH_TOKEN, TEMPORARY_TOKEN, USER_DATA } from 'src/configs/auth'
import { TOrderProduct } from 'src/types/order-product'

export const setLocalUserData = (userData: string, accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(USER_DATA, userData),
      window.localStorage.setItem(ACCESS_TOKEN, accessToken),
      window.localStorage.setItem(REFRESH_TOKEN, refreshToken)
  }
}

export const getLocalUserData = () => {
  if (typeof window !== 'undefined') {
    return {
      userData: window.localStorage.getItem(USER_DATA),
      accessToken: window.localStorage.getItem(ACCESS_TOKEN),
      refreshToken: window.localStorage.getItem(REFRESH_TOKEN)
    }
  }

  return {
    userData: '',
    accessToken: '',
    refreshToken: ''
  }
}

export const removeLocalUserData = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(USER_DATA),
      window.localStorage.removeItem(ACCESS_TOKEN),
      window.localStorage.removeItem(REFRESH_TOKEN)
  }
}

export const setTemporaryToken = (temporaryToken: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(TEMPORARY_TOKEN, temporaryToken)
  }
}

export const getTemporaryToken = () => {
  if (typeof window !== 'undefined') {
    return { temporaryToken: window.localStorage.getItem(TEMPORARY_TOKEN) }
  }
}

export const clearTemporaryToken = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TEMPORARY_TOKEN)
  }
}

export const setPreGoogleToken = (PreGoogleToken: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PRE_GOOGLE_TOKEN, PreGoogleToken)
  }
}

export const getPreGoogleToken = () => {
  if (typeof window !== 'undefined') {
    return { PreGoogleToken: window.localStorage.getItem(PRE_GOOGLE_TOKEN) }
  }
}

export const clearPreGoogleToken = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(PRE_GOOGLE_TOKEN)
  }
}

export const getOrderItem = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(ORDER_ITEM)
  }
}

export const setOrderItem = (data: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ORDER_ITEM, data)
  }
}
