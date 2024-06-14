// Helper
import instanceAxios from 'src/helpers/axios'

// ** Configs
import { API_ENDPOINT } from 'src/configs/api'
import {
  TParamsCreateReviews,
  TParamsDeleteManyReviews,
  TParamsEditReviews,
  TParamsGetReviews
} from 'src/types/reviews'

// ** Type

export const getAllReviews = async (data: { params: TParamsGetReviews }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const getDetailReviews = async (idReviews: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/${idReviews}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const editReviews = async (data: TParamsEditReviews) => {
  const { reviewId, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/${data.reviewId}`, rests)

    return res.data
  } catch (error) {
    return error
  }
}

export const createReviews = async (data: TParamsCreateReviews) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}`, data)

    return res.data
  } catch (error: any) {
    return error
  }
}

export const deleteReviews = async (idReviews: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/${idReviews}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const deleteMultipleReviews = async (data: TParamsDeleteManyReviews) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/delete-many`, { data })

    return res.data
  } catch (error) {
    return error
  }
}
