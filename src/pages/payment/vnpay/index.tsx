// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import LayoutNotApp from 'src/view/layout/LayoutNotApp'

// ** Page
import PaymentPage from 'src/view/pages/payment'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <PaymentPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
