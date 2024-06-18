// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'
import CommentPage from 'src/view/pages/manage-product/comment'

// ** Page

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <CommentPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
