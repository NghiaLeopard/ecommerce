import { object } from 'yup'

export const toFullName = (lastName: string, middleName: string, firstName: string, language: string) => {
  if (language === 'vi') {
    return `${lastName ? lastName : ''} ${middleName ? middleName : ''} ${firstName ? firstName : ''}`
  }

  return `${firstName ? firstName : ''} ${middleName ? middleName : ''} ${lastName ? lastName : ''}`
}

export const convertBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })

export const separationFullName = (fullName: string, language: string) => {
  const result = {
    firstName: '',
    lastName: '',
    middleName: ''
  }

  const arrName = fullName.trim().split(' ').filter(Boolean)
  if (arrName.length) {
    if (arrName.length === 1) {
      result.firstName = arrName[0]
    }
    if (arrName.length === 2) {
      if (language === 'vi') {
        result.lastName = arrName[0]
        result.firstName = arrName[1]
      } else {
        result.lastName = arrName[1]
        result.firstName = arrName[0]
      }
    }
    if (arrName.length >= 3) {
      if (language === 'vi') {
        result.lastName = arrName[0]
        result.middleName = arrName.slice(1, arrName.length - 1).join(' ')
        result.firstName = arrName[arrName.length - 1]
      }
    }
  }

  return result
}

export const getValuePermissions = (obj: any, exclude: string[]) => {
  try {
    const valueArray: string[] = []
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        valueArray.push(...getValuePermissions(obj[key], exclude))
      } else {
        if (!exclude.includes(obj[key])) {
          valueArray.push(obj[key])
        }
      }
    }

    return valueArray
  } catch (error) {
    return []
  }
}

export const formatDate = (
  value: Date | string,
  formatting: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric', year: 'numeric' }
) => {
  if (!value) return value

  return Intl.DateTimeFormat('vi-VN', formatting).format(new Date(value))
}

export const stringToSlug = (str: string) => {
  // remove accents
  const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ'
  const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy'

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], 'gi'), to[i])
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')

  return str
}

import { EditorState, ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import { TOrderProduct } from 'src/types/order-product'
import { TComment } from 'src/types/comments'

export const convertHtmlToDraft = (html: string) => {
  const blocksFromHtml = htmlToDraft(html)
  const { contentBlocks, entityMap } = blocksFromHtml
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
  const editorState = EditorState.createWithContent(contentState)

  return editorState
}

export const formatPriceToLocal = (price: number) => {
  try {
    return Number(price).toLocaleString('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  } catch (error) {
    return price
  }
}

export const cloneDeep = (item: TOrderProduct[]) => {
  return JSON.parse(JSON.stringify(item))
}

export const executeUpdateCard = (orderItem: TOrderProduct[], addItem: TOrderProduct) => {
  try {
    let cloneArr = cloneDeep(orderItem)

    const findItem = cloneArr.find((item: TOrderProduct) => item.product === addItem.product)
    if (findItem) {
      findItem.amount += addItem.amount
    } else {
      cloneArr.push(addItem)
    }

    cloneArr = cloneArr.filter((item: TOrderProduct) => item.amount >= 1)

    return cloneArr
  } catch (error) {
    return orderItem
  }
}

export const isExpiry = (startDiscount: Date | null, endDiscount: Date | null) => {
  const currentDay = new Date().getTime()
  if (startDiscount && endDiscount) {
    const startDate = new Date(startDiscount).getTime()
    const endDate = new Date(endDiscount).getTime()

    return startDate <= currentDay && endDate > currentDay
  }

  return false
}

export const editDeleteSocketComment = (listComment: TComment[], comment: TComment, type: string) => {
  let cloneListComment = cloneDeep(listComment as any)

  cloneListComment.forEach((element: TComment) => {
    if (comment.parent === element?._id && element?.replies?.length > 0) {
      const result = editDeleteSocketComment(element.replies, comment, type)
      if(type === 'delete') {
        element.replies = result
      }

    } else {
      if (type === 'update') {
        const findItemReplies = listComment.find((itemReplies: TComment) => itemReplies._id === comment._id)
        if (findItemReplies) {
          findItemReplies.content = comment.content
        }
      } else if (type === 'delete') {
        console.log(cloneListComment, comment)
        cloneListComment = cloneListComment.filter((itemReplies: TComment) => {
          return itemReplies._id !== comment._id
        })

        return cloneListComment
      }
    }
  })

  return [...cloneListComment]
}
