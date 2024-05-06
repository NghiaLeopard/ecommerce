// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'

// ** Page
import MyProfilePage from 'src/view/pages/my-profile'

type TProps = {}

const Payment: NextPage<TProps> = () => {
  return <h1>Payment</h1>
}

export default Payment

Payment.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
