// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import LayoutNotApp from 'src/view/layout/LayoutNotApp'

// ** Page
import MyProfilePage from 'src/view/pages/my-profile'

type TProps = {}

const MyProfile: NextPage<TProps> = () => {
  return <MyProfilePage />
}

export default MyProfile

MyProfile.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
