// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import LayoutNotApp from 'src/view/layout/LayoutNotApp'
import ProductDetail from 'src/view/pages/product/ProductDetail'

// ** Page

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <ProductDetail />
}

export default Index

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
