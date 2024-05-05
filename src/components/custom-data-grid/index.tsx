import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import { DataGrid, DataGridProps, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { Ref, forwardRef } from 'react'

const StyledDataGrid = styled(DataGrid)<DataGridProps>(({ theme }) => ({
  '& .MuiDataGrid-main': {
    border: `1px solid ${theme.palette.customColors.borderColor}`,
    borderRadius: '8px'
  }
}))

const CustomDataGrid = forwardRef((props: DataGridProps, ref: Ref<any>) => {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <StyledDataGrid {...props} />
    </Box>
  )
})

export default CustomDataGrid
