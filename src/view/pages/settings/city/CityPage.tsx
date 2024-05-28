// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Chip, Grid, Typography, styled, useTheme } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/city'
import { deleteMultipleCityAsync, deleteCityAsync, getAllCityAsync } from 'src/stores/city/actions'

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
import { CreateEditCity } from './components/CreateEditCity'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { CONFIG_PERMISSIONS } from 'src/configs/permission'

// ** Toast
import toast from 'react-hot-toast'

// ** utils
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// ** Configs
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'
import { usePermissions } from 'src/hooks/usePermissions'

type TProps = {}

type TSelectedRow = { id: string; role: { id: string; permissions: string[] } }

const CityPage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** i18n
  const { t } = useTranslation()

  // ** useState
  const [openDeleteCity, setOpenDeleteCity] = useState({
    open: false,
    idCity: ''
  })

  const [openDeleteMultipleCity, setOpenDeleteMultipleCity] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const dispatch: AppDispatch = useDispatch()
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [checkboxRow, setCheckboxRow] = useState<TSelectedRow[]>([])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    idCity: ''
  })

  const tableActions = [{ label: t('Delete'), value: 'delete' }]

  const { CREATE, UPDATE, DELETE, VIEW } = usePermissions('SETTING.CITY', ['CREATE', 'UPDATE', 'DELETE', 'VIEW'])

  // ** use selector
  const {
    city,
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
  } = useSelector((state: RootState) => state.city)

  const getListCity = () => {
    dispatch(
      getAllCityAsync({
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
      idCity: ''
    })
  }

  const handleSort = (sort: any) => {
    const sortOptions = sort[0]
    if (sortOptions) {
      setSortBy(`${sortOptions.field} ${sortOptions.sort}`)
    }
  }

  const handleOnCloseDeleteCity = () => {
    setOpenDeleteCity({
      open: false,
      idCity: ''
    })
  }

  const handleOnCloseDeleteMultipleCity = () => {
    setOpenDeleteMultipleCity(false)
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
        setOpenDeleteMultipleCity(true)
        break
      }
    }
  }

  const memoDisabledDeleteCity = useMemo(() => {
    return checkboxRow.some((item: TSelectedRow) => item?.role?.permissions?.includes(CONFIG_PERMISSIONS.ADMIN))
  }, [checkboxRow])

  useEffect(() => {
    getListCity()
  }, [sortBy, search, page, pageSize])

  useEffect(() => {
    if (isMessageCreateEdit) {
      if (isSuccessCreateEdit) {
        if (!openCreateEdit.idCity) {
          toast.success(t('Create_city_success'))
        } else {
          toast.success(t('Update_city_success'))
        }
        handleCloseModal()
        getListCity()
        dispatch(resetInitialState())
      } else if (isErrorCreateEdit) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          if (!openCreateEdit.idCity) {
            toast.error(t('Create_city_error'))
          } else {
            toast.error(t('Update_city_error'))
          }
        }
        dispatch(resetInitialState())
      }
    }
  }, [isErrorCreateEdit, isSuccessCreateEdit])

  useEffect(() => {
    if (isMessageDelete) {
      if (isSuccessDelete) {
        toast.success(t('Delete_city_success'))
        getListCity()
      } else if (isErrorDelete) {
        toast.error(t('Delete_city_success'))
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete])

  useEffect(() => {
    if (isMessageMultipleDelete) {
      if (isSuccessMultipleDelete) {
        toast.success(t('Delete_multiple_city_success'))
        getListCity()
        setCheckboxRow([])
        dispatch(resetInitialState())
      } else if (isErrorMultipleDelete) {
        toast.error(t('Delete_multiple_city_error'))
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
      field: 'action',
      headerName: t('Actions'),
      minWidth: 180,
      maxWidth: 180,
      sortable: false,
      renderCell: (rows: any) => {
        const { row } = rows

        return (
          <>
            <CustomGridEdit
              onClick={() =>
                setOpenCreateEdit({
                  open: true,
                  idCity: row?._id
                })
              }
            />
            <CustomGridDelete
              onClick={() => {
                setOpenDeleteCity({
                  open: true,
                  idCity: row?._id
                })
              }}
            />
          </>
        )
      }
    }
  ]

  return (
    <>
      {(isLoading || loading) && <Spinner />}

      <CreateEditCity open={openCreateEdit.open} onClose={handleCloseModal} idCity={openCreateEdit.idCity} />

      <CustomConfirmDialog
        title='Title_delete_city'
        content='Confirm_delete_city'
        onClose={handleOnCloseDeleteCity}
        open={openDeleteCity.open}
        handleConfirm={() => {
          dispatch(deleteCityAsync(openDeleteCity?.idCity))
          handleOnCloseDeleteCity()
        }}
      />

      <CustomConfirmDialog
        title='Title_delete_multiple_city'
        content='Confirm_delete_multiple_city'
        onClose={handleOnCloseDeleteMultipleCity}
        open={openDeleteMultipleCity}
        handleConfirm={() => {
          const data = checkboxRow.map(item => item.id)
          dispatch(deleteMultipleCityAsync({ cityIds: data }))
          handleOnCloseDeleteMultipleCity()
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
              <CustomGridCreate
                onClick={() =>
                  setOpenCreateEdit(x => ({
                    open: true,
                    idCity: ''
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
              disabled={memoDisabledDeleteCity}
            />
          )}
          <CustomDataGrid
            rows={city.data || {}}
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
            style={{ width: '99%' }}
            onRowSelectionModelChange={(row: GridRowSelectionModel) => {
              const formatData = row?.map(item => {
                const findRow: any = city?.data.find((itemCity: any) => itemCity._id === item)

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

export default CityPage
