// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Grid, useTheme } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { deleteRolesAsync, getAllRolesAsync } from 'src/stores/roles/actions'

// ** Component
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import CustomGridCreate from 'src/components/grid-create'
import CustomGridDelete from 'src/components/grid-delete'
import CustomGridEdit from 'src/components/grid-edit'
import InputSearch from 'src/components/input-search'
import { CreateEditRole } from './components/CreateEditRole'
import Spinner from 'src/components/spinner'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { resetInitialState } from 'src/stores/roles'

// ** Toast
import toast from 'react-hot-toast'

type TProps = {}

const RoleListPage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** i18n
  const { t, i18n } = useTranslation()

  // ** useState
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    idRole: ''
  })

  // ** use selector

  const {
    roles,
    isErrorCreateEdit,
    isMessageCreateEdit,
    isSuccessCreateEdit,
    isLoading,
    isErrorDelete,
    isMessageDelete,
    isSuccessDelete
  } = useSelector((state: RootState) => state.role)

  const dispatch: AppDispatch = useDispatch()

  const getListRole = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1, search: '' } }))
  }

  useEffect(() => {
    getListRole()
  }, [isSuccessCreateEdit, isErrorCreateEdit, isErrorDelete, isSuccessDelete])

  useEffect(() => {
    if (isMessageCreateEdit) {
      if (isSuccessCreateEdit) {
        toast.success(isMessageCreateEdit)
        handleCloseModal()
      } else if (isErrorCreateEdit) {
        toast.error(isMessageCreateEdit)
      }

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

      dispatch(resetInitialState())
    }
  }, [isErrorDelete, isSuccessDelete])

  const handleOnChangePagination = () => {}

  const PaginationComponent = () => {
    return (
      <CustomPagination
        page={page}
        pageSize={pageSize}
        rowLength={roles.total}
        pageSizeOptions={[10, 20, 30, 40, 50]}
        onChangePagination={handleOnChangePagination}
      />
    )
  }

  const handleCloseModal = () => {
    setOpenCreateEdit({
      open: false,
      idRole: ''
    })
  }

  const columns: GridColDef<[number]>[] = [
    {
      field: 'name',
      headerName: 'NAME',
      flex: 1
    },
    {
      field: 'action',
      headerName: 'ACTIONS',
      minWidth: 150,
      sortable: false,
      align: 'left',
      renderCell: (rows: any) => {
        return (
          <Box>
            <CustomGridEdit
              onClick={() =>
                setOpenCreateEdit({
                  open: true,
                  idRole: rows?.id
                })
              }
            />
            <CustomGridDelete
              onClick={() => {
                dispatch(deleteRolesAsync(rows?.id))
              }}
            />
          </Box>
        )
      }
    }
  ]

  return (
    <>
      {isLoading && <Spinner />}
      <CreateEditRole open={openCreateEdit.open} onClose={handleCloseModal} idRole={openCreateEdit.idRole} />
      <Box
        sx={{
          display: 'flex',
          padding: '40px',
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Grid container>
          <Grid item md={5} xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
              <Box sx={{ width: '200px' }}>
                <InputSearch />
              </Box>
              <CustomGridCreate
                onClick={() =>
                  setOpenCreateEdit(x => ({
                    open: true,
                    idRole: ''
                  }))
                }
              />
            </Box>
            <CustomDataGrid
              rows={roles.data}
              columns={columns}
              getRowId={row => row._id}
              pageSizeOptions={[5]}
              autoHeight
              disableRowSelectionOnClick
              disableColumnFilter
              disableColumnMenu
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5
                  }
                }
              }}
              slots={{
                pagination: PaginationComponent
              }}
            />
          </Grid>
          <Grid item md={5} xs={12}></Grid>
        </Grid>
      </Box>
    </>
  )
}

export default RoleListPage
