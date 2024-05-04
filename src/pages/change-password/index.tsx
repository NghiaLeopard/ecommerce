// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import LayoutNotApp from 'src/view/layout/LayoutNotApp'
import ChangePasswordPage from 'src/view/pages/change-password'

// ** Page

type TProps = {}

const ChangePassword: NextPage<TProps> = () => {
  return <ChangePasswordPage />
}

export default ChangePassword

ChangePassword.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
