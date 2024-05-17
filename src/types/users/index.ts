export type TParamsGetUsers = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsEditUsers = {
  idUsers?: string
  email: string
  password: string
  role: string
  firstName: string
  middleName: string
  lastName: string
  phoneNumber: string
  city: string
  address: string
  status?: number
}

export type TParamsCreateUsers = {
  email: string
  password: string
  role: string
  firstName: string
  middleName: string
  lastName: string
  phoneNumber: string
  city: string
  address: string
  status?: number
  avatar: string
}
