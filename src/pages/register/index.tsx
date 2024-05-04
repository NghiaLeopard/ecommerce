//** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

//** Layout
import BlankLayout from 'src/view/layout/BlankLayout'

// **Page
import RegisterPage from 'src/view/pages/register'

type TProps = {}

const Register: NextPage<TProps> = () => {
  return <RegisterPage />
}

export default Register

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
Register.guestGuard = true
