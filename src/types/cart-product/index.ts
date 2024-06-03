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
