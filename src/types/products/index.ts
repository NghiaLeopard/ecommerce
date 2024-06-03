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

export type TProduct = {
  countInStock: number
  createdAt: Date | null
  image: string
  name: string
  slug: string
  price: number
  status: string
  discount: number
  description: string
  averageRating: number
  discountStartDate?: Date | null
  discountEndDate?: Date | null
  _id: string
  type: {
    _id: string
    name: string
  }
}
