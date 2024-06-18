//** Next
import { useRouter } from 'next/router'

// ** React
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Avatar, Box, Rating, useTheme } from '@mui/material'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Component
import CustomConfirmDialog from 'src/components/custom-confirm-dialog'
import CustomIcon from 'src/components/Icon'

// ** Types
import { TReviewsProduct } from 'src/types/reviews'

// ** Utils
import { toFullName } from 'src/utils'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

import { useDispatch } from 'react-redux'

// ** Store
import { AppDispatch } from 'src/stores'
import { deleteReviewsAsync } from 'src/stores/reviews/actions'
import { ModalUpdateReviews } from './ModalUpdateReviewsMe'

type TCardReviewProduct = {
  item: TReviewsProduct
}

export default function CardReviewProduct({ item }: TCardReviewProduct) {
  // ** Theme
  const theme = useTheme()

  // ** Translation
  const { t, i18n } = useTranslation()

  // ** Router
  const router = useRouter()

  // ** Auth
  const { user } = useAuth()

  // ** State
  const [openConfirmDeleteReviews, setOpenConfirmDeleteReviews] = useState(false)
  const [openModalReview, setOpenModalReview] = useState({
    open: false,
    userId: '',
    productId: ''
  })

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const handleDeleteReviews = () => {
    dispatch(deleteReviewsAsync(item?._id))
    setOpenConfirmDeleteReviews(false)
  }

  const handleOnCloseDeleteProducts = () => {
    setOpenConfirmDeleteReviews(false)
  }

  const handleCloseModalReview = () => {
    setOpenModalReview({
      open: false,
      userId: '',
      productId: ''
    })
  }

  return (
    <>
      <CustomConfirmDialog
        title={t('Title_delete_review')}
        content={t('Confirm_delete_review')}
        onClose={handleOnCloseDeleteProducts}
        open={openConfirmDeleteReviews}
        handleConfirm={handleDeleteReviews}
      />

      <ModalUpdateReviews open={openModalReview.open} onClose={handleCloseModalReview} item={item} />

      <Card sx={{ mt: '15px', p: 5 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Avatar src={item?.user?.avatar} alt='Image' />
          <Box>
            <Typography>
              {toFullName(item?.user?.lastName, item?.user?.middleName, item?.user?.firstName, i18n.language)}
            </Typography>
            <Box>
              <Rating value={item?.star} />
            </Box>
          </Box>
        </Box>
        <Box>
          <Typography>{item?.content}</Typography>
        </Box>

        {item?.user?._id === user?._id && (
          <Box>
            <IconButton>
              <CustomIcon
                icon='tabler:edit'
                onClick={() =>
                  setOpenModalReview({
                    open: true,
                    productId: item?.product?._id,
                    userId: user?._id
                  })
                }
              />
            </IconButton>

            <IconButton>
              <CustomIcon icon='hugeicons:delete-02' onClick={() => setOpenConfirmDeleteReviews(true)} />
            </IconButton>
          </Box>
        )}
      </Card>
    </>
  )
}
