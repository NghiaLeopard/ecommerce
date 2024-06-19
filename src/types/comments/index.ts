export type TParamsGetComments = {
  limit?: number
  page?: number
  search?: string
  order?: string
  productId?: string
  userId?: string
}

export type TParamsGetCommentsPublic = {
  limit?: number
  page?: number
  search?: string
  order?: string
  productId?: string
  userId?: string
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
  replies: TComment[]
  user: { id: string; firstName: string; middleName: string; lastName: string,avatar: string }
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
