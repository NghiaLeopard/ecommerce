import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import { DataGrid, DataGridProps } from '@mui/x-data-grid'
import { Ref, forwardRef } from 'react'

interface TCustomDataGrid extends DataGridProps {
  hasPagination?: boolean
}

const StyledDataGrid = styled(DataGrid)<TCustomDataGrid>(({ theme, hasPagination }) => ({
  '.MuiDataGrid-withBorderColor': {
    outline: 'none !important'
  },
  '.MuiDataGrid-selectedRowCount': {
    display: 'none'
  },
  '.MuiDataGrid-columnHeaderTitle': {
    textTransform: 'capitalize',
    color: theme.palette.primary.main
  }
}))

const CustomDataGrid = forwardRef((props: TCustomDataGrid, ref: Ref<any>) => {
  const { hasPagination } = props

  return (
    <Box sx={{ width: '100%', height: '97%', overflow: 'auto' }}>
      <StyledDataGrid {...props} hasPagination={hasPagination} />
    </Box>
  )
})

export default CustomDataGrid
