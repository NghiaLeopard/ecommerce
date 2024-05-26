export type TParamsGetPaymentType = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsEditPaymentType = {
  name: string
  type: string
  idPaymentType: string
}

export type TParamsCreatePaymentType = {
  name: string
  type: string
}

export type TParamsDeleteManyPaymentType = {
  paymentTypeIds: string[]
}
