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
  user: string,
  deliveryMethod: string
}
