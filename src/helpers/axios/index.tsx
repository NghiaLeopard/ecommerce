// ** Next
import { NextRouter, useRouter } from 'next/router'

// ** React
import { FC, ReactNode } from 'react'

// ** Axios
import axios from 'axios'

// ** Configs
import { BASE_URL, CONFIG_API } from 'src/configs/api'

// ** Local storage
import { getLocalUserData, removeLocalUserData } from '../storage'

// ** Jwt
import { jwtDecode } from 'jwt-decode'

// ** Context
import { UserDataType } from 'src/contexts/types'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

type TAxiosInterceptor = {
  children: ReactNode
}

const instanceAxios = axios.create({ baseURL: BASE_URL })

const handleRedirectLogin = (router: NextRouter, setUser: (data: UserDataType | null) => void) => {
  if (router.asPath !== '/') {
    router.replace({
      pathname: 'login',
      query: { returnUrl: router.asPath }
    })
  } else {
    router.replace('/login')
  }
  removeLocalUserData()
  setUser(null)
}

const AxiosInterceptor: FC<TAxiosInterceptor> = ({ children }) => {
  const router = useRouter()
  const { setUser } = useAuth()

  instanceAxios.interceptors.request.use(
    async function (config) {
      const { accessToken, refreshToken } = getLocalUserData()

      if (accessToken) {
        const decodeAccessToken: any = jwtDecode(accessToken)

        if (decodeAccessToken.exp > Date.now() / 1000) {
          config.headers['Authorization'] = `Bearer ${accessToken}`
        } else {
          if (refreshToken) {
            const decodeRefreshToken: any = jwtDecode(refreshToken)
            if (decodeRefreshToken?.exp > Date.now() / 1000) {
              await axios
                .post(
                  `${CONFIG_API.AUTH.INDEX}/refresh-token`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${refreshToken}`
                    }
                  }
                )
                .then(res => {
                  if (res?.data?.data.access_token) {
                    config.headers['Authorization'] = `Bearer ${res?.data?.data.access_token}`
                  } else {
                    handleRedirectLogin(router, setUser)
                  }
                })
                .catch(() => {
                  handleRedirectLogin(router, setUser)
                })
            } else {
              handleRedirectLogin(router, setUser)
            }
          } else {
            handleRedirectLogin(router, setUser)
          }
        }
      } else {
        handleRedirectLogin(router, setUser)
      }

      return config
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error)
    }
  )

  // Add a response interceptor
  instanceAxios.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  return <>{children}</>
}

export default instanceAxios

export { AxiosInterceptor }
