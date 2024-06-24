// ** React
import { useEffect, useState } from 'react'

// ** Service
import { getReportAllRecordsCount } from 'src/services/report'

// ** Component
import CardCountAllRecord from './components/CardCountAllRecord'
import Spinner from 'src/components/spinner'

const DashboardPage = () => {
  const [loading, setLoading] = useState(false)
  const [reportAllRecords, setReportAllRecords] = useState<Record<string, number>>({})

  const fetchReportProductStatus = async () => {
    setLoading(true)
    try {
      const response = await getReportAllRecordsCount()
      setLoading(false)
      setReportAllRecords(response.data)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportProductStatus()
  }, [])

  return (
    <>
      {loading && <Spinner />}

      <CardCountAllRecord listRecords={reportAllRecords} />
    </>
  )
}

export default DashboardPage
