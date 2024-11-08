// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'
import { CONFIG_PERMISSIONS } from 'src/configs/permission'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'
import ProductsPage from 'src/view/pages/manage-product/products/Products'

// ** Page
import MyProfilePage from 'src/view/pages/my-profile'

type TProps = {}

const Product: NextPage<TProps> = () => {
  return <ProductsPage />
}

Product.permissions = [CONFIG_PERMISSIONS.MANAGE_PRODUCT.PRODUCT.VIEW]

export default Product

Product.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
