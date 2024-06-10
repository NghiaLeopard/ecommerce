export type TOrderProduct = {
  name: string
  amount: number
  image: string
  price: number
  discount: number
  product: string
  slug: string
  discountEndDate: Date | null
  discountStartDate: Date | null
}

export type TCreateOrderProduct = {
  orderItems: TOrderProduct[]
  fullName: string
  address: string
  city: string
  phone: number
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
  user: string
  deliveryMethod: string
}

export type TParamsGetOrderMe = {
  limit: number
  page: number
  status?: number
  search?: string
  order?: string
}

export type TItemOrderMe = {
  shippingAddress: {
    fullName: string
    address: string
    city: string
    phone: number
  }
  _id: string
  orderItems: TOrderProduct[]
  totalPrice: number
  user: {
    _id: string
    firstName: string
    lastName: string
    middleName: string
  }
  isPaid: number
  isDelivered: number
  status: number
}
