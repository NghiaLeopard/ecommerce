// ** Next
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

// ** React
import { ReactNode } from 'react'
import { getAllProductsRelevant, getDetailProductsPublic } from 'src/services/products'
import { TProduct } from 'src/types/products'
import { convertHTMLtoText } from 'src/utils'

// **Layout
import LayoutNotApp from 'src/view/layout/LayoutNotApp'

// ** Page
import ProductDetail from 'src/view/pages/product/index'

// ** Page

type TProps = {}

type TServerSide = {
  listProductDetail: TProduct
  listProductRelate: TProduct[]
}

const Index: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = props => {
  const { listProductDetail, listProductRelate } = props
  console.log(listProductDetail)
  const title = listProductDetail?.name
  const description = convertHTMLtoText(listProductDetail?.description)

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='author' content={'Nguyễn Đại Nghĩa'} />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        {/* <meta name='image' content={imageUrl} /> */}

        {/* Facebook */}
        <meta property='og:type' content='website' />
        <meta name='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta name='og:viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ProductDetail listProductDetail={listProductDetail} listProductRelate={listProductRelate} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<TServerSide> = async context => {
  try {
    const slug = context?.params?.productSlug
    const resRelevant = await getAllProductsRelevant({ params: { slug: slug as string } })
    const resDetail = await getDetailProductsPublic(slug as string)

    return {
      props: {
        listProductDetail: resDetail?.data,
        listProductRelate: resRelevant?.data?.products
      }
    }
  } catch (error) {
    return {
      props: {
        listProductDetail: [],
        listProductRelate: []
      }
    }
  }
}

Index.guestGuard = false
Index.authGuard = false

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>

export default Index
