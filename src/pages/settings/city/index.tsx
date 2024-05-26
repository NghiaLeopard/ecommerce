// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'
import { CONFIG_PERMISSIONS } from 'src/configs/permission'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'
import CityPage from 'src/view/pages/settings/city/CityPage'

// ** Page

type TProps = {}

const City: NextPage<TProps> = () => {
  return <CityPage />
}

export default City

City.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
