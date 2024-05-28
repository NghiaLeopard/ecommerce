export type TParamsGetProducts = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsEditProducts = {
  idProducts?: string
  name: string
  city?: string
  status?: number
  image: string
  type: string
  countInStock: number
  price: number
  rating: string
  description: string
  discount: number
  slug: string
  discountStartDate: Date | null
  discountEndDate: Date | null
}

export type TParamsCreateProducts = {
  name: string
  city?: string
  status?: number
  image: string
  type: string
  countInStock: number
  price: number
  rating: string
  description: string
  discount: number
  slug: string
  discountStartDate: Date | null
  discountEndDate: Date | null
}

export type TParamsDeleteManyProducts = {
  productTypeIds: string[]
}
