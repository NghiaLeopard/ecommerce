// ** Next
import { useRouter } from 'next/router'

// ** React
import { ReactNode, createContext, useEffect, useState } from 'react'

// ** Types
import { AuthValuesType, ErrCallbackType, LoginParams, LoginParamsGoogle, UserDataType } from './types'

// ** Services
import { loginAuth, loginAuthGoogle, logoutAuth } from 'src/services/auth'

// ** Configs
import { LIST_ROUTE_PUBLIC } from 'src/configs/auth'
import { API_ENDPOINT } from 'src/configs/api'

import { useSession, signIn, signOut } from 'next-auth/react'

// ** Helpers
import {
  clearPreGoogleToken,
  clearTemporaryToken,
  getLocalUserData,
  getTemporaryToken,
  removeLocalUserData,
  setLocalUserData,
  setTemporaryToken
} from 'src/helpers/storage'

// ** Axios
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

// ** Helper
import instanceAxios from 'src/helpers/axios'

// ** Store
import { updateToCart } from 'src/stores/order-product'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  loginGoogle: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  const dispatch = useDispatch()

  // this useEffect is impact : when refresh page : call api/auth/me with accessToken
  // access token contains information to know : who account ?
  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = getLocalUserData()?.accessToken
      const temporaryToken = getTemporaryToken()?.temporaryToken

      if (storedToken || temporaryToken) {
        setLoading(true)
        await instanceAxios
          .get(API_ENDPOINT.AUTH.AUTH_ME)
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.data })
          })
          .catch(() => {
            removeLocalUserData()
            setUser(null)
            setLoading(false)
            if (router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // when login is success, initialize data
  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    loginAuth({ email: params.email, password: params.password })
      .then(async response => {
        params.rememberMe
          ? setLocalUserData(
              JSON.stringify(response.data.user),
              response.data.access_token,
              response.data.refresh_token
            )
          : setTemporaryToken(response.data.access_token)

        const returnUrl = router.query.returnUrl

        toast.success(response?.message)
        setUser({ ...response.data.user })

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLoginGoogle = (params: LoginParamsGoogle, errorCallback?: ErrCallbackType) => {
    loginAuthGoogle({ idToken: params.idToken })
      .then(async response => {
        params.rememberMe
          ? setLocalUserData(
              JSON.stringify(response.data.user),
              response.data.access_token,
              response.data.refresh_token
            )
          : setTemporaryToken(response.data.access_token)

        const returnUrl = router.query.returnUrl

        toast.success(response?.message)
        setUser({ ...response.data.user })

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    logoutAuth().then(res => {
      setUser(null)
      removeLocalUserData()
      clearTemporaryToken()
      dispatch(
        updateToCart({
          orderItem: []
        })
      )

      if (!LIST_ROUTE_PUBLIC.some((item: string) => router.asPath.startsWith(item))) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrk: router.asPath }
          })
        } else {
          router.replace('/')
        }
      }
    })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    loginGoogle: handleLoginGoogle
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
