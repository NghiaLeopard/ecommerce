// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import BlankLayout from 'src/view/layout/BlankLayout'

// ** Page
import LoginPage from 'src/view/pages/login'

type TProps = {}

const Login: NextPage<TProps> = () => {
  return <LoginPage />
}

export default Login

Login.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
Login.guestGuard = true
