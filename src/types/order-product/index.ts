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

export type TOrderedProduct = {
  name: string
  amount: number
  image: string
  price: number
  discount: number
  product: { _id: string; slug: string; countInStock: number }
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
  status?: number | string
  search?: string
  order?: string
}

export type TItemOrderMe = {
  shippingAddress: {
    fullName: string
    address: string
    city: {
      _id: string
      name: string
    }
    phone: number
  }
  _id: string
  orderItems: TOrderedProduct[]
  totalPrice: number
  itemsPrice: number
  shippingPrice: number
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
