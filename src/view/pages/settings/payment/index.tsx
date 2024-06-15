// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Grid, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/payment-type'
import {
  deleteMultiplePaymentTypeAsync,
  deletePaymentTypeAsync,
  getAllPaymentTypeAsync
} from 'src/stores/payment-type/actions'

// ** Component
import CustomConfirmDialog from 'src/components/custom-confirm-dialog'
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import CustomGridCreate from 'src/components/grid-create'
import CustomGridDelete from 'src/components/grid-delete'
import CustomGridEdit from 'src/components/grid-edit'
import InputSearch from 'src/components/input-search'
import Spinner from 'src/components/spinner'
import TableHeader from 'src/components/table-header'
import { CreateEditPaymentType } from './components/CreateEditPaymentType'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { PAYMENT_TYPES } from 'src/configs/payment'

// ** Toast
import toast from 'react-hot-toast'

// ** utils
import { formatDate } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// ** Configs
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'

// ** Hooks
import { usePermissions } from 'src/hooks/usePermissions'

type TProps = {}

type TSelectedRow = { id: string; role: { id: string; permissions: string[] } }

const PaymentPage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** i18n
  const { t } = useTranslation()

  // ** useState
  const [openDeletePaymentType, setOpenDeletePaymentType] = useState({
    open: false,
    idPaymentType: ''
  })

  const [openDeleteMultiplePaymentType, setOpenDeleteMultiplePaymentType] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const dispatch: AppDispatch = useDispatch()
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [checkboxRow, setCheckboxRow] = useState<TSelectedRow[]>([])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    idPaymentType: ''
  })

  const tableActions = [{ label: t('Delete'), value: 'delete' }]

  const { CREATE, UPDATE, DELETE, VIEW } = usePermissions('SETTING.PAYMENT_TYPE', [
    'CREATE',
    'UPDATE',
    'DELETE',
    'VIEW'
  ])

  const objectPaymentType: any = PAYMENT_TYPES()

  // ** use selector
  const {
    paymentType,
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
  } = useSelector((state: RootState) => state.paymentType)

  const getListPaymentType = () => {
    dispatch(
      getAllPaymentTypeAsync({
        params: {
          limit: pageSize,
          page: page,
          search: search,
          order: sortBy
        }
      })
    )
  }

  const handleCloseModal = () => {
    setOpenCreateEdit({
      open: false,
      idPaymentType: ''
    })
  }

  const handleSort = (sort: any) => {
    const sortOptions = sort[0]
    if (sortOptions) {
      setSortBy(`${sortOptions.field} ${sortOptions.sort}`)
    }
  }

  const handleOnCloseDeletePaymentType = () => {
    setOpenDeletePaymentType({
      open: false,
      idPaymentType: ''
    })
  }

  const handleOnCloseDeleteMultiplePaymentType = () => {
    setOpenDeleteMultiplePaymentType(false)
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
        setOpenDeleteMultiplePaymentType(true)
        break
      }
    }
  }

  useEffect(() => {
    getListPaymentType()
  }, [sortBy, search, page, pageSize])

  useEffect(() => {
    if (isMessageCreateEdit) {
      if (isSuccessCreateEdit) {
        if (!openCreateEdit.idPaymentType) {
          toast.success(t('Create_payment_type_success'))
        } else {
          toast.success(t('Update_payment_type_success'))
        }
        handleCloseModal()
        getListPaymentType()
        dispatch(resetInitialState())
      } else if (isErrorCreateEdit) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          if (!openCreateEdit.idPaymentType) {
            toast.error(t('Create_payment_type_error'))
          } else {
            toast.error(t('Update_payment_type_error'))
          }
        }
        dispatch(resetInitialState())
      }
    }
  }, [isErrorCreateEdit, isSuccessCreateEdit])

  useEffect(() => {
    if (isMessageDelete) {
      if (isSuccessDelete) {
        toast.success(t('Delete_payment_success'))
        getListPaymentType()
      } else if (isErrorDelete) {
        toast.error(t('Delete_payment_success'))
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete])

  useEffect(() => {
    if (isMessageMultipleDelete) {
      if (isSuccessMultipleDelete) {
        toast.success(t('Delete_multiple_payment_success'))
        getListPaymentType()
        setCheckboxRow([])
        dispatch(resetInitialState())
      } else if (isErrorMultipleDelete) {
        toast.error(t('Delete_multiple_payment_error'))
      }
    }
  }, [isErrorMultipleDelete, isSuccessMultipleDelete])

  const columns: GridColDef<[number]>[] = [
    {
      field: 'name',
      headerName: t('Name'),
      flex: 1,
      minWidth: 0,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.name}</Typography>
      }
    },
    {
      field: 'type',
      headerName: t('Type'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{objectPaymentType[row?.type].label}</Typography>
      }
    },
    {
      field: 'created_date',
      headerName: t('Created_date'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{formatDate(row?.createdAt, { dateStyle: 'short' })}</Typography>
      }
    },

    {
      field: 'action',
      headerName: t('Actions'),
      minWidth: 180,
      maxWidth: 180,
      sortable: false,
      renderCell: (rows: any) => {
        const { row } = rows

        return (
          <>
            {UPDATE && (
              <CustomGridEdit
                onClick={() =>
                  setOpenCreateEdit({
                    open: true,
                    idPaymentType: row?._id
                  })
                }
              />
            )}
            {DELETE && (
              <CustomGridDelete
                onClick={() => {
                  setOpenDeletePaymentType({
                    open: true,
                    idPaymentType: row?._id
                  })
                }}
              />
            )}
          </>
        )
      }
    }
  ]

  return (
    <>
      {(isLoading || loading) && <Spinner />}

      <CreateEditPaymentType
        open={openCreateEdit.open}
        onClose={handleCloseModal}
        idPaymentType={openCreateEdit.idPaymentType}
      />

      <CustomConfirmDialog
        title='Title_delete_payment_type'
        content='Confirm_delete_payment_type'
        onClose={handleOnCloseDeletePaymentType}
        open={openDeletePaymentType.open}
        handleConfirm={() => {
          dispatch(deletePaymentTypeAsync(openDeletePaymentType?.idPaymentType))
          handleOnCloseDeletePaymentType()
        }}
      />

      <CustomConfirmDialog
        title='Title_delete_multiple_payment_type'
        content='Confirm_delete_multiple_payment_type'
        onClose={handleOnCloseDeleteMultiplePaymentType}
        open={openDeleteMultiplePaymentType}
        handleConfirm={() => {
          const data = checkboxRow.map(item => item.id)
          dispatch(deleteMultiplePaymentTypeAsync({ paymentTypeIds: data }))
          handleOnCloseDeleteMultiplePaymentType()
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
          width: '100%'
        }}
      >
        <Grid container sx={{ height: '100%', width: '100%' }}>
          {!checkboxRow.length && (
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginBottom: 3,
                gap: 3
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
                      idPaymentType: ''
                    }))
                  }
                />
              )}
            </Box>
          )}
          {checkboxRow.length > 0 && (
            <TableHeader
              number={checkboxRow.length}
              onClose={() => setCheckboxRow([])}
              actions={tableActions}
              handleActions={handleActions}
            />
          )}
          <CustomDataGrid
            rows={paymentType.data || {}}
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
                const findRow: any = paymentType?.data.find((itemPaymentType: any) => itemPaymentType._id === item)

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
        </Grid>
      </Box>
    </>
  )
}

export default PaymentPage
