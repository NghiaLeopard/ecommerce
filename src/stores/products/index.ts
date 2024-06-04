// ** Redux
import { createSlice } from '@reduxjs/toolkit'

// ** Action
import {
  createProductsAsync,
  deleteMultipleProductsAsync,
  deleteProductsAsync,
  editProductsAsync,
  getAllProductsAsync,
  getListProductsLikedAsync,
  getListProductsViewedAsync,
  likeProductAsync,
  serviceName,
  unLikeProductAsync
} from './actions'

const initialState = {
  isLoading: false,
  typeError: '',
  isSuccessCreateEdit: false,
  isErrorCreateEdit: false,
  isMessageCreateEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  isMessageDelete: '',
  isSuccessMultipleDelete: false,
  isErrorMultipleDelete: false,
  isMessageMultipleDelete: '',
  isSuccessLikeProduct: false,
  isErrorLikeProduct: false,
  isMessageLikeProduct: '',
  isSuccessUnLikeProduct: false,
  isErrorUnLikeProduct: false,
  isMessageUnLikeProduct: '',
  products: {
    data: [],
    total: 0
  },
  productsViewed: {
    data: [],
    total: 0
  },
  productsLiked: {
    data: [],
    total: 0
  }
}

export const productsSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetInitialState(state) {
      state.isLoading = false
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = false
      state.isMessageCreateEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.isMessageDelete = ''
      state.isSuccessMultipleDelete = false
      state.isErrorMultipleDelete = false
      state.isMessageMultipleDelete = ''
      state.isSuccessLikeProduct = false
      state.isErrorLikeProduct = false
      state.isMessageLikeProduct = ''
      state.isSuccessUnLikeProduct = false
      state.isErrorUnLikeProduct = false
      state.isMessageUnLikeProduct = ''
      state.products = {
        data: [],
        total: 0
      }
    }
  },
  extraReducers: builder => {
    // Get all Products
    builder.addCase(getAllProductsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getAllProductsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.products.data = actions?.payload?.data?.products
        state.products.total = actions?.payload?.data?.totalCount
      })

    // Get all Products Like
    builder.addCase(getListProductsLikedAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getListProductsLikedAsync.fulfilled, (state, actions) => {
        console.log(actions.payload)
        state.isLoading = false
        state.productsLiked.data = actions?.payload?.data?.products
        state.productsLiked.total = actions?.payload?.data?.totalCount
      })

    // Get all Products viewed
    builder.addCase(getListProductsViewedAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(getListProductsViewedAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.productsViewed.data = actions?.payload?.data?.products
        state.productsViewed.total = actions?.payload?.data?.totalCount
      })

    // create Products
    builder.addCase(createProductsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(createProductsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // edit Products
    builder.addCase(editProductsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(editProductsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessCreateEdit = !!actions.payload?.data?._id
        state.isErrorCreateEdit = !actions.payload?.data?._id
        state.isMessageCreateEdit = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete Products
    builder.addCase(deleteProductsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteProductsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessDelete = !!actions.payload?.data?._id
        state.isErrorDelete = !actions.payload?.data?._id
        state.isMessageDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Delete multiple Products
    builder.addCase(deleteMultipleProductsAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(deleteMultipleProductsAsync.fulfilled, (state, actions) => {
        state.isLoading = false
        state.isSuccessMultipleDelete = !actions.payload?.typeError
        state.isErrorMultipleDelete = !!actions.payload?.typeError
        state.isMessageMultipleDelete = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // Like Products
    builder.addCase(likeProductAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(likeProductAsync.fulfilled, (state, actions) => {
        console.log(actions.payload)
        state.isLoading = false
        state.isSuccessLikeProduct = !!actions.payload?.data?._id
        state.isErrorLikeProduct = !actions.payload?.data?._id
        state.isMessageLikeProduct = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })

    // unlike product
    builder.addCase(unLikeProductAsync.pending, (state, actions) => {
      state.isLoading = true
    }),
      builder.addCase(unLikeProductAsync.fulfilled, (state, actions) => {
        console.log(actions.payload)
        state.isLoading = false
        state.isSuccessUnLikeProduct = !!actions.payload?.data?._id
        state.isErrorUnLikeProduct = !actions.payload?.data?._id
        state.isMessageUnLikeProduct = actions.payload?.message
        state.typeError = actions.payload?.typeError
      })
  }
})

const { actions, reducer } = productsSlice

export const { resetInitialState } = actions
export default reducer
