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
