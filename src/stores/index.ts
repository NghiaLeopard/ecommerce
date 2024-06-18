// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import users from 'src/stores/user'
import auth from 'src/stores/auth'
import role from 'src/stores/roles'
import city from 'src/stores/city'
import deliveryType from 'src/stores/delivery-type'
import paymentType from 'src/stores/payment-type'
import productTypes from 'src/stores/product-types'
import products from 'src/stores/products'
import orderProduct from 'src/stores/order-product'
import reviews from 'src/stores/reviews'
import comments from 'src/stores/comment'

export const store = configureStore({
  reducer: {
    users,
    auth,
    role,
    city,
    deliveryType,
    paymentType,
    productTypes,
    products,
    reviews,
    comments,
    orderProduct
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
