// ** Axios
import axios from 'axios'

// ** Config
import { CONFIG_API } from 'src/configs/api'
import { LoginParams } from 'src/contexts/types'

export const loginAuth = async (data: LoginParams) => {
  try {
    const res = await axios.post(CONFIG_API.AUTH.INDEX, data)

    return res.data
  } catch (error) {
    return null
  }
}
