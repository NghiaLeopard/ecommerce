export type TParamsGetProducts = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsEditProducts = {
  idProducts?: string
  name: string
  slug: string
}

export type TParamsCreateProducts = {
  name: string
  slug: string
}

export type TParamsDeleteManyProducts = {
  productTypeIds: string[]
}
