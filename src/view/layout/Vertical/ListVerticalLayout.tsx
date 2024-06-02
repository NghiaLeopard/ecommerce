// ** Next
import { NextPage } from 'next'

// ** Mui
import List from '@mui/material/List'

// ** layout
import { VerticalItems } from 'src/configs/layout'

// component
import { useRouter } from 'next/router'
import { CONFIG_PERMISSIONS } from 'src/configs/permission'
import { ItemVerticalLayout } from './ItemVerticalLayout'
import { useAuth } from 'src/hooks/useAuth'

interface TProps {
  openVertical: boolean
}

export const ListVerticalLayout: NextPage<TProps> = ({ openVertical }) => {
  // ** Hook
  const router = useRouter()
  const vertical = VerticalItems()
  const { user } = useAuth()

  const level = 0

  const permissionsUser: any = user?.role?.permissions

  const isParentHaveChildActive = (item: any) => {
    if (!item.children) {
      return router.pathname === item.path
    }

    return item.children.some((item: any) => isParentHaveChildActive(item))
  }

  const hasPermissions = (permission: string, permissionsUser: string[]) => {
    return permissionsUser?.includes(permission) || !permission
  }

  const handleFormatToPermissions = (menu: any, permissionsUser: string[]) => {
    if (menu) {
      return menu.filter((item: any) => {
        if (hasPermissions(item.permissions, permissionsUser)) {
          if (item.children && item.children.length > 0) {
            item.children = handleFormatToPermissions(item.children, permissionsUser)
          }

          if (item?.children?.length <= 0) return false

          return true
        }

        return false
      })
    }

    return []
  }

  const formatted = !permissionsUser?.includes(CONFIG_PERMISSIONS.ADMIN)
    ? handleFormatToPermissions(vertical, permissionsUser)
    : vertical

  return (
    <>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding: 0 }}
        component='nav'
        aria-labelledby='nested-list-subheader'
      >
        {formatted.map((item: any) => {
          const isParentActive = isParentHaveChildActive(item)

          return (
            <li key={item.title}>
              <ItemVerticalLayout data={item} level={level} openVertical={openVertical} fatherActive={isParentActive} />
            </li>
          )
        })}
      </List>
    </>
  )
}
