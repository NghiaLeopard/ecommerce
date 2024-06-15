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
import { resetInitialState } from 'src/stores/product-types'
import {
  deleteProductTypesAsync,
  deleteMultipleProductTypesAsync,
  getAllProductTypesAsync
} from 'src/stores/product-types/actions'

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
import { CreateEditProductTypes } from './components/CreateEditProductTypes'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// ** Toast
import toast from 'react-hot-toast'

// ** utils
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { formatDate } from 'src/utils'

// ** Configs
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'

// ** Hooks
import { usePermissions } from 'src/hooks/usePermissions'

type TProps = {}

type TSelectedRow = { id: string; role: { id: string; permissions: string[] } }

const ProductTypesPage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** i18n
  const { t } = useTranslation()

  // ** useState
  const [openDeleteProductTypes, setOpenDeleteProductTypes] = useState({
    open: false,
    idProductTypes: ''
  })

  // ** State
  const [openDeleteMultipleProductTypes, setOpenDeleteMultipleProductTypes] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const dispatch: AppDispatch = useDispatch()
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [checkboxRow, setCheckboxRow] = useState<TSelectedRow[]>([])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    idProductTypes: ''
  })

  const tableActions = [{ label: t('Delete'), value: 'delete' }]

  const { CREATE, UPDATE, DELETE, VIEW } = usePermissions('MANAGE_PRODUCT.PRODUCT_TYPE', [
    'CREATE',
    'UPDATE',
    'DELETE',
    'VIEW'
  ])

  // ** use selector
  const {
    productTypes,
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
  } = useSelector((state: RootState) => state.productTypes)

  const getListProductTypes = () => {
    dispatch(
      getAllProductTypesAsync({
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
      idProductTypes: ''
    })
  }

  const handleSort = (sort: any) => {
    const sortOptions = sort[0]
    if (sortOptions) {
      setSortBy(`${sortOptions.field} ${sortOptions.sort}`)
    }
  }

  const handleOnCloseDeleteProductTypes = () => {
    setOpenDeleteProductTypes({
      open: false,
      idProductTypes: ''
    })
  }

  const handleOnCloseDeleteMultipleProductTypes = () => {
    setOpenDeleteMultipleProductTypes(false)
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
        setOpenDeleteMultipleProductTypes(true)
        break
      }
    }
  }

  useEffect(() => {
    getListProductTypes()
  }, [sortBy, search, page, pageSize])

  useEffect(() => {
    if (isMessageCreateEdit) {
      if (isSuccessCreateEdit) {
        if (!openCreateEdit.idProductTypes) {
          toast.success(t('Create_product_type_success'))
        } else {
          toast.success(t('Update_product_type_success'))
        }
        handleCloseModal()
        getListProductTypes()
        dispatch(resetInitialState())
      } else if (isErrorCreateEdit) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          if (!openCreateEdit.idProductTypes) {
            toast.error(t('Create_product_type_error'))
          } else {
            toast.error(t('Update_product_type_error'))
          }
        }
        dispatch(resetInitialState())
      }
    }
  }, [isErrorCreateEdit, isSuccessCreateEdit])

  useEffect(() => {
    if (isMessageDelete) {
      if (isSuccessDelete) {
        toast.success(t('Delete_product_type_success'))
        getListProductTypes()
      } else if (isErrorDelete) {
        toast.error(t('Delete_product_type_success'))
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete])

  useEffect(() => {
    if (isMessageMultipleDelete) {
      if (isSuccessMultipleDelete) {
        toast.success(t('Delete_multiple_product_type_success'))
        getListProductTypes()
        setCheckboxRow([])
        dispatch(resetInitialState())
      } else if (isErrorMultipleDelete) {
        toast.error(t('Delete_multiple_product_type_error'))
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
      field: 'slug',
      headerName: t('Slug'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.slug}</Typography>
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
                    idProductTypes: row?._id
                  })
                }
              />
            )}
            {DELETE && (
              <CustomGridDelete
                onClick={() => {
                  setOpenDeleteProductTypes({
                    open: true,
                    idProductTypes: row?._id
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

      <CreateEditProductTypes
        open={openCreateEdit.open}
        onClose={handleCloseModal}
        idProductTypes={openCreateEdit.idProductTypes}
      />

      <CustomConfirmDialog
        title='Title_delete_product_type'
        content='Confirm_delete_product_type'
        onClose={handleOnCloseDeleteProductTypes}
        open={openDeleteProductTypes.open}
        handleConfirm={() => {
          dispatch(deleteProductTypesAsync(openDeleteProductTypes?.idProductTypes))
          handleOnCloseDeleteProductTypes()
        }}
      />

      <CustomConfirmDialog
        title='Title_delete_multiple_product_type'
        content='Confirm_delete_multiple_product_type'
        onClose={handleOnCloseDeleteMultipleProductTypes}
        open={openDeleteMultipleProductTypes}
        handleConfirm={() => {
          const data = checkboxRow.map(item => item.id)
          dispatch(deleteMultipleProductTypesAsync({ productTypeIds: data }))
          handleOnCloseDeleteMultipleProductTypes()
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
                      idProductTypes: ''
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
            rows={productTypes.data || {}}
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
                const findRow: any = productTypes?.data.find((itemProductTypes: any) => itemProductTypes._id === item)

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

export default ProductTypesPage
