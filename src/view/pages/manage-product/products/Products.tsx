// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Chip, Grid, Typography, styled, useTheme } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/products'
import { deleteProductsAsync, deleteMultipleProductsAsync, getAllProductsAsync } from 'src/stores/products/actions'

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
import { CreateEditProducts } from './components/CreateEditProducts'
import { CustomSelect } from 'src/components/custom-select'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { OBJECT_STATUS_PRODUCTS } from 'src/configs/products'

// ** Toast
import toast from 'react-hot-toast'

// ** utils
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { formatDate, formatPriceToLocal } from 'src/utils'

// ** Configs
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'

// ** Hooks
import { usePermissions } from 'src/hooks/usePermissions'

// ** Services
import { getAllProductTypes } from 'src/services/product-types'
import { getReportProductStatus } from 'src/services/report'
import { CardProductStatusCount } from './components/CardProductStatusCount'

type TProps = {}

type TSelectedRow = { id: string; role: { id: string; permissions: string[] } }

const ActiveChip = styled(Chip)(({ theme }) => ({
  padding: '15px 0px',
  backgroundColor: '#28c76f29',
  color: '#3a843f',
  fontWeight: 400
}))

const BlockChip = styled(Chip)(({ theme }) => ({
  padding: '15px 0px',
  backgroundColor: '#da251d29',
  color: '#da251d',
  fontWeight: 400
}))

