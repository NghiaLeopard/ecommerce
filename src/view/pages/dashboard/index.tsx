// ** React
import { useEffect, useState } from 'react'

// ** Service
import { getReportAllRecordsCount, getReportCardProductType } from 'src/services/report'

// ** Component
import CardCountAllRecord from './components/CardCountAllRecord'
import Spinner from 'src/components/spinner'
import CardProductType from './components/CardProductType'
import { Grid } from '@mui/material'

const DashboardPage = () => {
  const [loading, setLoading] = useState(false)
  const [reportAllRecords, setReportAllRecords] = useState<Record<string, number>>({})
  const [reportProductType, setReportProductType] = useState<Record<string, string>[]>([])

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

  useEffect(() => {
    fetchReportAllRecordCount()
    fetchReportProductType()
  }, [])

  return (
    <>
      {loading && <Spinner />}

      <CardCountAllRecord listRecords={reportAllRecords} />
      <Grid container mt={5}>
        <Grid item md={6}>
          <CardProductType listProductType={reportProductType}/>
        </Grid>
      </Grid>
    </>
  )
}

export default DashboardPage
