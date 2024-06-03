export type TParamsGetProducts = {
  limit?: number
  page?: number
  search?: string
  order?: string
  status?: string
  productType?: string
}

export type TParamsRelated = {
  slug: string
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsEditProducts = {
  idProducts?: string
  name: string
  status?: number
  image: string
  type: string
  location: string
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
  location: string
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
  location: {
    id: string
    name: string
  }
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
  city: string
  type: {
    _id: string
    name: string
  }
}
