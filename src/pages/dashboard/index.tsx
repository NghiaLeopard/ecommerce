//** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

//** Layout
import UserLayout from 'src/view/layout/UserLayout'
import DashboardPage from 'src/view/pages/dashboard'

// **

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <DashboardPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
