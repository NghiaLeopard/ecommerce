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

export type TParamsCreateReviews = {
  content: string
  star: number
  product: string
  user: string
}

export type TParamsDeleteManyReviews = {
  reviewIds: string[]
}
