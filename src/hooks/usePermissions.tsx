import { useEffect, useState } from 'react'
import { CONFIG_PERMISSIONS } from 'src/configs/permission'
import { useAuth } from './useAuth'

type TAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW'

const defaultActions = {
  CREATE: false,
  UPDATE: false,
  DELETE: false,
  VIEW: false
}

export const usePermissions = (keys: string, action: TAction[]) => {
  const [newPermission, setNewPermissions] = useState(defaultActions)
  const { user } = useAuth()

  const permissionsUser = user?.role?.permissions

  const getPermissionOfObj = (permission: any, key: string) => {
    const nameKeys = key.split('.')
    for (const key in permission) {
      if (nameKeys?.includes(key) && !!key.length) {
        for (const k in permission[key]) {
          if (nameKeys.includes(k)) {
            return permission[key][k]
          }
        }
      }
    }
  }

  useEffect(() => {
    const result = getPermissionOfObj(CONFIG_PERMISSIONS, keys)
    action?.forEach(mode => {
      if (permissionsUser?.includes(CONFIG_PERMISSIONS.ADMIN)) {
        defaultActions[mode] = true
      } else if (permissionsUser?.includes(result[mode])) {
        defaultActions[mode] = true
      } else {
        defaultActions[mode] = false
      }
    })
    setNewPermissions(defaultActions)
  }, [user?.role])

  return newPermission
}
