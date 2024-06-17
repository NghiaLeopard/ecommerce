// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'
import BlankLayout from 'src/view/layout/BlankLayout'

// **Layout
import LayoutNotApp from 'src/view/layout/LayoutNotApp'

// ** Pages
import ForgotPasswordPage from 'src/view/pages/forgot-password'

// ** Page

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <ForgotPasswordPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Index.guestGuard = true
