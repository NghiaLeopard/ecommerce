// ** MUI
import { Avatar, Box, Grid, Icon, Typography, useTheme } from '@mui/material'
import CustomIcon from 'src/components/Icon'
import { formatPriceToLocal } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type TCardCountAllRecord = {
  listRecords: Record<string, number>
}

const CardCountAllRecord = ({ listRecords }: TCardCountAllRecord) => {
  // ** Theme
  const theme = useTheme()

  const configRecords: Record<string, Record<string, string>> = {
    comment: {
      title: 'Comment',
      theme: theme.palette.primary.main,
      icon: 'mingcute:comment-line'
    },
    product: {
      title: 'Product',
      theme: theme.palette.secondary.main,
      icon: 'fluent-mdl2:product-release'
    },
    order: {
      title: 'Order',
      theme: theme.palette.success.main,
      icon: 'material-symbols:order-approve-rounded'
    },
    review: {
      title: 'Review',
      theme: theme.palette.error.main,
      icon: 'ic:twotone-rate-review'
    },
    revenue: {
      title: 'Revenue',
      theme: theme.palette.warning.main,
      icon: 'healthicons:money-bag'
    },
    user: {
      title: 'User',
      theme: theme.palette.info.main,
      icon: 'zondicons:user-group'
    }
  }

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '15px',
        width: '100%'
      }}
    >
      <Typography fontSize='30px' fontWeight='bold'>
        Statistics
      </Typography>
      <Grid container>
        {Object.keys(configRecords).map(itemObject => {
          return (
            <Grid key={itemObject} md={3} mt={5}>
              <Box sx={{ display: 'flex', gap: 2, justifyItems: 'center' }}>
                <Avatar
                  sx={{
                    backgroundColor: hexToRGBA(configRecords?.[itemObject]?.theme, 0.2),
                    height: '50px',
                    width: '50px'
                  }}
                >
                  <CustomIcon
                    icon={configRecords[itemObject].icon}
                    color={configRecords?.[itemObject]?.theme}
                    fontSize={'28px'}
                  />
                </Avatar>
                <Box>
                  <Typography fontSize='22px'>
                    {itemObject === 'revenue'
                      ? `${formatPriceToLocal(listRecords?.[itemObject])} VNĐ`
                      : listRecords?.[itemObject]}
                  </Typography>
                  <Typography>{configRecords[itemObject].title}</Typography>
                </Box>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default CardCountAllRecord
