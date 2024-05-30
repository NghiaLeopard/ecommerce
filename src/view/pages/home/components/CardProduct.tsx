import { Box, Button, useTheme } from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CustomIcon from 'src/components/Icon'

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

export default function CardProduct() {
  const theme = useTheme()

  return (
    <Card sx={{ maxWidth: 345, position: 'relative' }}>
      <CardActions sx={{ padding: '8px 24px', position: 'absolute', top: '-5px', left: '270px' }}>
        <IconButton aria-label='add to favorites'>
          <CustomIcon icon='mdi:heart' />
        </IconButton>
      </CardActions>
      <CardMedia component='img' height='194' image='/static/images/cards/paella.jpg' alt='Paella dish' />
      <CardContent sx={{ padding: '8px 24px' }}>
        <Typography variant='h4' color={theme.palette.primary.main} fontWeight='bold'>
          Product
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            color={theme.palette.primary.main}
            fontWeight='bold'
            variant='h6'
            sx={{ textDecoration: 'line-through', color: theme.palette.error.main }}
          >
            500.000 VND
          </Typography>
          <Typography color={theme.palette.primary.main} fontWeight='bold' variant='h3'>
            500.000 VND
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>
            Còn <b>7</b> sản phẩm trong kho
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>
              <b>5</b>
            </Typography>
            <CustomIcon icon='emojione:star'></CustomIcon>
          </Box>
        </Box>
      </CardContent>

      <Button
        type='submit'
        variant='contained'
        fullWidth
        sx={{ borderTopLeftRadius: '0', borderTopRightRadius: '0', height: '40px', fontWeight: '600' }}
      >
        <CustomIcon icon='mdi:cart-outline' style={{ marginRight: '5px' }} />
        Add to cart
      </Button>
    </Card>
  )
}
