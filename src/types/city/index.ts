export type TParamsGetCity = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsEditCity = {
  idCity?: string
  name: string
}

export type TParamsCreateCity = {
  name: string
}

export type TParamsDeleteManyCity = {
  cityIds: string[]
}
