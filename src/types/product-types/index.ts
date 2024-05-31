export type TParamsGetProductTypes = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsEditProductTypes = {
  idProductTypes?: string
  name: string
  slug: string
}

export type TParamsCreateProductTypes = {
  name: string
  slug: string
}

export type TParamsDeleteManyProductTypes = {
  productTypeIds: string[]
}

export type TProductType = {
  label: string
  value: string
}
