// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// **Layout
import UserLayout from 'src/view/layout/UserLayout'

// ** Page
import ReviewsPage from 'src/view/pages/manage-order/reviews'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <ReviewsPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
