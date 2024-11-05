// ** Next
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'

// ** React
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Button, Grid, IconButton, Rating, Tooltip, Typography, useTheme } from '@mui/material'

// ** Type
import { TProduct } from 'src/types/products'

// ** Component
import CustomIcon from 'src/components/Icon'
import { CustomCarousel } from 'src/components/custom-carousel'
import { CustomInputComment } from 'src/components/custom-input-comment'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'
import CardProductRelated from '../home/components/CardProductRelated'
import CardReviewProduct from '../home/components/CardReviewProduct'
import CardSkeletonRelated from '../home/components/CardSkeletonRelated'
import { ItemComment } from '../home/components/ItemComment'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Service
import { getAllCommentsPublic } from 'src/services/comments'
import { getAllProductsRelevant, getDetailProductsPublic } from 'src/services/products'
import { getAllReviews } from 'src/services/reviews'

// ** Utils
import { cloneDeep, executeUpdateCard, formatPriceToLocal, isExpiry } from 'src/utils'

// ** Redux

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState as resetInitialStateComment } from 'src/stores/comment'
import { createCommentsAsync } from 'src/stores/comment/actions'
import { updateToCart } from 'src/stores/order-product'
import { resetInitialState } from 'src/stores/reviews'

// ** utils
import { useDispatch, useSelector } from 'react-redux'

// ** Helper
import connectSocketIo from 'src/helpers/socket/socketIo'
import { getOrderItem, setOrderItem } from 'src/helpers/storage'

// ** Config
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'
import { ACTION_SOCKET_COMMENT } from 'src/configs/socketIo'
import { CONFIG_ROUTE } from 'src/configs/route'

// ** Type
import { TComment } from 'src/types/comments'
import { TReviewsProduct } from 'src/types/reviews'

type TProps = {}

type TServerSide = {
  listProductDetail: TProduct
  listProductRelate: TProduct[]
}

