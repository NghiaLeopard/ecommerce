// Helper
import instanceAxios from 'src/helpers/axios'

// ** Configs
import { API_ENDPOINT } from 'src/configs/api'
import {
  TParamsDeleteManyComments,
  TParamsEditComments,
  TParamsEditCommentsMe,
  TParamsGetComments,
  TParamsGetCommentsPublic
} from 'src/types/comments'

// ** Type

export const getAllComments = async (data: { params: TParamsGetComments }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENTS.INDEX}`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const getAllCommentsPublic = async (data: { params: TParamsGetCommentsPublic }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENTS.INDEX}/public`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const getDetailComments = async (idComments: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENTS.INDEX}/${idComments}`)

    return res.data
  } catch (error) {
    return error
  }
}

// export const createComments = async (data: TCreateCommentsProduct) => {
//   try {
//     const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENTS.INDEX}`, data)

//     return res.data
//   } catch (error: any) {
//     return error
//   }
// }

export const editComments = async (data: TParamsEditComments) => {
  const { commentId, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENTS.INDEX}/${data.commentId}`, rests)

    return res.data
  } catch (error) {
    return error
  }
}

export const deleteComments = async (idComments: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENTS.INDEX}/${idComments}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const deleteMultipleComments = async (data: TParamsDeleteManyComments) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENTS.INDEX}/delete-many`, { data })

    return res.data
  } catch (error) {
    return error
  }
}

// export const editCommentsMe = async (data: TParamsEditCommentsMe) => {
//   const { reviewId, ...rests } = data
//   try {
//     const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENTS.INDEX}/me/${data.reviewId}`, rests)

//     return res.data
//   } catch (error) {
//     return error
//   }
// }

// export const deleteCommentsMe = async (idComments: string) => {
//   try {
//     const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENTS.INDEX}/me/${idComments}`)

//     return res.data
//   } catch (error) {
//     return error
//   }
// }