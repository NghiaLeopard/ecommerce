export type TParamsGetDeliveryType = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsEditDeliveryType = {
  idDeliveryType?: string
  name: string
  price: number
}

export type TParamsCreateDeliveryType = {
  name: string
  price: number
}

export type TParamsDeleteManyDeliveryType = {
  deliveryTypeIds: string[]
}
