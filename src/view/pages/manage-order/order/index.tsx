// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { AvatarGroup, Box, Chip, ChipProps, Grid, Switch, Typography, styled, useTheme } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/order-product'
import {
  UpdateStatusOrderProductsAsync,
  deleteOrderProductsAsync,
  getAllOrderCMSAsync
} from 'src/stores/order-product/actions'

// ** Component
import CustomConfirmDialog from 'src/components/custom-confirm-dialog'
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import { CustomSelect } from 'src/components/custom-select'
import CustomGridDelete from 'src/components/grid-delete'
import CustomGridEdit from 'src/components/grid-edit'
import InputSearch from 'src/components/input-search'
import Spinner from 'src/components/spinner'
import { UpdateOrderProduct } from './components/UpdateOrderProduct'

// ** Config
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import i18n from 'src/configs/i18n'
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
import { getReportOrderStatus } from 'src/services/report'
import { CardOrderStatus } from './components/CardOrderStatus'

// ** Type
import { TOrderedProduct } from 'src/types/order-product'
import { ButtonStatusOrder } from './components/ButtonStatusOrder'

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

  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [allCity, setAllCity] = useState([])
  const [citySelected, setCitySelected] = useState<string[]>([])
  const [statusSelected, setStatusSelected] = useState('')
  const [checkboxRow, setCheckboxRow] = useState<TSelectedRow[]>([])
  const [reportOrderStatus, setReportOrderStatus] = useState<{ data: Record<number, number>; totalOrder: number }>(
    {} as any
  )
  const [openDeleteUser, setOpenDeleteUser] = useState({
    open: false,
    orderId: ''
  })
  const [openEdit, setOpenEdit] = useState({
    open: false,
    orderId: ''
  })

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const {
    isLoading,
    orderItemProduct,
    typeError,
    isErrorDeleteOrderProduct,
    isMessageDeleteOrderProduct,
    isSuccessDeleteOrderProduct,
    isSuccessUpdateOrderProduct,
    isErrorUpdateOrderProduct,
    isMessageUpdateOrderProduct,
    isSuccessUpdateStatusOrderProduct,
    isErrorUpdateStatusOrderProduct,
    isMessageUpdateStatusOrderProduct
  } = useSelector((state: RootState) => state.orderProduct)

  const { UPDATE, DELETE } = usePermissions('MANAGE_ORDER.ORDER', ['CREATE', 'UPDATE', 'DELETE', 'VIEW'])

  const OBJECT_ACTION_STATUS_STYLE: any = {
    0: { label: 'Wait_payment', background: theme.palette.warning.main },
    1: { label: 'Wait_delivery', background: theme.palette.info.main },
    2: { label: 'Done', background: theme.palette.success.main },
    3: { label: 'Cancel', background: theme.palette.error.main }
  }

  const listOrderStatus = [
    {
      countUser: reportOrderStatus?.totalOrder || 0,
      type: 4
    },
    {
      countUser: reportOrderStatus?.data?.[3] || 0,
      type: 3
    },
    {
      countUser: reportOrderStatus?.data?.[0] || 0,
      type: 0
    },
    {
      countUser: reportOrderStatus?.data?.[1] || 0,
      type: 1
    },
    {
      countUser: reportOrderStatus?.data?.[2] || 0,
      type: 2
    }
  ]

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
    getListOrderProduct()
  }, [sortBy, search, page, pageSize, citySelected, statusSelected])

  const fetchReportOrderStatus = async () => {
    setLoading(true)
    try {
      const response = await getReportOrderStatus()
      setLoading(false)
      setReportOrderStatus({
        data: response?.data?.data,
        totalOrder: response?.data?.total
      })
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllCity()
    fetchReportOrderStatus()
  }, [])

  useEffect(() => {
    if (isMessageUpdateOrderProduct) {
      if (isSuccessUpdateOrderProduct) {
        toast.success(t('Update_order_product_success'))
        getListOrderProduct()
        handleCloseModal()
      } else if (isErrorUpdateOrderProduct) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Update_order_product_error'))
        }
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessUpdateOrderProduct, isErrorUpdateOrderProduct])

  useEffect(() => {
    if (isMessageUpdateStatusOrderProduct) {
      if (isSuccessUpdateStatusOrderProduct) {
        toast.success(t('Update_status_order_product_success'))
        getListOrderProduct()
        handleCloseModal()
        dispatch(resetInitialState())
      } else if (isErrorUpdateStatusOrderProduct) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Update_status_order_product_error'))
        }
      }
    }
  }, [isSuccessUpdateStatusOrderProduct, isErrorUpdateStatusOrderProduct])

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
      field: 'paidStatus',
      headerName: t('Paid_status'),
      minWidth: 215,
      maxWidth: 215,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Switch
            checked={Boolean(row?.isPaid)}
            onChange={e => {
              dispatch(
                UpdateStatusOrderProductsAsync({
                  isPaid: Boolean(row?.isPaid) ? 0 : 1,
                  orderId: row?._id
                })
              )
            }}
            value={row?.isPaid}
          />
        )
      }
    },
    {
      field: 'deliveryStatus',
      headerName: t('Delivery_status'),
      minWidth: 215,
      maxWidth: 215,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Switch
            checked={Boolean(row?.isDelivered)}
            onChange={e =>
              dispatch(
                UpdateStatusOrderProductsAsync({
                  isDelivered: Boolean(row?.isDelivered) ? 0 : 1,
                  orderId: row?._id
                })
              )
            }
            value={row?.isDelivered}
          />
        )
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
            sx={{ width: '70%' }}
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

            <ButtonStatusOrder row={row} listOrderStatus={listOrderStatus} />
          </>
        )
      }
    }
  ]

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

      <Grid container spacing={3} sx={{ display: 'flex', mb: 5 }}>
        {listOrderStatus.map(item => {
          return (
            <Grid item xs={12} sm={6} md={4} key={item?.type}>
              <CardOrderStatus item={item} />
            </Grid>
          )
        })}
      </Grid>

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
