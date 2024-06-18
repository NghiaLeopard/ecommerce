export type TParamsGetComments = {
  limit?: number
  page?: number
  search?: string
  order?: string
  minStar?: number
}

export type TParamsEditComments = {
  commentId: string
  content: string
  product: string
  user: string
}

export type TCreateCommentsProduct = {
  content: string
  product: string
  user: string
}

export type TComment = {
  content: string
  product: { id: string; name: string }
  replies: []
  user: { id: string; firstName: string; middleName: string; lastName: string }
  _id: string
}

export type TParamsDeleteManyComments = {
  commentIds: string[]
}

export type TParamsEditCommentsMe = {
  commentId: string
  content: string
  star: number
  product: string
  user: string
}
