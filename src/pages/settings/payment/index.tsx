// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'

// ** Page
import PaymentPage from 'src/view/pages/settings/payment'

type TProps = {}

const Payment: NextPage<TProps> = () => {
  return <PaymentPage />
}

export default Payment

Payment.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
