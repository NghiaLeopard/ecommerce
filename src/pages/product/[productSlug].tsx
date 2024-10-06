// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import LayoutNotApp from 'src/view/layout/LayoutNotApp'
import ProductDetail from 'src/view/pages/product/index'

// ** Page

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <ProductDetail />
}

Index.guestGuard = false
Index.authGuard = false

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>

export default Index
