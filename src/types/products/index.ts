export type TParamsGetProducts = {
  limit?: number
  page?: number
  search?: string
  order?: string
  status?: string
  productType?: string
}

export type TParamsEditProducts = {
  idProducts?: string
  name: string
  status?: number
  image: string
  type: string
  countInStock: number
  price: number
  description: string
  discount: number
  slug: string
  discountStartDate: Date | null
  discountEndDate: Date | null
}

export type TParamsCreateProducts = {
  name: string
  status?: number
  image: string
  type: string
  countInStock: number
  price: number
  description: string
  discount: number
  slug: string
  discountStartDate: Date | null
  discountEndDate: Date | null
}

export type TParamsDeleteManyProducts = {
  productTypeIds: string[]
}
