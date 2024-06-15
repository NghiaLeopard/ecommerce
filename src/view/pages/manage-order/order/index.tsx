// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { AvatarGroup, Box, Chip, ChipProps, Typography, styled, useTheme } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/order-product'
import { deleteOrderProductsAsync, getAllOrderCMSAsync } from 'src/stores/order-product/actions'
import { TOrderedProduct } from 'src/types/order-product'

// ** Component
import CustomConfirmDialog from 'src/components/custom-confirm-dialog'
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import { CustomSelect } from 'src/components/custom-select'
import CustomGridDelete from 'src/components/grid-delete'
import CustomGridEdit from 'src/components/grid-edit'
import InputSearch from 'src/components/input-search'
import { UpdateOrderProduct } from './components/UpdateOrderProduct'
import Spinner from 'src/components/spinner'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import i18n from 'src/configs/i18n'
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'
import { OBJECT_ACTION_STATUS } from 'src/configs/order'

// ** Toast
import toast from 'react-hot-toast'

// ** utils
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// ** Service
import { getAllCity } from 'src/services/city'

// ** MUI
import { Avatar } from '@mui/material'

// ** Hooks
import { usePermissions } from 'src/hooks/usePermissions'

type TProps = {}

type TSelectedRow = { id: string; role: { id: string; permissions: string[] } }

interface TStatusChip extends ChipProps {
  background: string
}

const StatusChip = styled(Chip)<TStatusChip>(({ theme, background }) => ({
  padding: '15px 0px',
  backgroundColor: background,
  color: theme.palette.common.white,
  fontWeight: 400
}))

const OrderPage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** i18n
  const { t } = useTranslation()

  // ** useState
  const [openDeleteUser, setOpenDeleteUser] = useState({
    open: false,
    orderId: ''
  })
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [allCity, setAllCity] = useState([])
  const [citySelected, setCitySelected] = useState<string[]>([])
  const [statusSelected, setStatusSelected] = useState('')
  const [checkboxRow, setCheckboxRow] = useState<TSelectedRow[]>([])
  const [openEdit, setOpenEdit] = useState({
    open: false,
    orderId: ''
  })

  // ** Dispatch
  const dispatch: AppDispatch = useDispatch()

  const { CREATE, UPDATE, DELETE, VIEW } = usePermissions('MANAGE_ORDER.ORDER', ['CREATE', 'UPDATE', 'DELETE', 'VIEW'])

  //** use selector
  const {
    isLoading,
    orderItemProduct,
    typeError,
    isErrorDeleteOrderProduct,
    isMessageDeleteOrderProduct,
    isSuccessDeleteOrderProduct,
    isSuccessUpdateOrderProduct,
    isErrorUpdateOrderProduct,
    isMessageUpdateOrderProduct
  } = useSelector((state: RootState) => state.orderProduct)

  const getListOrderProduct = () => {
    dispatch(
      getAllOrderCMSAsync({
        params: {
          limit: pageSize,
          page: page,
          search: search,
          order: sortBy,
          cityId: citySelected.join('|'),
          status: statusSelected === '' ? '' : Number(statusSelected)
        }
      })
    )
  }

  const OBJECT_ACTION_STATUS_STYLE: any = {
    0: { label: 'Wait_payment', background: theme.palette.warning.main },
    1: { label: 'Wait_delivery', background: theme.palette.secondary.main },
    2: { label: 'Done', background: theme.palette.success.main },
    3: { label: 'Cancel', background: theme.palette.error.main }
  }

  const handleCloseModal = () => {
    setOpenEdit({
      open: false,
      orderId: ''
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
      orderId: ''
    })
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

  useEffect(() => {
    getListOrderProduct()
  }, [sortBy, search, page, pageSize, citySelected, statusSelected])

  useEffect(() => {
    if (isMessageUpdateOrderProduct) {
      if (isSuccessUpdateOrderProduct) {
        toast.success(t('Update_order_product_success'))
        handleCloseModal()
      } else if (isErrorUpdateOrderProduct) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Update_order_product_error'))
        }
      }
      getListOrderProduct()
      dispatch(resetInitialState())
    }
  }, [isSuccessUpdateOrderProduct, isErrorUpdateOrderProduct])

  useEffect(() => {
    if (isMessageDeleteOrderProduct) {
      if (isSuccessDeleteOrderProduct) {
        toast.success(t('Delete_order_product_success'))
        getListOrderProduct()
      } else if (isErrorDeleteOrderProduct) {
        toast.error(t('Delete_order_product_success'))
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessDeleteOrderProduct, isErrorDeleteOrderProduct])

  const columns: GridColDef<[number]>[] = [
    {
      field: 'productItems',
      headerName: t('Product_items'),
      minWidth: 215,
      maxWidth: 215,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <AvatarGroup max={2}>
            {row.orderItems.map((item: TOrderedProduct) => {
              return <Avatar alt={item?.product?.slug} src={item?.image} key={item.product._id} />
            })}
          </AvatarGroup>
        )
      }
    },

    {
      field: i18n.language === 'vi' ? 'lastName' : 'firstNAme',
      headerName: t('Full_name'),
      flex: 1,
      minWidth: 215,
      maxWidth: 215,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.shippingAddress?.fullName}</Typography>
      }
    },
    {
      field: 'totalPrice',
      headerName: t('Total_price'),
      minWidth: 215,
      maxWidth: 215,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.totalPrice}</Typography>
      }
    },
    {
      field: 'phone',
      headerName: t('Phone_number'),
      minWidth: 215,
      maxWidth: 215,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.shippingAddress?.phone}</Typography>
      }
    },

    {
      field: 'city',
      headerName: t('City'),
      minWidth: 215,
      maxWidth: 215,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.shippingAddress?.city?.name}</Typography>
      }
    },
    {
      field: 'status',
      headerName: t('Status'),
      minWidth: 215,
      maxWidth: 215,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <StatusChip
            label={t(OBJECT_ACTION_STATUS_STYLE[row?.status].label)}
            background={OBJECT_ACTION_STATUS_STYLE[row?.status].background}
          />
        )
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
            {UPDATE && (
              <CustomGridEdit
                onClick={() =>
                  setOpenEdit({
                    open: true,
                    orderId: row?._id
                  })
                }
              />
            )}
            {DELETE && (
              <CustomGridDelete
                onClick={() => {
                  setOpenDeleteUser({
                    open: true,
                    orderId: row?._id
                  })
                }}
              />
            )}
          </>
        )
      }
    }
  ]

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

  return (
    <>
      {(loading || isLoading) && <Spinner />}

      <UpdateOrderProduct open={openEdit.open} orderId={openEdit.orderId} onClose={handleCloseModal} />

      <CustomConfirmDialog
        title='Title_delete_order_product'
        content='Confirm_delete_order_product'
        onClose={handleOnCloseDeleteUser}
        open={openDeleteUser.open}
        handleConfirm={() => {
          dispatch(deleteOrderProductsAsync(openDeleteUser?.orderId))
          handleOnCloseDeleteUser()
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
                    options={Object.values(OBJECT_ACTION_STATUS)}
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
              </>
            )}
          </Box>
          <CustomDataGrid
            rows={orderItemProduct || {}}
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
                const findRow: any = orderItemProduct?.find((itemUser: any) => itemUser._id === item)

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

export default OrderPage
