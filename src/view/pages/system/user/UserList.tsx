// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Grid, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowClassNameParams, GridRowSelectionModel } from '@mui/x-data-grid'

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
import TableHeader from 'src/components/table-header'
import i18n from 'src/configs/i18n'
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/role'
import { resetInitialState } from 'src/stores/user'
import { deleteMultipleUsersAsync, deleteUsersAsync, getAllUsersAsync } from 'src/stores/user/actions'
import { toFullName } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { CreateEditUsers } from './components/CreateEditUsers'

type TProps = {}

type TSelectedRow = { id: string; role: { id: string; permissions: string[] } }

const UserPage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** i18n
  const { t } = useTranslation()

  // ** useState
  const [openDeleteUser, setOpenDeleteUser] = useState({
    open: false,
    idUsers: ''
  })

  const [openDeleteMultipleUser, setOpenDeleteMultipleUser] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('createAt asc')
  const [search, setSearch] = useState('')
  const [isDisabled, setIsDisable] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [checkboxRow, setCheckboxRow] = useState<TSelectedRow[]>([])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    idUsers: ''
  })
  const [rowSelected, setRowSelected] = useState({
    id: '',
    name: ''
  })

  const tableActions = [{ label: t('Delete'), value: 'delete' }]

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
    isErrorMultipleDelete,
    isMessageMultipleDelete,
    isSuccessMultipleDelete,
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
        const fullName = toFullName(row.firstName, row.middleName, row.lastName, i18n.language)

        return <Typography>{fullName}</Typography>
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
      field: 'role',
      headerName: t('Role'),
      minWidth: 275,
      maxWidth: 275,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.role?.name}</Typography>
      }
    },
    {
      field: 'phone',
      headerName: t('Phone_number'),
      minWidth: 275,
      maxWidth: 275,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.phoneNumber}</Typography>
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
                  idUsers: row?._id
                })
              }
            />
            <CustomGridDelete
              onClick={() => {
                setOpenDeleteUser({
                  open: true,
                  idUsers: row?._id
                })
              }}
            />
          </>
        )
      }
    }
  ]

  const handleOnCloseDeleteUser = () => {
    setOpenDeleteUser({
      open: false,
      idUsers: ''
    })
  }

  const handleOnCloseDeleteMultipleUser = () => {
    setOpenDeleteMultipleUser(false)
  }

  const handleOnChangeSearch = (value: string) => {
    setSearch(value)
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

  const handleActions = (action: string) => {
    switch (action) {
      case 'delete': {
        setOpenDeleteMultipleUser(true)
        break
      }
    }
  }

  const memoDisabledDeleteUser = useMemo(() => {
    return checkboxRow.some((item: TSelectedRow) => item?.role?.permissions.includes(CONFIG_PERMISSIONS.ADMIN))
  }, [checkboxRow])

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
    if (isMessageMultipleDelete) {
      if (isSuccessMultipleDelete) {
        toast.success(isMessageMultipleDelete)
        getListUsers()
        setCheckboxRow([])
        dispatch(resetInitialState())
      } else if (isErrorMultipleDelete) {
        toast.error(isMessageMultipleDelete)
      }
    }
  }, [isErrorMultipleDelete, isSuccessMultipleDelete])

  return (
    <>
      {isLoading && <Spinner />}
      {loading && <Spinner />}

      <CreateEditUsers open={openCreateEdit.open} onClose={handleCloseModal} idUsers={openCreateEdit.idUsers} />

      <CustomConfirmDialog
        onClose={handleOnCloseDeleteUser}
        open={openDeleteUser.open}
        handleConfirm={() => {
          dispatch(deleteUsersAsync(openDeleteUser?.idUsers))
          handleOnCloseDeleteUser()
        }}
      />

      <CustomConfirmDialog
        onClose={handleOnCloseDeleteMultipleUser}
        open={openDeleteMultipleUser}
        handleConfirm={() => {
          const data = checkboxRow.map(item => item.id)
          dispatch(deleteMultipleUsersAsync({ userIds: data }))
          handleOnCloseDeleteMultipleUser()
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
              {!checkboxRow.length && (
                <>
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
                </>
              )}
            </Box>
            {checkboxRow.length > 0 && (
              <TableHeader
                number={checkboxRow.length}
                onClose={() => setCheckboxRow([])}
                actions={tableActions}
                handleActions={handleActions}
                disabled={memoDisabledDeleteUser}
              />
            )}
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
              checkboxSelection
              hideFooterSelectedRowCount
              rowSelectionModel={checkboxRow.map(item => item.id)}
              onRowSelectionModelChange={(row: GridRowSelectionModel) => {
                const formatData = row?.map(item => {
                  const findRow: any = users?.data.find((itemUser: any) => itemUser._id === item)

                  return { id: findRow._id, role: { id: findRow?.row?._id, permissions: findRow?.role?.permissions } }
                })
                setCheckboxRow(formatData)
              }}
              onSortModelChange={handleSort}
              hasPagination={true}
              slots={{
                pagination: ComponentPagination
              }}
              getRowClassName={(row: GridRowClassNameParams) => {
                return row.id === rowSelected.id ? 'row-selected' : ''
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
