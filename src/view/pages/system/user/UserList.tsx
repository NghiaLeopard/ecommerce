// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Chip, Typography, styled, useTheme } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/user'
import { deleteMultipleUsersAsync, deleteUsersAsync, getAllUsersAsync } from 'src/stores/user/actions'

// ** Component
import CustomConfirmDialog from 'src/components/custom-confirm-dialog'
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import { CustomSelect } from 'src/components/custom-select'
import CustomGridCreate from 'src/components/grid-create'
import CustomGridDelete from 'src/components/grid-delete'
import CustomGridEdit from 'src/components/grid-edit'
import InputSearch from 'src/components/input-search'
import Spinner from 'src/components/spinner'
import TableHeader from 'src/components/table-header'
import { CreateEditUsers } from './components/CreateEditUsers'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { CONFIG_PERMISSIONS } from 'src/configs/permission'

// ** Toast
import toast from 'react-hot-toast'

// ** utils
import { toFullName } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// ** Configs
import i18n from 'src/configs/i18n'
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'

// ** Service
import { getAllRoles } from 'src/services/role'
import { OBJECT_STATUS_USER } from 'src/configs/user'
import { getAllCity } from 'src/services/city'

type TProps = {}

type TSelectedRow = { id: string; role: { id: string; permissions: string[] } }

const ActiveChip = styled(Chip)(({ theme }) => ({
  padding: '15px 0px',
  fontWeight: 400
}))

