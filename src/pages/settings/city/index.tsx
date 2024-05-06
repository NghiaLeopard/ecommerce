// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'

// ** Page
import MyProfilePage from 'src/view/pages/my-profile'

type TProps = {}

const City: NextPage<TProps> = () => {
  return <h1>City</h1>
}

export default City

City.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
