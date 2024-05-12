// ** Next
import { t } from 'i18next'

// ** MUI
import { Checkbox, Typography, useTheme } from '@mui/material'

// ** Components
import CustomDataGrid from 'src/components/custom-data-grid'

// **Form

// **Yup

// ** Store
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

// ** Config
import { CONFIG_PERMISSIONS, LIST_DATA_PERMISSIONS } from 'src/configs/permission'

// ** Stores
import { Dispatch, SetStateAction } from 'react'

// ** Utils
import { getValuePermissions } from 'src/utils'

interface TTablePermissions {
  permissionSelected: string[]
  setPermissionSelected: Dispatch<SetStateAction<string[]>>
  disabled: boolean
}

const getPermissionsValue = (value: string, mode: string, parentValue: string) => {
  return parentValue ? CONFIG_PERMISSIONS?.[parentValue]?.[value]?.[mode] : CONFIG_PERMISSIONS[value]
}

export const TablePermissions = ({ permissionSelected, setPermissionSelected, disabled }: TTablePermissions) => {
  const theme = useTheme()

  const handleChangeCheckBox = (value: string) => {
    const hasArray = permissionSelected?.includes(value)
    if (hasArray) {
      const filtered = permissionSelected.filter(x => x !== value)
      setPermissionSelected([...filtered])
    } else {
      setPermissionSelected(prev => [...prev, value])
    }
  }

  const handleIsChecked = (value: string, parent?: string) => {
    const valuePermissions = parent
      ? getValuePermissions(CONFIG_PERMISSIONS?.[parent]?.[value], [])
      : getValuePermissions(CONFIG_PERMISSIONS?.[value], [])
    const isChecked = valuePermissions.every(item => permissionSelected.includes(item))

    return {
      isChecked,
      valuePermissions
    }
  }

  const handleCheckedAll = (value: string, parent?: string) => {
    const { isChecked, valuePermissions } = handleIsChecked(value, parent)

    if (isChecked) {
      const filtered = permissionSelected.filter(item => !valuePermissions.includes(item))
      setPermissionSelected([...filtered])
    } else {
      setPermissionSelected(prev => [...new Set([...prev, ...valuePermissions])])
    }
  }

  const handleCheckedGroupAll = (value: string) => {
    const { isChecked, valuePermissions } = handleIsChecked(value)

    if (isChecked) {
      const filtered = permissionSelected.filter(item => !valuePermissions.includes(item))
      setPermissionSelected([...filtered])
    } else {
      setPermissionSelected(prev => [...new Set([...prev, ...valuePermissions])])
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'all',
      headerName: t('all'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const { isChecked, valuePermissions } = handleIsChecked(row.value, row.parentValue)

        return (
          <>
            {!row.isHideAll && (
              <Checkbox
                disabled={disabled}
                value={row.value}
                onChange={e => {
                  if (row.isParent) {
                    handleCheckedGroupAll(e.target.value)
                  } else handleCheckedAll(e.target.value, row.parentValue)
                }}
                checked={isChecked}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'name',
      headerName: t('name'),
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Typography
            sx={{
              color: row?.isParent ? theme.palette.primary.main : `rgba(${theme.palette.customColors.main},0.78)`,
              marginLeft: row?.isParent ? 0 : '40px',
              textTransform: row.isParent ? 'uppercase' : 'none'
            }}
          >
            {t(`${row.name}`)}
          </Typography>
        )
      }
    },

    {
      field: 'view',
      headerName: t('view'),
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <>
            {!row.isHideView && !row.isParent && (
              <Checkbox
                disabled={disabled}
                value={getPermissionsValue(row.value, 'VIEW', row.parentValue)}
                onChange={e => handleChangeCheckBox(e.target.value)}
                checked={permissionSelected.includes(getPermissionsValue(row.value, 'VIEW', row.parentValue))}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'create',
      headerName: t('create'),
      minWidth: 100,
      maxWidth: 100,
      sortable: false,

      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <>
            {!row.isHideCreate && !row.isParent && (
              <Checkbox
                disabled={disabled}
                value={getPermissionsValue(row.value, 'CREATE', row.parentValue)}
                onChange={e => handleChangeCheckBox(e.target.value)}
                checked={permissionSelected.includes(getPermissionsValue(row.value, 'CREATE', row.parentValue))}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'update',
      headerName: t('update'),
      minWidth: 120,
      maxWidth: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <>
            {!row.isHideUpdate && !row.isParent && (
              <Checkbox
                disabled={disabled}
                value={getPermissionsValue(row.value, 'UPDATE', row.parentValue)}
                onChange={e => handleChangeCheckBox(e.target.value)}
                checked={permissionSelected.includes(getPermissionsValue(row.value, 'UPDATE', row.parentValue))}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'delete',
      headerName: t('delete'),
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <>
            {!row.isHideDelete && !row.isParent && (
              <Checkbox
                disabled={disabled}
                value={getPermissionsValue(row.value, 'DELETE', row.parentValue)}
                onChange={e => handleChangeCheckBox(e.target.value)}
                checked={permissionSelected.includes(getPermissionsValue(row.value, 'DELETE', row.parentValue))}
              />
            )}
          </>
        )
      }
    }
  ]

  return (
    <CustomDataGrid
      rows={LIST_DATA_PERMISSIONS}
      columns={columns}
      autoHeight
      hideFooter
      disableRowSelectionOnClick
      disableColumnFilter
      disableColumnMenu
    />
  )
}
