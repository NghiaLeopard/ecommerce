import {
  ACCESS_TOKEN,
  ORDER_ITEM,
  AUTH_SOCIAL_TOKEN,
  REFRESH_TOKEN,
  TEMPORARY_TOKEN,
  USER_DATA,
  REMEMBER_AUTH
} from 'src/configs/auth'
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

export const setAuthSocialToken = (authSocialToken: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(AUTH_SOCIAL_TOKEN, authSocialToken)
  }
}

export const getAuthSocialToken = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(AUTH_SOCIAL_TOKEN)
  }
}

export const clearAuthSocialToken = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(AUTH_SOCIAL_TOKEN)
  }
}

export const setRememberAuth = (PreGoogleToken: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(REMEMBER_AUTH, PreGoogleToken)
  }
}

export const getRememberAuth = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(REMEMBER_AUTH)
  }
}

export const clearRememberAuth = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(REMEMBER_AUTH)
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
