import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import { DataGrid, DataGridProps } from '@mui/x-data-grid'
import { Ref, forwardRef } from 'react'

const StyledDataGrid = styled(DataGrid)<DataGridProps>(({ theme }) => ({
  '& .MuiDataGrid-root': {
    borderRadius: '9px'
  },
  '& .MuiDataGrid-main': {
    border: `1px solid ${theme.palette.customColors.borderColor}`,
    borderRadius: '15px'
  },

  '& .MuiDataGrid-virtualScroller': {
    overflowX: 'hidden'
  }
}))

const CustomDataGrid = forwardRef((props: DataGridProps, ref: Ref<any>) => {
  return (
    <Box sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <StyledDataGrid {...props} />
    </Box>
  )
})

export default CustomDataGrid
