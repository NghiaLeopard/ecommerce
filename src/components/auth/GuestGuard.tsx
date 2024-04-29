// ** Next
import { useRouter } from 'next/router'

// ** React Imports
import { ReactElement, ReactNode, useEffect } from 'react'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** LocalStorage
import { getLocalUserData, removeLocalUserData } from 'src/helpers/storage'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

// guest guard : logged
const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const authContext = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (getLocalUserData().userData && getLocalUserData().accessToken) {
      router.replace('/')
    }
  }, [router])

  if (authContext.loading || (!authContext.loading && authContext.user !== null)) return fallback

  return <>{children}</>
}

export default GuestGuard
