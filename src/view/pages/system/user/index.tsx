// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Grid, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowClassNameParams } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'

// ** Component
import CustomConfirmDialog from 'src/components/custom-confirm-dialog'
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomGridCreate from 'src/components/grid-create'
import CustomGridDelete from 'src/components/grid-delete'
import CustomGridEdit from 'src/components/grid-edit'
import InputSearch from 'src/components/input-search'
import Spinner from 'src/components/spinner'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { CONFIG_PERMISSIONS } from 'src/configs/permission'

// ** Toast
import toast from 'react-hot-toast'

// ** Services

// ** utils
import CustomPagination from 'src/components/custom-pagination'
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/role'
import { getDetailUsers } from 'src/services/users'
import { resetInitialState } from 'src/stores/user'
import { deleteUsersAsync, getAllUsersAsync } from 'src/stores/user/actions'
import { getValuePermissions } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { CreateEditUsers } from './components/CreateEditUsers'

type TProps = {}

const UserPage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** i18n
  const { t } = useTranslation()

  // ** useState
  const [openDialog, setOpenDialog] = useState({
    open: false,
    idUsers: ''
  })
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('create asc')
  const [search, setSearch] = useState('')
  const [isDisabled, setIsDisable] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    idUsers: ''
  })
  const [permissionSelected, setPermissionSelected] = useState<string[]>([])
  const [rowSelected, setRowSelected] = useState({
    id: '',
    name: ''
  })

  // ** use selector

  const {
    users,
    isErrorCreateEdit,
    isMessageCreateEdit,
    isSuccessCreateEdit,
    isLoading,
    isErrorDelete,
    isMessageDelete,
    isSuccessDelete,
    typeError
  } = useSelector((state: RootState) => state.users)

  const dispatch: AppDispatch = useDispatch()

  const getListUsers = () => {
    dispatch(getAllUsersAsync({ params: { limit: -1, page: -1, search: search, order: sortBy } }))
  }

  const handleCloseModal = () => {
    setOpenCreateEdit({
      open: false,
      idUsers: ''
    })
  }

  const handleSort = (sort: any) => {
    const sortOptions = sort[0]
    setSortBy(`${sortOptions.field} ${sortOptions.sort}`)
  }

  const columns: GridColDef<[number]>[] = [
    {
      field: 'name',
      headerName: t('name'),
      flex: 1,
      minWidth: 275,
      maxWidth: 275,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.name}</Typography>
      }
    },
    {
      field: 'email',
      headerName: t('email'),
      minWidth: 275,
      maxWidth: 275,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.email}</Typography>
      }
    },
    {
      field: 'Users',
      headerName: t('Users'),
      minWidth: 275,
      maxWidth: 275,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.Users}</Typography>
      }
    },
    {
      field: 'phone',
      headerName: t('phone_number'),
      minWidth: 275,
      maxWidth: 275,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.phone}</Typography>
      }
    },
    {
      field: 'city',
      headerName: t('city'),
      minWidth: 275,
      maxWidth: 275,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.city}</Typography>
      }
    },
    {
      field: 'action',
      headerName: t('action'),
      minWidth: 200,
      maxWidth: 200,
      sortable: false,
      renderCell: (rows: any) => {
        const { row } = rows

        return (
          <>
            <CustomGridEdit
              onClick={() =>
                setOpenCreateEdit({
                  open: true,
                  idUsers: row?.role?._id
                })
              }
            />
            <CustomGridDelete
              onClick={() => {
                setOpenDialog({
                  open: true,
                  idUsers: row?.role?._id
                })
              }}
            />
          </>
        )
      }
    }
  ]

  const handleOnOpenDialog = () => {
    setOpenDialog({
      open: false,
      idUsers: ''
    })
  }

  const handleOnChangeSearch = (value: string) => {
    setSearch(value)
  }

  const getUserDetail = async () => {
    setLoading(true)
    try {
      setLoading(false)
      const res = await getDetailUsers(rowSelected.id)

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

  const handleChangePagination = () => {}

  const ComponentPagination = () => {
    return (
      <CustomPagination
        page={page}
        pageSize={pageSize}
        rowLength={PAGE_SIZE_OPTION[0]}
        pageSizeOptions={PAGE_SIZE_OPTION}
        onChangePagination={handleChangePagination}
        isHideShowed={false}
      />
    )
  }

  useEffect(() => {
    getListUsers()
  }, [sortBy, search])

  useEffect(() => {
    if (isMessageCreateEdit) {
      if (isSuccessCreateEdit) {
        if (!openCreateEdit.idUsers) {
          toast.success(t('create-users-success'))
        } else {
          toast.success(t('update-users-success'))
        }
        handleCloseModal()
      } else if (isErrorCreateEdit) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          if (!openCreateEdit.idUsers) {
            toast.error(t('create-users-error'))
          } else {
            toast.error(t('update-users-error'))
          }
        }
      }
      getListUsers()
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
      getListUsers()
      dispatch(resetInitialState())
    }
  }, [isErrorDelete, isSuccessDelete])

  useEffect(() => {
    if (rowSelected.id) {
      getUserDetail()
    }
  }, [rowSelected])

  return (
    <>
      {isLoading && <Spinner />}
      {loading && <Spinner />}

      <CreateEditUsers open={openCreateEdit.open} onClose={handleCloseModal} idUsers={openCreateEdit.idUsers} />

      <CustomConfirmDialog
        onOpen={handleOnOpenDialog}
        open={openDialog.open}
        onClick={() => {
          dispatch(deleteUsersAsync(openDialog?.idUsers))
          setOpenDialog({
            open: false,
            idUsers: ''
          })
        }}
      />
      <Box
        sx={{
          display: 'flex',
          padding: '20px',
          alignItems: 'center',
          backgroundColor: theme.palette.background.paper,
          borderRadius: '15px',
          height: '100%',
          maxHeight: '100%'
        }}
      >
        <Grid container spacing={1} sx={{ height: '100%', width: '100%' }}>
          <Grid item md={12} xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
              <Box sx={{ width: '200px' }}>
                <InputSearch onChange={handleOnChangeSearch} />
              </Box>
              <CustomGridCreate
                onClick={() =>
                  setOpenCreateEdit(x => ({
                    open: true,
                    idUsers: ''
                  }))
                }
              />
            </Box>
            <CustomDataGrid
              rows={users.data || {}}
              columns={columns}
              getRowId={row => row._id}
              sortingMode='server'
              sortingOrder={['desc', 'asc']}
              autoHeight
              disableRowSelectionOnClick
              disableColumnFilter
              disableColumnMenu
              onSortModelChange={handleSort}
              hasPagination={true}
              slots={{
                pagination: ComponentPagination
              }}
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
        </Grid>
      </Box>
    </>
  )
}

export default UserPage
