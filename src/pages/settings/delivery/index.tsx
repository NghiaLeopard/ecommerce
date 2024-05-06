// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'

// ** Page
import MyProfilePage from 'src/view/pages/my-profile'

type TProps = {}

const Delivery: NextPage<TProps> = () => {
  return <h1>Delivery</h1>
}

export default Delivery

Delivery.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
