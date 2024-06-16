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

export type TUpdateOrderProduct = {
  shippingAddress: {
    fullName: string
    address: string
    city: string
    phone: string
  }
  orderItems: TOrderedProduct[]
  isPaid: boolean
  isDelivered: boolean
  _id: string
}

export type TParamsGetOrderMe = {
  limit: number
  page: number
  status?: number | string
  search?: string
  order?: string
}

export type TParamsGetOrderCMS = {
  limit: number
  page: number
  status?: number | string
  search?: string
  order?: string
  userId?: string
  productId?: string
  cityId?: string
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
  paidAt: string
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
  paymentMethod: {
    name: string
    type: string
    _id: string
  }
}

export type TItemOrderCMS = {
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