const BlockChip = styled(Chip)(({ theme }) => ({
  padding: '15px 0px',
  fontWeight: 400
}))

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
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const dispatch: AppDispatch = useDispatch()
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [allRole, setAllRole] = useState([])
  const [allCity, setAllCity] = useState([])
  const [roleSelected, setRoleSelected] = useState('')
  const [citySelected, setCitySelected] = useState<string[]>([])
  const [statusSelected, setStatusSelected] = useState('')
  const [checkboxRow, setCheckboxRow] = useState<TSelectedRow[]>([])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    idUsers: ''
  })

  const tableActions = [{ label: t('Delete'), value: 'delete' }]

  const OBJECT_STATUS = OBJECT_STATUS_USER()

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

  const getListUsers = () => {
    dispatch(
      getAllUsersAsync({
        params: {
          limit: pageSize,
          page: page,
          search: search,
          order: sortBy,
          roleId: roleSelected,
          cityId: citySelected.join('|'),
          status: statusSelected === '' ? '' : Number(statusSelected)
        }
      })
    )
  }

  const handleCloseModal = () => {
    setOpenCreateEdit({
      open: false,
      idUsers: ''
    })
  }

  const handleSort = (sort: any) => {
    const sortOptions = sort[0]
    if (sortOptions) {
      setSortBy(`${sortOptions.field} ${sortOptions.sort}`)
    }
  }

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

  const handleChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

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
  }, [sortBy, search, page, pageSize, roleSelected, citySelected, statusSelected])

  useEffect(() => {
    if (isMessageCreateEdit) {
      if (isSuccessCreateEdit) {
        if (!openCreateEdit.idUsers) {
          toast.success(t('Create_user_success'))
        } else {
          toast.success(t('Update_user_success'))
        }
        handleCloseModal()
      } else if (isErrorCreateEdit) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          if (!openCreateEdit.idUsers) {
            toast.error(t('Create_user_error'))
          } else {
            toast.error(t('Update_user_error'))
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
        toast.success(t('Delete_user_success'))
        getListUsers()
      } else if (isErrorDelete) {
        toast.error(t('Delete_user_success'))
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete])

  useEffect(() => {
    if (isMessageMultipleDelete) {
      if (isSuccessMultipleDelete) {
        toast.success(t('Delete_multiple_user_success'))
        getListUsers()
        setCheckboxRow([])
        dispatch(resetInitialState())
      } else if (isErrorMultipleDelete) {
        toast.error(t('Delete_multiple_user_error'))
      }
    }
  }, [isErrorMultipleDelete, isSuccessMultipleDelete])

  const columns: GridColDef<[number]>[] = [
    {
      field: i18n.language === 'vi' ? 'lastName' : 'firstNAme',
      headerName: t('Full_name'),
      flex: 1,
      minWidth: 215,
      maxWidth: 215,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const fullName = toFullName(row.lastName, row.middleName, row.firstName, i18n.language)

        return <Typography>{fullName}</Typography>
      }
    },
    {
      field: 'email',
      headerName: t('email'),
      minWidth: 215,
      maxWidth: 215,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.email}</Typography>
      }
    },
    {
      field: 'role',
      headerName: t('Role'),
      minWidth: 215,
      maxWidth: 215,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.role?.name}</Typography>
      }
    },
    {
      field: 'phoneNumber',
      headerName: t('Phone_number'),
      minWidth: 215,
      maxWidth: 215,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.phoneNumber}</Typography>
      }
    },
    {
      field: 'city',
      headerName: t('City'),
      minWidth: 215,
      maxWidth: 215,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.city?.name}</Typography>
      }
    },
    {
      field: 'status',
      headerName: t('Status'),
      minWidth: 215,
      maxWidth: 215,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return row.status === 1 ? <ActiveChip label={t('Active')} /> : <BlockChip label={t('Blocking')} />
      }
    },
    {
      field: 'action',
      headerName: t('Actions'),
      minWidth: 215,
      maxWidth: 215,
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

  const fetchAllRole = async () => {
    setLoading(true)
    try {
      setLoading(false)

      const response = await getAllRoles({ params: { limit: -1, page: -1 } })
      const roleArr = response?.data?.roles.map((item: any) => ({
        label: item.name,
        value: item._id
      }))

      setAllRole(roleArr)
    } catch (error) {
      setLoading(false)
    }
  }

  const fetchAllCity = async () => {
    setLoading(true)
    try {
      setLoading(false)

      const response = await getAllCity({ params: { limit: -1, page: -1 } })
      const CityArr = response?.data?.cities.map((item: any) => ({
        label: item.name,
        value: item._id
      }))

      setAllCity(CityArr)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllCity()
  }, [])

  useEffect(() => {
    fetchAllRole()
  }, [])

  return (
    <>
      {(isLoading || loading) && <Spinner />}

      <CreateEditUsers open={openCreateEdit.open} onClose={handleCloseModal} idUsers={openCreateEdit.idUsers} />

      <CustomConfirmDialog
        title='Title_delete_user'
        content='Confirm_delete_user'
        onClose={handleOnCloseDeleteUser}
        open={openDeleteUser.open}
        handleConfirm={() => {
          dispatch(deleteUsersAsync(openDeleteUser?.idUsers))
          handleOnCloseDeleteUser()
        }}
      />

      <CustomConfirmDialog
        title='Title_delete_multiple_user'
        content='Confirm_delete_multiple_user'
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
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backgroundColor: theme.palette.background.paper,
          borderRadius: '15px',
          height: '100%',
          maxHeight: '100%'
        }}
      >
        <Box sx={{ height: '100%', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 3, gap: 3 }}>
            {!checkboxRow.length && (
              <>
                <Box sx={{ width: '200px', mt: 1 }}>
                  <CustomSelect
                    value={roleSelected}
                    options={allRole}
                    fullWidth
                    onChange={(data: any) => {
                      setRoleSelected(data)
                    }}
                    placeholder={t('Role')}
                  />
                </Box>
                <Box sx={{ width: '200px', mt: 1 }}>
                  <CustomSelect
                    value={citySelected}
                    options={allCity}
                    fullWidth
                    multiple
                    onChange={(data: any) => {
                      setCitySelected(data)
                    }}
                    placeholder={t('City')}
                  />
                </Box>
                <Box sx={{ width: '200px', mt: 1 }}>
                  <CustomSelect
                    value={statusSelected}
                    options={Object.values(OBJECT_STATUS)}
                    fullWidth
                    onChange={(data: any) => {
                      setStatusSelected(data)
                    }}
                    placeholder={t('Status')}
                  />
                </Box>
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
            checkboxSelection
            hideFooterSelectedRowCount
            disableColumnMenu
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
            sx={{
              '.row-selected': {
                backgroundColor: `${hexToRGBA(theme.palette.secondary.main, 0.08)} !important`,
                color: `${theme.palette.primary.main} !important`
              }
            }}
          />
        </Box>
      </Box>
    </>
  )
}

export default UserPage
