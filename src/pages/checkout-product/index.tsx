//** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

//** Layout
import LayoutNotApp from 'src/view/layout/LayoutNotApp'

// ** Page
import CheckOutProductPage from 'src/view/pages/checkout-product'

// **Type
type TProps = {}

const Index: NextPage<TProps> = () => {
  return <CheckOutProductPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
