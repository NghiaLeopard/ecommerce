// **Next
import { useRouter } from 'next/router'

// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'
import { getLocalUserData, removeLocalUserData } from 'src/helpers/storage'

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
      if (router.asPath !== '/') {
        router.replace({
          pathname: 'login',
          query: { returnUrl: router.asPath }
        })
      } else {
        router.replace('/login')
      }
      removeLocalUserData()
      authContext.setUser(null)
    }
  }, [router.route])

  if (authContext.loading || authContext.user === null) return fallback

  return <>{children}</>
}

export default AuthGuard