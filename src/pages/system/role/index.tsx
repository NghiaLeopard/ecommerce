// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'
import { CONFIG_PERMISSIONS } from 'src/configs/permission'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'

// ** Page
import RoleListPage from 'src/view/pages/system/role/RoleList'

type TProps = {}

const Role: NextPage<TProps> = () => {
  return <RoleListPage />
}

Role.permissions = [CONFIG_PERMISSIONS.SYSTEM.ROLE.VIEW]

export default Role

Role.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
