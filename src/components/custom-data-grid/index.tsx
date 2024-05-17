import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import { DataGrid, DataGridProps } from '@mui/x-data-grid'
import { Ref, forwardRef } from 'react'

interface TCustomDataGrid extends DataGridProps {
  hasPagination?: boolean
}

const StyledDataGrid = styled(DataGrid)<TCustomDataGrid>(({ theme, hasPagination }) => ({
  '& .MuiDataGrid-root': {
    borderRadius: '9px'
  },
  '& .MuiDataGrid-main': {
    border: `1px solid ${theme.palette.customColors.borderColor}`,
    borderRadius: '15px',
    borderBottomRightRadius: hasPagination ? '0px' : '15px',
    borderBottomLeftRadius: hasPagination ? '0px' : '15px'
  },

  '& .MuiDataGrid-virtualScroller': {
    overflowX: 'hidden'
  },
  '& .MuiDataGrid-footerContainer': {
    border: `1px solid ${theme.palette.customColors.borderColor}`,
    borderTop: '0px',
    borderBottomRightRadius: '15px ',
    borderBottomLeftRadius: '15px'
  }
}))

const CustomDataGrid = forwardRef((props: TCustomDataGrid, ref: Ref<any>) => {
  const { hasPagination } = props

  return (
    <Box sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <StyledDataGrid {...props} hasPagination={hasPagination} />
    </Box>
  )
})

export default CustomDataGrid
