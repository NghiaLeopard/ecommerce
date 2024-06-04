// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import LayoutNotApp from 'src/view/layout/LayoutNotApp'

// ** Page
import MyProductPage from 'src/view/pages/my-product'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <MyProductPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
