export type TCreateVnPay = {
  totalPrice: number
  language: string
  orderId: string
}

export type TGetVnPayIpn = {
  vnp_SecureHash: string
  vnp_TxnRef: string
  vnp_ResponseCode: string
  orderId: string
}
