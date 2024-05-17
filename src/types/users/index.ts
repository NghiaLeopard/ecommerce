export type TParamsGetUsers = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsEditUsers = {
  idUsers: string
  name: string
  permissions: string[]
}

export type TParamsCreateUsers = {
  name: string
  permissions: string[]
}
