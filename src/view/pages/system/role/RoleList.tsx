// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Button, Grid, useTheme } from '@mui/material'
import { GridColDef, GridRowClassNameParams } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { deleteRolesAsync, editRolesAsync, getAllRolesAsync } from 'src/stores/roles/actions'

// ** Component
import CustomConfirmDialog from 'src/components/custom-confirm-dialog'
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomGridCreate from 'src/components/grid-create'
import CustomGridDelete from 'src/components/grid-delete'
import CustomGridEdit from 'src/components/grid-edit'
import InputSearch from 'src/components/input-search'
import Spinner from 'src/components/spinner'
import { CreateEditRole } from './components/CreateEditRole'
import { TablePermissions } from './components/tablePermissions'

// ** Config
import { CONFIG_PERMISSIONS } from 'src/configs/permission'
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/role'
import { resetInitialState } from 'src/stores/roles'

// ** Toast
import toast from 'react-hot-toast'

// ** Services
import { getDetailRole } from 'src/services/role'

// ** utils
import { getValuePermissions } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { usePermissions } from 'src/hooks/usePermissions'

type TProps = {}

const RoleListPage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** i18n
  const { t } = useTranslation()

  // ** hook

  const { CREATE, UPDATE, DELETE, VIEW } = usePermissions('SYSTEM.ROLE', ['CREATE', 'UPDATE', 'DELETE', 'VIEW'])

  // ** useState
  const [openDialog, setOpenDialog] = useState({
    open: false,
    idRole: ''
  })
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('create asc')
  const [search, setSearch] = useState('')
  const [isDisabled, setIsDisable] = useState(false)
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    idRole: ''
  })
  const [permissionSelected, setPermissionSelected] = useState<string[]>([])
  const [rowSelected, setRowSelected] = useState({
    id: '',
    name: ''
  })

  // ** use selector

  const {
    roles,
    isErrorCreateEdit,
    isMessageCreateEdit,
    isSuccessCreateEdit,
    isLoading,
    isErrorDelete,
    isMessageDelete,
    isSuccessDelete,
    typeError
  } = useSelector((state: RootState) => state.role)

  const dispatch: AppDispatch = useDispatch()

  const getListRole = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1, search: search, order: sortBy } }))
  }

  const handleCloseModal = () => {
    setOpenCreateEdit({
      open: false,
      idRole: ''
    })
  }

  const handleSort = (sort: any) => {
    const sortOptions = sort[0]
    setSortBy(`${sortOptions.field} ${sortOptions.sort}`)
  }

  const columns: GridColDef<[number]>[] = [
    {
      field: 'name',
      headerName: t('Name'),
      flex: 1
    },
    {
      field: 'action',
      headerName: t('Actions'),
      minWidth: 150,
      sortable: false,
      align: 'left',
      renderCell: (rows: any) => {
        const { row } = rows

        return (
          <>
            {!row?.permissions?.some((per: string) => ['BASIC.PUBLIC', 'ADMIN.GRANTED'].includes(per)) && (
              <Box>
                {UPDATE && (
                  <CustomGridEdit
                    onClick={() =>
                      setOpenCreateEdit({
                        open: true,
                        idRole: rows?.id
                      })
                    }
                  />
                )}
                {DELETE && (
                  <CustomGridDelete
                    onClick={() => {
                      setOpenDialog({
                        open: true,
                        idRole: rows?.id
                      })
                    }}
                  />
                )}
              </Box>
            )}
          </>
        )
      }
    }
  ]

  const handleOnOpenDialog = () => {
    setOpenDialog({
      open: false,
      idRole: ''
    })
  }

  const handleOnChangeSearch = (value: string) => {
    setSearch(value)
  }

  const getRoleDetail = async () => {
    setLoading(true)
    try {
      setLoading(false)
      const res = await getDetailRole(rowSelected.id)

      const valuePermissions = getValuePermissions(CONFIG_PERMISSIONS, [
        CONFIG_PERMISSIONS.ADMIN,
        CONFIG_PERMISSIONS.BASIC
      ])

      if (res?.data?.permissions.includes(CONFIG_PERMISSIONS.ADMIN)) {
        setIsDisable(true)
        setPermissionSelected(valuePermissions)
      } else if (res?.data?.permissions.includes(CONFIG_PERMISSIONS.BASIC)) {
        setIsDisable(true)
        setPermissionSelected([CONFIG_PERMISSIONS.DASHBOARD])
      } else {
        setIsDisable(false)
        setPermissionSelected(res?.data?.permissions)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const handleUpdateRole = () => {
    dispatch(
      editRolesAsync({
        idRole: rowSelected.id,
        name: rowSelected.name,
        permissions: permissionSelected
      })
    )
  }

  useEffect(() => {
    getListRole()
  }, [sortBy, search])

  useEffect(() => {
    if (isMessageCreateEdit) {
      if (isSuccessCreateEdit) {
        if (!openCreateEdit.idRole) {
          toast.success(t('Create_role_success'))
        } else {
          toast.success(t('Update_role_success'))
        }
        handleCloseModal()
      } else if (isErrorCreateEdit) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          if (!openCreateEdit.idRole) {
            toast.error(t('Create_role_error'))
          } else {
            toast.error(t('Update_role_error'))
          }
        }
      }
      getListRole()
      dispatch(resetInitialState())
    }
  }, [isErrorCreateEdit, isSuccessCreateEdit])

  useEffect(() => {
    if (isMessageDelete) {
      if (isSuccessDelete) {
        toast.success(isMessageDelete)
      } else if (isErrorDelete) {
        toast.error(isMessageDelete)
      }
      getListRole()
      dispatch(resetInitialState())
    }
  }, [isErrorDelete, isSuccessDelete])

  useEffect(() => {
    if (rowSelected.id) {
      getRoleDetail()
    }
  }, [rowSelected])

  return (
    <>
      {isLoading && <Spinner />}
      {loading && <Spinner />}

      <CreateEditRole open={openCreateEdit.open} onClose={handleCloseModal} idRole={openCreateEdit.idRole} />

      <CustomConfirmDialog
        title='Title_delete_role'
        content='Confirm_delete_role'
        onClose={handleOnOpenDialog}
        open={openDialog.open}
        handleConfirm={() => {
          dispatch(deleteRolesAsync(openDialog?.idRole))
          setOpenDialog({
            open: false,
            idRole: ''
          })
        }}
      />

      <Box
        sx={{
          display: 'flex',
          padding: '20px',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.paper,
          borderRadius: '15px',
          height: '100%',
          maxHeight: '100%'
        }}
      >
        <Grid container spacing={10} sx={{ height: '100%', width: '100%' }}>
          <Grid item md={4} xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 3
              }}
            >
              <Box sx={{ width: '200px' }}>
                <InputSearch onChange={handleOnChangeSearch} />
              </Box>
              {CREATE && (
                <CustomGridCreate
                  onClick={() =>
                    setOpenCreateEdit(x => ({
                      open: true,
                      idRole: ''
                    }))
                  }
                />
              )}
            </Box>
            <CustomDataGrid
              rows={roles.data}
              columns={columns}
              getRowId={row => row._id}
              sortingMode='server'
              sortingOrder={['desc', 'asc']}
              autoHeight
              disableRowSelectionOnClick
              disableColumnFilter
              disableColumnMenu
              hideFooter
              onSortModelChange={handleSort}
              getRowClassName={(row: GridRowClassNameParams) => {
                return row.id === rowSelected.id ? 'row-selected' : ''
              }}
              onRowClick={rows => {
                const { row } = rows
                setRowSelected({
                  id: row._id,
                  name: row.name
                })
              }}
              sx={{
                '.row-selected': {
                  backgroundColor: `${hexToRGBA(theme.palette.secondary.main, 0.08)} !important`,
                  color: `${theme.palette.primary.main} !important`
                }
              }}
            />
          </Grid>
          <Grid item md={8} xs={12} sx={{ height: 'calc(100% - 40px)' }}>
            {rowSelected.id && (
              <Box sx={{ height: '100%' }}>
                <TablePermissions
                  permissionSelected={permissionSelected}
                  setPermissionSelected={setPermissionSelected}
                  disabled={isDisabled}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type='submit'
                    variant='contained'
                    sx={{ mt: 3 }}
                    onClick={() => {
                      handleUpdateRole()
                      setOpenCreateEdit({
                        idRole: rowSelected.id,
                        open: false
                      })
                    }}
                    disabled={isDisabled}
                  >
                    {t('update')}
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default RoleListPage
