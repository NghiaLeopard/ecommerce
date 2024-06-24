// ** React
import { useEffect, useState } from 'react'

// ** Service
import {
  getReportAllRecordsCount,
  getReportCardProductType,
  getReportOrderStatus,
  getReportRevenueTotal,
  getReportUserType
} from 'src/services/report'

// ** Component
import CardCountAllRecord from './components/CardCountAllRecord'
import Spinner from 'src/components/spinner'
import CardRevenueTotal from './components/CardRevenueTotal'
import CardProductType from './components/CardProductType'

// ** MUI
import { Grid } from '@mui/material'
import { CardOrderStatus } from './components/CardOrderStatus'
import { CardUserType } from './components/CardUserType'
import { getAllProducts } from 'src/services/products'
import { TProduct } from 'src/types/products'
import CardPopularProduct from './components/CardPopularProduct'

const DashboardPage = () => {
  const [loading, setLoading] = useState(false)
  const [reportAllRecords, setReportAllRecords] = useState<Record<string, number>>({})
  const [reportProductType, setReportProductType] = useState<Record<string, string>[]>([])
  const [reportRevenueTotal, setReportRevenueTotal] = useState<Record<string, string>[]>([])
  const [reportUserType, setReportUserType] = useState<Record<number, number>>({} as any)
  const [reportOrderStatus, setReportOrderStatus] = useState<Record<number, number>>({} as any)
  const [listDataSold, setListDataSold] = useState<TProduct[]>([])

  const fetchReportAllRecordCount = async () => {
    setLoading(true)
    try {
      const response = await getReportAllRecordsCount()
      setLoading(false)
      setReportAllRecords(response.data)
    } catch (error) {
      setLoading(false)
    }
  }

  const fetchReportProductType = async () => {
    setLoading(true)
    try {
      const response = await getReportCardProductType()
      setLoading(false)
      setReportProductType(response.data)
    } catch (error) {
      setLoading(false)
    }
  }

  const fetchReportRevenueTotal = async () => {
    setLoading(true)
    try {
      const response = await getReportRevenueTotal()
      setLoading(false)
      setReportRevenueTotal(response.data)
    } catch (error) {
      setLoading(false)
    }
  }

  const fetchReportUserType = async () => {
    setLoading(true)
    try {
      const response = await getReportUserType()
      setLoading(false)
      setReportUserType(response?.data?.data)
    } catch (error) {
      setLoading(false)
    }
  }

  const fetchReportOrderStatus = async () => {
    setLoading(true)
    try {
      const response = await getReportOrderStatus()
      setLoading(false)
      setReportOrderStatus(response?.data?.data)
    } catch (error) {
      setLoading(false)
    }
  }

  const fetchListProduct = async () => {
    setLoading(true)
    try {
      const res = await getAllProducts({
        params: {
          limit: 5,
          page: 1,
          order: 'sold desc'
        }
      })
      setLoading(false)
      setListDataSold(res?.data?.products)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportOrderStatus()
    fetchReportAllRecordCount()
    fetchListProduct()
    fetchReportProductType()
    fetchReportRevenueTotal()
    fetchReportUserType()
  }, [])

  return (
    <>
      {loading && <Spinner />}

      <CardCountAllRecord listRecords={reportAllRecords} />
      <Grid container mt={3} spacing={5}>
        <Grid item md={6} xs={12}>
          <CardProductType listProductType={reportProductType} />
        </Grid>
        <Grid item md={6} xs={12}>
          <CardRevenueTotal listRevenueTotal={reportRevenueTotal} />
        </Grid>
        <Grid item md={4} xs={12}>
          <CardPopularProduct listData={listDataSold} />
        </Grid>
        <Grid item md={4} xs={12}>
          <CardOrderStatus item={reportOrderStatus} />
        </Grid>
        <Grid item md={4} xs={12}>
          <CardUserType item={reportUserType} />
        </Grid>
      </Grid>
    </>
  )
}

export default DashboardPage
