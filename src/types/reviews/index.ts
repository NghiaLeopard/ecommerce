export type TParamsGetReviews = {
  limit?: number
  page?: number
  search?: string
  order?: string
  minStar?: number
}

export type TParamsEditReviews = {
  reviewId: string
  content: string
  star: number
}

export type TParamsEditReviewsMe = {
  reviewId: string
  content: string
  star: number
  product: string
  user: string
}

export type TParamsCreateReviews = {
  content: string
  star: number
  product: string
  user: string
}

export type TParamsDeleteManyReviews = {
  reviewIds: string[]
}

export type TReviewsProduct = {
  content: string
  product: { _id: string; name: string }
  star: number
  updatedAt: string
  user: {
    _id: string
    firstName: string
    lastName: string
    middleName: string
    avatar: string
  }
  _id: string
}
