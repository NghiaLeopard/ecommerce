// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import LayoutNotApp from 'src/view/layout/LayoutNotApp'

// ** Page
import MyOrderPage from 'src/view/pages/my-order'
import DetailMyOrder from 'src/view/pages/my-order/DetailMyOrder'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <DetailMyOrder />
}

export default Index

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
