// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Grid, Tooltip, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/reviews'
import { deleteMultipleReviewsAsync, deleteReviewsAsync, getAllReviewsAsync } from 'src/stores/reviews/actions'

// ** Component
import CustomConfirmDialog from 'src/components/custom-confirm-dialog'
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import CustomGridDelete from 'src/components/grid-delete'
import CustomGridEdit from 'src/components/grid-edit'
import InputSearch from 'src/components/input-search'
import Spinner from 'src/components/spinner'
import TableHeader from 'src/components/table-header'
import { CustomSelect } from 'src/components/custom-select'
import { EditReviews } from './components/EditReviews'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// ** Toast
import toast from 'react-hot-toast'
import { OBJECT_STAR_REVIEW } from 'src/configs/reviews'
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'

// ** utils
import { toFullName } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// ** Hook
import { usePermissions } from 'src/hooks/usePermissions'

type TProps = {}

type TSelectedRow = { id: string; role: { id: string; permissions: string[] } }

const ReviewsPage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** i18n
  const { t, i18n } = useTranslation()

  // ** useState
  const [openDeleteReviews, setOpenDeleteReviews] = useState({
    open: false,
    idReviews: ''
  })

  // ** State
  const [openDeleteMultipleReviews, setOpenDeleteMultipleReviews] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const dispatch: AppDispatch = useDispatch()
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [checkboxRow, setCheckboxRow] = useState<TSelectedRow[]>([])
  const [starSelected, setStarSelected] = useState()
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    idReviews: ''
  })

  const tableActions = [{ label: t('Delete'), value: 'delete' }]

  const { CREATE, UPDATE, DELETE, VIEW } = usePermissions('MANAGE_ORDER.REVIEW', ['CREATE', 'UPDATE', 'DELETE', 'VIEW'])

  // ** use selector
  const {
    reviews,
    isErrorUpdate,
    isMessageUpdate,
    isSuccessUpdate,
    isLoading,
    isErrorDelete,
    isMessageDelete,
    isSuccessDelete,
    isErrorMultipleDelete,
    isMessageMultipleDelete,
    isSuccessMultipleDelete,
    typeError
  } = useSelector((state: RootState) => state.reviews)

  const getListReviews = () => {
    dispatch(
      getAllReviewsAsync({
        params: {
          limit: pageSize,
          page: page,
          search: search,
          order: sortBy,
          minStar: starSelected
        }
      })
    )
  }

  const handleCloseModal = () => {
    setOpenCreateEdit({
      open: false,
      idReviews: ''
    })
  }

  const handleSort = (sort: any) => {
    const sortOptions = sort[0]
    if (sortOptions) {
      setSortBy(`${sortOptions.field} ${sortOptions.sort}`)
    }
  }

  const handleOnCloseDeleteReviews = () => {
    setOpenDeleteReviews({
      open: false,
      idReviews: ''
    })
  }

  const handleOnCloseDeleteMultipleReviews = () => {
    setOpenDeleteMultipleReviews(false)
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
        setOpenDeleteMultipleReviews(true)
        break
      }
    }
  }

  useEffect(() => {
    getListReviews()
  }, [sortBy, search, page, pageSize, starSelected])

  useEffect(() => {
    if (isMessageUpdate) {
      if (isSuccessUpdate) {
        toast.success(t('Update_reviews_success'))
        handleCloseModal()
        getListReviews()
        dispatch(resetInitialState())
      } else if (isErrorUpdate) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Update_reviews_error'))
        }
        dispatch(resetInitialState())
      }
    }
  }, [isErrorUpdate, isSuccessUpdate])

  useEffect(() => {
    if (isMessageDelete) {
      if (isSuccessDelete) {
        toast.success(t('Delete_reviews_success'))
        getListReviews()
      } else if (isErrorDelete) {
        toast.error(t('Delete_reviews_success'))
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete])

  useEffect(() => {
    if (isMessageMultipleDelete) {
      if (isSuccessMultipleDelete) {
        toast.success(t('Delete_multiple_reviews_success'))
        getListReviews()
        setCheckboxRow([])
        dispatch(resetInitialState())
      } else if (isErrorMultipleDelete) {
        toast.error(t('Delete_multiple_reviews_error'))
      }
    }
  }, [isErrorMultipleDelete, isSuccessMultipleDelete])

  const columns: GridColDef<[number]>[] = [
    {
      field: 'user',
      minWidth: 300,
      maxWidth: 300,
      headerName: t('User'),
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const fullName = toFullName(row?.user?.lastName, row?.user?.middleName, row?.user?.firstName, i18n.language)

        return <Typography>{fullName}</Typography>
      }
    },
    {
      field: 'nameProduct',
      headerName: t('Name_product'),
      minWidth: 300,
      maxWidth: 300,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Tooltip title={row?.product?.name}>
            <Typography sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {row?.product?.name}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      field: 'content',
      headerName: t('Content'),
      minWidth: 500,
      maxWidth: 500,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Tooltip title={row?.content}>
            <Typography sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row?.content}</Typography>
          </Tooltip>
        )
      }
    },
    {
      field: 'star',
      headerName: t('Star'),
      minWidth: 300,
      maxWidth: 300,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <Typography>{row?.star}</Typography>
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
                    idReviews: row?._id
                  })
                }
              />
            )}
            {DELETE && (
              <CustomGridDelete
                onClick={() => {
                  setOpenDeleteReviews({
                    open: true,
                    idReviews: row?._id
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

      <EditReviews open={openCreateEdit.open} onClose={handleCloseModal} idReviews={openCreateEdit.idReviews} />

      <CustomConfirmDialog
        title={t('Title_delete_reviews')}
        content={t('Confirm_delete_reviews')}
        onClose={handleOnCloseDeleteReviews}
        open={openDeleteReviews.open}
        handleConfirm={() => {
          dispatch(deleteReviewsAsync(openDeleteReviews?.idReviews))
          handleOnCloseDeleteReviews()
        }}
      />

      <CustomConfirmDialog
        title={t('Title_delete_multiple_reviews')}
        content={t('Confirm_delete_multiple_reviews')}
        onClose={handleOnCloseDeleteMultipleReviews}
        open={openDeleteMultipleReviews}
        handleConfirm={() => {
          const data = checkboxRow.map(item => item.id)
          dispatch(deleteMultipleReviewsAsync({ reviewIds: data }))
          handleOnCloseDeleteMultipleReviews()
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
              <Box sx={{ width: '200px', mt: 1 }}>
                <CustomSelect
                  value={starSelected}
                  options={Object.values(OBJECT_STAR_REVIEW())}
                  fullWidth
                  onChange={(data: any) => {
                    setStarSelected(data)
                  }}
                  placeholder={t('City')}
                />
              </Box>
              <Box sx={{ width: '200px' }}>
                <InputSearch onChange={handleOnChangeSearch} />
              </Box>
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
            rows={reviews.data || {}}
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
                const findRow: any = reviews?.data.find((itemReviews: any) => itemReviews._id === item)

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

export default ReviewsPage
