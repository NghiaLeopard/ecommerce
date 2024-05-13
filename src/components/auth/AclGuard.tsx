/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { buildAbilityFor, type ACLObj, type AppAbility } from 'src/configs/acl'

// ** Layout
import BlankLayout from 'src/view/layout/BlankLayout'

// ** Components
import NotAuthorized from 'src/pages/401'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Router
import { useRouter } from 'next/router'

// ** Acl
import { AbilityContext } from '../acl/Can'
import { CONFIG_PERMISSIONS } from 'src/configs/permission'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
  permissions?: string[]
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true, permissions } = props

  const auth = useAuth()
  const router = useRouter()

  // check BASIC , because BASIC just have permissions VIEW DASHBOARD
  // const permissionUser = auth.user?.role?.permissions
  //   ? auth.user?.role?.permissions.includes(CONFIG_PERMISSIONS.BASIC)
  //     ? [CONFIG_PERMISSIONS.BASIC]
  //     : auth.user?.role?.permissions
  //   : []

  const permissionUser = [CONFIG_PERMISSIONS.SYSTEM.ROLE.VIEW]

  let ability: AppAbility

  if (auth.user && !ability) {
    ability = buildAbilityFor(permissionUser, permissions)
  }

  if (guestGuard || router.route === '/500' || router.route === '/400' || !authGuard) {
    if (auth.user && ability) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    }

    return children
  }

  // check the access off current user

  if (ability && auth.user && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
