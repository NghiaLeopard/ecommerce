export type TParamsGetRoles = {
  limit: number
  page: number
  search: string
  order: string
}

export type TParamsEditRole = {
  idRole: string
  name: string
  permissions: []
}

export type TParamsCreateRole = {
  name: string
  permissions: []
}
