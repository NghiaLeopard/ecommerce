// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'

// ** Page

import DeliveryPage from 'src/view/pages/settings/delivery'

type TProps = {}

const Delivery: NextPage<TProps> = () => {
  return <DeliveryPage />
}

export default Delivery

Delivery.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
