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
