// ** Next
import { useRouter } from 'next/router'

// ** React Imports
import { ReactElement, ReactNode, useEffect } from 'react'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** LocalStorage
import { getLocalUserData, removeLocalUserData } from 'src/helpers/storage'

interface NoGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

// guest guard : logged
const NoGuard = (props: NoGuardProps) => {
  const { children, fallback } = props
  const authContext = useAuth()

  if (authContext.loading) return fallback

  return <>{children}</>
}

export default NoGuard
