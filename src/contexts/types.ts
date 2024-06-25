export type ErrCallbackType = (err: any) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
  deviceToken?: string
}

export type RegisterParams = {
  idToken: string
}

export type LoginParamsGoogle = {
  idToken: string
  rememberMe?: boolean
  deviceToken?: string
}

export type RegisterParamsGoogle = {
  idToken: string
}

export type TForgotPassword = {
  email: string
}

export type TResetPassword = {
  newPassword: string
  secretKey: string
}

export type LoginParamsFacebook = {
  idToken: string
  rememberMe?: boolean
  deviceToken?: string
}

export type RegisterParamsFacebook = {
  idToken: string
}

export type UserDataType = {
  id: number
  role: string
  email: string
  firstName: string
  lastName: string
  middleName: string
  fullName?: string
  username: string
  password: string
  avatar?: string | null
  likedProducts: string[]
  phoneNumber: string
  city: string
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null | any
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  loginGoogle: (params: LoginParamsGoogle, errorCallback?: ErrCallbackType) => void
  loginFacebook: (params: LoginParamsGoogle, errorCallback?: ErrCallbackType) => void
}
