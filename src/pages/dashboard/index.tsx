//** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

//** Layout
import UserLayout from 'src/view/layout/UserLayout'

// **

type TProps = {}

const Dashboard: NextPage<TProps> = () => {
  return <h1>This is dashboard</h1>
}

export default Dashboard

Dashboard.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
