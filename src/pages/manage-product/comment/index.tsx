// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'

// ** Page
import CommentsPage from 'src/view/pages/manage-product/comment'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <CommentsPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
