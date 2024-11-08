// ** Config
import { API_ENDPOINT } from 'src/configs/api'

// ** Helper
import instanceAxios from 'src/helpers/axios'

export const getReportUserType = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.REPORT.INDEX}/user-type/count`)

    return res.data
  } catch (error) {
    return error
  }
}

export const getReportProductStatus = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.REPORT.INDEX}/product-status/count`)

    return res.data
  } catch (error) {
    return error
  }
}

export const getReportAllRecordsCount = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.REPORT.INDEX}/all-records/count`)

    return res.data
  } catch (error) {
    return error
  }
}

export const getReportCardProductType = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.REPORT.INDEX}/product-type/count`)

    return res.data
  } catch (error) {
    return error
  }
}

export const getReportRevenueTotal = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.REPORT.INDEX}/revenue-total`)

    return res.data
  } catch (error) {
    return error
  }
}

export const getReportOrderStatus = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.REPORT.INDEX}/order-status/count`)

    return res.data
  } catch (error) {
    return error
  }
}