const ProductDetail: NextPage<TServerSide> = ({ listProductDetail, listProductRelate }: TServerSide) => {
  // ** Theme
  const theme = useTheme()

  // ** Translation
  const { t, i18n } = useTranslation()

  // ** Router
  const router = useRouter()

  // ** State
  const [loading, setLoading] = useState(false)
  const [dataDetailProduct, setDataDetailProduct] = useState<TProduct | any>({} as any)
  const [listComment, setListComment] = useState<TComment[]>([])
  const [dataProductRelated, setDataProductRelated] = useState<TProduct[]>([])
  const [listReviewsProduct, setListReviewsProduct] = useState<TReviewsProduct[]>([])
  const [amountCart, setAmountCart] = useState(1)

  // ** Ref
  const refFetchReview = useRef(false)

  // ** Dispatch
  const dispatch: AppDispatch = useDispatch()

  // ** Auth
  const { user } = useAuth()

  // ** Selector
  const { orderItem } = useSelector((state: RootState) => state.orderProduct)

  const isExpiryDay = isExpiry(dataDetailProduct?.discountStartDate, dataDetailProduct?.discountEndDate)

  const {
    isLoading,
    isErrorDelete,
    isSuccessDelete,
    isMessageDelete,
    isErrorUpdate,
    isSuccessUpdate,
    isMessageUpdate,
    typeError
  } = useSelector((state: RootState) => state.reviews)

  const {
    isLoading: isLoadingComment,
    isErrorCreate: isErrorCreateComment,
    isSuccessCreate: isSuccessCreateComment,
    isMessageCreate: isMessageCreateComment,
    isMessageDeleteMe,
    isSuccessDeleteMe,
    isErrorDeleteMe,
    isErrorUpdateMe,
    isMessageUpdateMe,
    isSuccessUpdateMe,
    typeError: typeErrorComment
  } = useSelector((state: RootState) => state.comments)

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  }

  console.log(listProductRelate)

  const handleChangeAmountCart = (amount: number) => {
    setAmountCart(prev => (prev += amount))
  }

  const handleUpdateToCart = (item: TProduct, amount: number) => {
    const dataCart = getOrderItem()
    const dataCartParse = dataCart ? JSON.parse(dataCart) : {}

    const arrCart = executeUpdateCard(orderItem, {
      name: item.name,
      amount: amount,
      slug: item.slug,
      price: item.price,
      product: item._id,
      image: item.image,
      discount: item.discount,
      discountEndDate: item.discountEndDate || null,
      discountStartDate: item.discountStartDate || null
    })

    // This page is public then when adjust amount cart , you must log in

    if (user?._id) {
      dispatch(
        updateToCart({
          orderItem: arrCart
        })
      )
      setOrderItem(JSON.stringify({ ...dataCartParse, [user?._id]: arrCart }))
    } else {
      router.replace({
        pathname: 'login',
        query: { returnUrl: router.asPath }
      })
    }
  }

  const handleBuyProduct = (item: TProduct) => {
    handleUpdateToCart(item, amountCart)
    router.push({
      pathname: CONFIG_ROUTE.MY_CART,
      query: { selected: JSON.stringify(item._id) }
    })
  }

  const fetchAllReviewsProduct = async () => {
    const params = {
      limit: 10,
      page: 1,
      productId: dataDetailProduct?._id,
      isPublic: true
    }
    try {
      const res = await getAllReviews({ params: params })
      setListReviewsProduct(res?.data?.reviews)
    } catch (error) {}
  }

  const fetchListCommentPublic = async () => {
    setLoading(true)
    const params = {
      limit: -1,
      page: -1,
      productId: dataDetailProduct._id
    }
    try {
      const res = await getAllCommentsPublic({ params: params })
      setLoading(false)
      setListComment(res?.data?.comments)
    } catch (error) {
      setLoading(false)
    }
  }

  const handleSubmitComment = (data: { content: string }) => {
    if (user) {
      if (data?.content) {
        dispatch(
          createCommentsAsync({
            content: data?.content,
            user: user?._id,
            product: dataDetailProduct?._id
          })
        )
      }
    } else {
      if (router.asPath !== '/') {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath }
        })
      } else {
        router.replace('/login')
      }
    }
  }

  const editDeleteSocketComment = (listComment: TComment[], comment: TComment, type: string) => {
    let cloneListComment = cloneDeep(listComment as any)

    cloneListComment.forEach((element: TComment) => {
      if (comment.parent === element?._id && element?.replies?.length > 0) {
        const result = editDeleteSocketComment(element.replies, comment, type)
        if (type === 'delete') {
          element.replies = result
        }
      } else {
        if (type === 'update') {
          const findItemReplies = listComment.find((itemReplies: TComment) => itemReplies._id === comment._id)
          if (findItemReplies) {
            findItemReplies.content = comment.content
          }
        } else if (type === 'delete') {
          cloneListComment = cloneListComment.filter((itemReplies: TComment) => {
            return itemReplies._id !== comment._id
          })

          return cloneListComment
        }
      }
    })

    return [...cloneListComment]
  }

  const handleFilterDeleteMany = (listComment: TComment[], listIdComment: string[]) => {
    return listComment.filter((itemClone: TComment) => !listIdComment.includes(itemClone._id))
  }

  const deleteMultipleSocketComment = (listComment: TComment[], listIdComment: string[]) => {
    let cloneListComment = cloneDeep(listComment as any)
    cloneListComment = handleFilterDeleteMany(cloneListComment, listIdComment)

    cloneListComment.forEach((item: TComment) => {
      if (item.replies.length > 0) {
        item.replies = handleFilterDeleteMany(item.replies, listIdComment)
      }
    })

    return [...cloneListComment]
  }

  useEffect(() => {
    if (dataDetailProduct?._id) {
      fetchAllReviewsProduct()
      fetchListCommentPublic()
    }
  }, [dataDetailProduct?._id])

  useEffect(() => {
    setDataDetailProduct(listProductDetail)
    setDataProductRelated(listProductRelate)
  }, [listProductDetail, listProductRelate])

  useEffect(() => {
    if (isMessageDelete) {
      if (isSuccessDelete) {
        toast.success(t('Delete_reviews_product_success'))
        dispatch(resetInitialState())
        fetchAllReviewsProduct()
      } else if (isErrorDelete) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Delete_reviews_product_error'))
        }
        dispatch(resetInitialState())
      }
    }
  }, [isErrorDelete, isSuccessDelete])

  useEffect(() => {
    if (isMessageUpdate) {
      if (isSuccessUpdate) {
        toast.success(t('Update_reviews_product_success'))
        dispatch(resetInitialState())
        fetchAllReviewsProduct()
      } else if (isErrorUpdate) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Update_reviews_product_error'))
        }
        dispatch(resetInitialState())
      }
    }
  }, [isErrorUpdate, isSuccessUpdate])

  useEffect(() => {
    if (isMessageCreateComment) {
      if (isSuccessCreateComment) {
        toast.success(t('Create_comment_success'))
        dispatch(resetInitialStateComment())
      } else if (isErrorCreateComment) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeErrorComment]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Create_comment_error'))
        }
        dispatch(resetInitialStateComment())
      }
    }
  }, [isErrorCreateComment, isSuccessCreateComment])

  useEffect(() => {
    if (isMessageDeleteMe) {
      if (isSuccessDeleteMe) {
        toast.success(t('Delete_comment_success'))
        dispatch(resetInitialStateComment())
      } else if (isErrorDeleteMe) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeErrorComment]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Delete_comment_error'))
        }
        dispatch(resetInitialStateComment())
      }
    }
  }, [isErrorDeleteMe, isSuccessDeleteMe])

  useEffect(() => {
    if (isMessageUpdateMe) {
      if (isSuccessUpdateMe) {
        toast.success(t('Update_comment_success'))
        dispatch(resetInitialStateComment())
      } else if (isErrorUpdateMe) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeErrorComment]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Update_comment_error'))
        }
        dispatch(resetInitialStateComment())
      }
    }
  }, [isErrorUpdateMe, isSuccessUpdateMe])

  useEffect(() => {
    const socketIo = connectSocketIo()
    socketIo.on(ACTION_SOCKET_COMMENT.CREATE_COMMENT, (data: TComment) => {
      const cloneListComment = [...listComment]
      cloneListComment.unshift({ ...data })
      setListComment([...cloneListComment])
    })

    socketIo.on(ACTION_SOCKET_COMMENT.UPDATE_COMMENT, (data: TComment) => {
      const resultArr = editDeleteSocketComment(listComment, data, 'update')
      setListComment([...resultArr])
    })

    socketIo.on(ACTION_SOCKET_COMMENT.DELETE_COMMENT, (data: TComment) => {
      const resultArr = editDeleteSocketComment(listComment, data, 'delete')
      setListComment([...resultArr])
    })

    socketIo.on(ACTION_SOCKET_COMMENT.DELETE_MULTIPLE_COMMENT, (data: string[]) => {
      const resultArr = deleteMultipleSocketComment(listComment, data)
      setListComment(resultArr)
    })

    socketIo.on(ACTION_SOCKET_COMMENT.REPLY_COMMENT, (data: TComment) => {
      const cloneListComment = cloneDeep(listComment as any)
      cloneListComment.forEach((element: TComment) => {
        if (element._id === data.parent) {
          element.replies.unshift({ ...data })
        }
      })
      setListComment([...cloneListComment])
    })

    return () => {
      socketIo.disconnect()
    }
  }, [listComment])

  return (
    <>
      {(loading || isLoading || isLoadingComment) && <Spinner />}
      <Box>
        <Typography sx={{ color: theme.palette.primary.main, mb: 3 }} fontWeight='500' fontSize='18px'>
          {t('Product_details')} {'>'} {t(`${dataDetailProduct?.type?.name}`)} {'>'} {t(`${dataDetailProduct?.name}`)}
        </Typography>
      </Box>
      <Grid container>
        <Grid
          container
          item
          sx={{
            padding: '20px',
            backgroundColor: theme.palette.background.paper,
            borderRadius: '15px'
          }}
          md={12}
          xs={12}
        >
          <Grid item xs={12} md={5}>
            {dataDetailProduct?.image && (
              <Image
                alt='Image detail product'
                src={dataDetailProduct?.image}
                width={0}
                height='300'
                style={{
                  width: '100%',
                  objectFit: 'contain',
                  borderRadius: '10px'
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography
              variant='h4'
              color={theme.palette.primary.main}
              fontWeight='bold'
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical'
              }}
            >
              {dataDetailProduct?.name}
            </Typography>
            <Box>
              <Typography sx={{ mt: '5xpx' }}>
                {dataDetailProduct?.countInStock > 0
                  ? `Còn ${dataDetailProduct?.countInStock} sản phẩm trong kho`
                  : t('Out_in_stock')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {dataDetailProduct?.averageRating > 0 ? (
                  <Box sx={{ display: 'flex', alignContent: 'center', gap: 1 }}>
                    <Typography
                      sx={{ textDecoration: 'underline', color: theme.palette.primary.main }}
                      fontWeight='600'
                      fontSize='18px'
                    >
                      {dataDetailProduct?.averageRating}
                    </Typography>
                    <Rating
                      name='half-rating'
                      defaultValue={2.5}
                      value={dataDetailProduct?.averageRating}
                      precision={0.5}
                    />
                  </Box>
                ) : (
                  <Typography>Chưa có đánh giá</Typography>
                )}
              </Box>
              <Typography>|</Typography>
              {dataDetailProduct?.totalReviews ? (
                <>
                  <Typography>
                    {dataDetailProduct?.totalReviews} {t('Ratings')}
                  </Typography>

                  <Typography>|</Typography>
                </>
              ) : (
                <></>
              )}
              <Typography>
                {t('Sold_product')} {dataDetailProduct?.sold} {t('Product')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
              <CustomIcon icon='carbon:location' />
              {dataDetailProduct?.location?._id && <Typography>{dataDetailProduct.location.name}</Typography>}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: theme.palette.customColors.bodyBg,
                width: '100%',
                padding: 2,
                borderRadius: '10px'
              }}
            >
              {dataDetailProduct?.discount > 0 && isExpiryDay && (
                <Typography
                  color={theme.palette.primary.main}
                  fontWeight='bold'
                  variant='h6'
                  sx={{ textDecoration: 'line-through', color: theme.palette.error.main }}
                >
                  {`${formatPriceToLocal(dataDetailProduct?.price)} VNĐ`}
                </Typography>
              )}
              <Typography color={theme.palette.primary.main} fontWeight='bold' variant='h4'>
                {dataDetailProduct?.discount > 0 && isExpiryDay
                  ? `${formatPriceToLocal((dataDetailProduct?.price * (100 - dataDetailProduct?.discount)) / 100)} VNĐ`
                  : `${formatPriceToLocal(dataDetailProduct?.price)} VNĐ`}
              </Typography>

              {dataDetailProduct?.discount && isExpiryDay && (
                <Box
                  sx={{ backgroundColor: 'rgba(254,238,234,1)', color: theme.palette.error.main, padding: '0px 6px' }}
                >
                  {`-${dataDetailProduct.discount}%`}
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexBasis: '10%', gap: 2, mt: '5px' }}>
              <Tooltip title='Delete'>
                <span>
                  <IconButton
                    disabled={amountCart === 1}
                    sx={{
                      backgroundColor: `${theme.palette.primary.main} !important`,
                      color: theme.palette.common.white
                    }}
                    onClick={() => handleChangeAmountCart(-1)}
                  >
                    <CustomIcon icon='ic:baseline-minus' />
                  </IconButton>
                </span>
              </Tooltip>
              <CustomTextField
                value={amountCart}
                sx={{
                  '.MuiInputBase-input': {
                    width: '20px'
                  },
                  '.MuiInputBase-root': {
                    border: 'none',
                    borderBottom: '1px solid',
                    borderRadius: '0 !important'
                  }
                }}
              />
              <Tooltip title='Create'>
                <span>
                  <IconButton
                    onClick={() => handleChangeAmountCart(1)}
                    sx={{
                      backgroundColor: `${theme.palette.primary.main} !important`,
                      color: theme.palette.common.white
                    }}
                  >
                    <CustomIcon icon='ph:plus-bold' />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', direction: 'column', gap: 5, mt: '20px' }}>
              <Button
                variant='outlined'
                sx={{ height: '40px', fontWeight: '600', mt: 2 }}
                onClick={() => handleUpdateToCart(dataDetailProduct, amountCart)}
                disabled={dataDetailProduct?.countInStock === 0}
              >
                <CustomIcon icon='mdi:cart-outline' style={{ marginRight: '5px' }} />
                {t('Add_to_cart')}
              </Button>

              <Button
                disabled={dataDetailProduct?.countInStock === 0}
                variant='contained'
                sx={{ height: '40px', fontWeight: '600', mt: 2 }}
                onClick={() => handleBuyProduct(dataDetailProduct)}
              >
                <CustomIcon icon='icon-park-twotone:buy' style={{ marginRight: '5px' }} />
                {t('Buy_now')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid container mt={{ md: 5, xs: 0 }} width='100%'>
        <Grid container item md={9} xs={12} width='100%'>
          <Box width='100%'>
            {dataDetailProduct?.description && (
              <Box
                sx={{ width: '100%', background: theme.palette.background.paper, borderRadius: '15px', px: 4, py: 5 }}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.customColors.bodyBg,
                    width: '100%',
                    padding: 2,
                    borderRadius: '10px'
                  }}
                >
                  <Typography fontSize='20px' fontWeight='bold' color={theme.palette.primary.main}>
                    {t('Description_product')}
                  </Typography>
                </Box>
                <div
                  dangerouslySetInnerHTML={{ __html: dataDetailProduct?.description }}
                  style={{ marginTop: '10px' }}
                ></div>
              </Box>
            )}

            {listReviewsProduct.length > 0 && (
              <Box
                sx={{
                  width: '100%',
                  background: theme.palette.background.paper,
                  borderRadius: '15px',
                  px: 4,
                  py: 5,
                  mt: 5
                }}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.customColors.bodyBg,
                    width: '100%',
                    padding: 2,
                    borderRadius: '10px'
                  }}
                >
                  <Typography fontSize='20px' fontWeight='bold' color={theme.palette.primary.main}>
                    {t('Review_product')}: {listReviewsProduct.length} {t('Ratings')}
                  </Typography>
                </Box>
                <Box width='100%' height='auto'>
                  <CustomCarousel ssr={true} keyBoardControl={true} showDots={true} responsive={responsive}>
                    {listReviewsProduct?.map((item: TReviewsProduct) => {
                      return <CardReviewProduct key={item._id} item={item} />
                    })}
                  </CustomCarousel>
                </Box>
              </Box>
            )}

            <Box
              sx={{
                width: '100%',
                background: theme.palette.background.paper,
                borderRadius: '15px',
                px: 4,
                py: 5,
                mt: 5
              }}
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.customColors.bodyBg,
                  width: '100%',
                  padding: 2,
                  borderRadius: '10px',
                  mb: 5
                }}
              >
                <Typography fontSize='20px' fontWeight='bold' color={theme.palette.primary.main}>
                  {t('Comment_product')}: {listComment?.length} {t('comment')}
                </Typography>
              </Box>

              <CustomInputComment onSubmit={handleSubmitComment} />

              <Box sx={{ mt: 7 }}>
                {listComment.length > 0 &&
                  listComment.map(item => {
                    return <ItemComment key={item?._id} item={item} />
                  })}
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid container item md={3} xs={12} mt={{ md: 0, xs: 5 }}>
          <Grid
            item
            sx={{
              height: '100%',
              width: '100%',
              background: theme.palette.background.paper,
              borderRadius: '15px',
              px: 4,
              py: 5
            }}
            md={12}
            marginLeft={{ md: 5, xs: 0 }}
          >
            <Box>
              <Box
                sx={{
                  backgroundColor: theme.palette.customColors.bodyBg,
                  padding: 2,
                  borderRadius: '10px'
                }}
              >
                {t('Product_same')}
              </Box>

              {dataProductRelated.length > 0
                ? dataProductRelated.map((item: TProduct, index) => {
                    return <CardProductRelated item={item} key={item?._id} />
                  })
                : Array.from({ length: 3 }).map((_, index) => {
                    return <CardSkeletonRelated key={index} />
                  })}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default ProductDetail
