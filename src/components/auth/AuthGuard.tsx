// **Next
import { useRouter } from 'next/router'

// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'
import { clearTemporaryToken, getLocalUserData, getTemporaryToken, removeLocalUserData } from 'src/helpers/storage'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const authContext = useAuth()
  const router = useRouter()
  useEffect(() => {
    // router.isReady is check first render
    // check first render to await authContext done and check authContext exactly!
    // avoid when render done but checked authGuard => conflict
    if (!router.isReady) {
      return
    }

    if (authContext.user === null && !getLocalUserData().userData && !getLocalUserData().accessToken) {
      // check asPath === login in case : api log in fail , url add returnUrl: login .
      if (router.asPath !== '/' && router.asPath !== '/login') {
        router.replace({
          pathname: 'login',
          query: { returnUrl: router.asPath }
        })
      } else {
        router.replace('/login')
      }
      removeLocalUserData()

      // clearTemporaryToken()
      authContext.setUser(null)
    }
  }, [router.route])

  // haven't route product , when initial url have pathname: /product then running to useEffect if haven't condition authContext.user === null , render will have a little page appear.

  if (authContext.loading || authContext.user === null) return fallback

  return <>{children}</>
}

export default AuthGuard