const ProductsPage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** i18n
  const { t } = useTranslation()

  // ** useState
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [typeSelected, setTypeSelected] = useState()
  const [statusSelected, setStatusSelected] = useState()
  const [openDeleteMultipleProducts, setOpenDeleteMultipleProducts] = useState(false)
  const [checkboxRow, setCheckboxRow] = useState<TSelectedRow[]>([])
  const [allProductTypes, setAllProductTypes] = useState([])
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [reportProductStatus, setReportProductStatus] = useState<{ data: Record<number, number>; totalUser: number }>(
    {} as any
  )
  const [openDeleteProducts, setOpenDeleteProducts] = useState({
    open: false,
    idProducts: ''
  })
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    idProducts: ''
  })

  // ** Dispatch
  const dispatch: AppDispatch = useDispatch()

  // ** Permissions
  const { CREATE, UPDATE, DELETE, VIEW } = usePermissions('MANAGE_PRODUCT.PRODUCT', [
    'CREATE',
    'UPDATE',
    'DELETE',
    'VIEW'
  ])

  const tableActions = [{ label: t('Delete'), value: 'delete' }]

  const OBJECT_STATUS_PRODUCTS_PAGE = OBJECT_STATUS_PRODUCTS()

  const listProductStatus = [
    {
      countUser: reportProductStatus?.totalUser || 0,
      type: 2
    },
    {
      countUser: reportProductStatus?.data?.[1] || 0,
      type: 1
    },
    {
      countUser: reportProductStatus?.data?.[0] || 0,
      type: 0
    }
  ]

  // ** use selector
  const {
    products,
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
  } = useSelector((state: RootState) => state.products)

  const getListProducts = () => {
    dispatch(
      getAllProductsAsync({
        params: {
          limit: pageSize,
          page: page,
          search: search,
          order: sortBy,
          status: statusSelected,
          productType: typeSelected
        }
      })
    )
  }

  const handleCloseModal = () => {
    setOpenCreateEdit({
      open: false,
      idProducts: ''
    })
  }

  const handleSort = (sort: any) => {
    const sortOptions = sort[0]
    if (sortOptions) {
      setSortBy(`${sortOptions.field} ${sortOptions.sort}`)
    }
  }

  const handleOnCloseDeleteProducts = () => {
    setOpenDeleteProducts({
      open: false,
      idProducts: ''
    })
  }

  const handleOnCloseDeleteMultipleProducts = () => {
    setOpenDeleteMultipleProducts(false)
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
        setOpenDeleteMultipleProducts(true)
        break
      }
    }
  }

  const fetchAllProductTypes = async () => {
    setLoading(true)
    try {
      setLoading(false)

      const response = await getAllProductTypes({ params: { limit: -1, page: -1 } })
      const productTypesArr = response?.data?.productTypes.map((item: any) => ({
        label: item.name,
        value: item._id
      }))

      setAllProductTypes(productTypesArr)
    } catch (error) {
      setLoading(false)
    }
  }

  const fetchReportProductStatus = async () => {
    setLoading(true)
    try {
      const response = await getReportProductStatus()
      setLoading(false)
      console.log(response)
      setReportProductStatus({
        data: response?.data?.data,
        totalUser: response?.data?.total
      })
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllProductTypes()
    fetchReportProductStatus()
  }, [])

  useEffect(() => {
    getListProducts()
  }, [sortBy, search, page, pageSize, statusSelected, typeSelected])

  useEffect(() => {
    if (isMessageCreateEdit) {
      if (isSuccessCreateEdit) {
        if (!openCreateEdit.idProducts) {
          toast.success(t('Create_product_type_success'))
        } else {
          toast.success(t('Update_product_type_success'))
        }
        handleCloseModal()
        getListProducts()
        fetchReportProductStatus()
        dispatch(resetInitialState())
      } else if (isErrorCreateEdit) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          if (!openCreateEdit.idProducts) {
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
        toast.success(isMessageDelete)
        getListProducts()
        fetchReportProductStatus()
      } else if (isErrorDelete) {
        toast.error(isMessageDelete)
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete])

  useEffect(() => {
    if (isMessageMultipleDelete) {
      if (isSuccessMultipleDelete) {
        toast.success(isMessageMultipleDelete)
        getListProducts()
        setCheckboxRow([])
        fetchReportProductStatus()

        dispatch(resetInitialState())
      } else if (isErrorMultipleDelete) {
        toast.error(isMessageMultipleDelete)
      }
    }
  }, [isErrorMultipleDelete, isSuccessMultipleDelete])

  const columns: GridColDef<[number]>[] = [
    {
      field: 'name',
      headerName: t('Name'),
      minWidth: 360,
      maxWidth: 360,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{row?.name}</Typography>
      }
    },
    {
      field: 'type',
      headerName: t('Type'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.type?.name}</Typography>
      }
    },
    {
      field: 'price',
      headerName: t('Price'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{`${formatPriceToLocal(row?.price)} VNĐ`}</Typography>
      }
    },
    {
      field: 'countInStock',
      headerName: t('countInStock'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.countInStock}</Typography>
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
                    idProducts: row?._id
                  })
                }
              />
            )}
            {DELETE && (
              <CustomGridDelete
                onClick={() => {
                  setOpenDeleteProducts({
                    open: true,
                    idProducts: row?._id
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

      <CreateEditProducts
        open={openCreateEdit.open}
        onClose={handleCloseModal}
        idProducts={openCreateEdit.idProducts}
      />

      <CustomConfirmDialog
        title='Title_delete_product_type'
        content='Confirm_delete_product_type'
        onClose={handleOnCloseDeleteProducts}
        open={openDeleteProducts.open}
        handleConfirm={() => {
          dispatch(deleteProductsAsync(openDeleteProducts?.idProducts))
          handleOnCloseDeleteProducts()
        }}
      />

      <CustomConfirmDialog
        title='Title_delete_multiple_product_type'
        content='Confirm_delete_multiple_product_type'
        onClose={handleOnCloseDeleteMultipleProducts}
        open={openDeleteMultipleProducts}
        handleConfirm={() => {
          const data = checkboxRow.map(item => item.id)
          dispatch(deleteMultipleProductsAsync({ productTypeIds: data }))
          handleOnCloseDeleteMultipleProducts()
        }}
      />

      <Box sx={{ display: 'flex', mb: 5, gap: 3 }}>
        {listProductStatus.map(item => {
          return <CardProductStatusCount item={item} key={item?.type} />
        })}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backgroundColor: theme.palette.background.paper,
          borderRadius: '15px',
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
              <Box sx={{ width: '200px', mt: 1 }}>
                {CREATE && (
                  <CustomSelect
                    value={typeSelected}
                    options={allProductTypes}
                    fullWidth
                    onChange={(data: any) => {
                      setTypeSelected(data)
                    }}
                    placeholder={t('Type')}
                  />
                )}
              </Box>
              <Box sx={{ width: '200px', mt: 1 }}>
                <CustomSelect
                  value={statusSelected}
                  options={Object.values(OBJECT_STATUS_PRODUCTS_PAGE)}
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
                    idProducts: ''
                  }))
                }
              />
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
            rows={products.data || {}}
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
                const findRow: any = products?.data.find((itemProducts: any) => itemProducts._id === item)

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

export default ProductsPage
