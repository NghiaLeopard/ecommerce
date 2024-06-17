// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'
import BlankLayout from 'src/view/layout/BlankLayout'

// **Layout
import ChangePasswordPage from 'src/view/pages/change-password'
import ResetPasswordPage from 'src/view/pages/reset-password'

// ** Page

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <ResetPasswordPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
Index.guestGuard = true
