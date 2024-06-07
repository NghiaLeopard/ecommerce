// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'
import { CONFIG_PERMISSIONS } from 'src/configs/permission'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'
import UserPage from 'src/view/pages/system/user'

// ** Page

type TProps = {}

const User: NextPage<TProps> = () => {
  return <UserPage />
}

User.permissions = [CONFIG_PERMISSIONS.SYSTEM.USER.VIEW]

export default User

User.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
