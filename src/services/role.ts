// Helper
import instanceAxios from 'src/helpers/axios'

// ** Configs
import { API_ENDPOINT } from 'src/configs/api'

// ** Type
import { TParamsGetRoles } from 'src/types/role'

export const getAllRoles = async (data: { params: TParamsGetRoles }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.ROLE.INDEX}`, data)

    return res.data
  } catch (error) {
    return error
  }
}
