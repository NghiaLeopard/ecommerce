// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'
import { CONFIG_PERMISSIONS } from 'src/configs/permission'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'

// ** Page
import MyProfilePage from 'src/view/pages/my-profile'

type TProps = {}

const User: NextPage<TProps> = () => {
  return <h1>User</h1>
}

User.permissions = [CONFIG_PERMISSIONS.SYSTEM.USER.VIEW]

export default User

User.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
