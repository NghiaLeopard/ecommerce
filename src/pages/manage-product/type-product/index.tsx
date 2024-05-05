// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'

// ** Page
import MyProfilePage from 'src/view/pages/my-profile'

type TProps = {}

const TypeProduct: NextPage<TProps> = () => {
  return <MyProfilePage />
}

export default TypeProduct

TypeProduct.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
