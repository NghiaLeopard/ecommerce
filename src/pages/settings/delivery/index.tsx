// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'
import { CONFIG_PERMISSIONS } from 'src/configs/permission'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'

// ** Page
import MyProfilePage from 'src/view/pages/my-profile'
import DeliveryPage from 'src/view/pages/settings/delivery/DeliveryPage'

type TProps = {}

const Delivery: NextPage<TProps> = () => {
  return <DeliveryPage />
}

export default Delivery

Delivery.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
