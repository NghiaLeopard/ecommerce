// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'

// ** Page
import OrderPage from 'src/view/pages/manage-order/order'

type TProps = {}

const Order: NextPage<TProps> = () => {
  return <OrderPage />
}

Order.permissions = ['MANEGE_ORDER.ORDER.VIEW']

export default Order

Order.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
