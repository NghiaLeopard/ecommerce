// ** React
import { MouseEvent, useState } from 'react'

// ** MUI
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// ** Config
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import CustomIcon from 'src/components/Icon'
import { OBJECT_ACTION_STATUS } from 'src/configs/order'
import { AppDispatch } from 'src/stores'
import { UpdateStatusOrderProductsAsync } from 'src/stores/order-product/actions'
import { TOrderedProduct } from 'src/types/order-product'

type TButtonStatus = {
  listOrderStatus: Record<string, number>[]
  row: any
}

export const ButtonStatusOrder = ({ listOrderStatus, row }: TButtonStatus) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ** Translation
  const { t } = useTranslation()

  // ** Dispatch
  const dispatch: AppDispatch = useDispatch()

  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClickItem = (value: number) => {
    dispatch(
      UpdateStatusOrderProductsAsync({
        status: value,
        orderId: row?._id
      })
    )
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <CustomIcon icon='pepicons-pencil:dots-y' />
      </IconButton>
      <Menu id='long-menu' anchorEl={anchorEl} open={open} onClose={handleClose}>
        {listOrderStatus.map(
          item =>
            item.type !== 4 && (
              <MenuItem key={item.type} onClick={() => handleClickItem(item.type)}>
                {t(`${OBJECT_ACTION_STATUS?.[item.type]?.label}`)}
              </MenuItem>
            )
        )}
      </Menu>
    </>
  )
}
