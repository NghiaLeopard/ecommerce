// ** Axios
import instanceAxios from 'src/helpers/axios'

// ** Config
import { CONFIG_API } from 'src/configs/api'
import { LoginParams } from 'src/contexts/types'

export const loginAuth = async (data: LoginParams) => {
  try {
    const res = await instanceAxios.post(`${CONFIG_API.AUTH.INDEX}/login`, data)

    return res.data
  } catch (error) {
    return null
  }
}
