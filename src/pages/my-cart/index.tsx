// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import LayoutNotApp from 'src/view/layout/LayoutNotApp'

// ** Page
import MyCartPage from 'src/view/pages/my-cart'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <MyCartPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
