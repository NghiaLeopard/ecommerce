// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'
import ProductTypesPage from 'src/view/pages/manage-product/product-types/ProductTypesPage'

// ** Page

type TProps = {}

const TypeProduct: NextPage<TProps> = () => {
  return <ProductTypesPage />
}

export default TypeProduct

TypeProduct.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
