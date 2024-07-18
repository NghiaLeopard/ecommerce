// ** Next
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

// ** React
import { ReactNode } from 'react'

// ** Service
import { getAllProductTypes } from 'src/services/product-types'
import { getAllProductsPublic } from 'src/services/products'

// ** Layout
import LayoutNotApp from 'src/view/layout/LayoutNotApp'

// ** View
import HomePage from 'src/view/pages/home'

type TProps = {}

type TServerSide = {
  data: []
  listProductTypes: Record<string, string>[]
  params: {
    limit: number
    page: number
    orderBy: string
    totalPage: number
    productType: string
  }
}

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = props => {
  return (
    <HomePage dataServer={props?.data} paramsServer={props?.params} listProductTypesServer={props?.listProductTypes} />
  )
}

export const getServerSideProps: GetServerSideProps<TServerSide> = async context => {
  const limit = 10
  const page = 1
  const orderBy = 'createAt desc'

  const response = await getAllProductTypes({ params: { limit: -1, page: -1 } })

  const res = await getAllProductsPublic({
    params: { limit: 10, page: 1, order: orderBy, productType: response?.data?.productTypes?.[0]?._id }
  })

  console.log(res)

  if (res) {
    if (response?.data?.productTypes) {
      return {
        props: {
          data: res?.data?.products,
          listProductTypes: response?.data?.productTypes,
          params: {
            limit: limit,
            totalPage: res?.data?.totalPage,
            page: page,
            orderBy: orderBy,
            productType: response?.data?.productTypes[0]?._id
          }
        }
      }
    }
  }

  return {
    props: {
      data: [],
      listProductTypes: [],
      params: {
        limit: 10,
        page: 1,
        orderBy: '',
        totalPage: 0,
        productType: ''
      }
    }
  }
}

Home.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
Home.guestGuard = false
Home.authGuard = false
Home.title = 'Ecommerce'
Home.description = 'Home Ecommerce'
Home.keywords = 'Home Product'

export default Home
