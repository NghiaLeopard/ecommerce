import React, { ReactNode } from 'react'
import { useDropzone } from 'react-dropzone'

interface Tprops {
  children: ReactNode
  uploadFunc: (file: File) => void
  objectAcceptFile?: Record<string, string[]>
}

function WrapperFileUpload({ children, uploadFunc, objectAcceptFile }: Tprops) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: objectAcceptFile ? objectAcceptFile : {},
    onDrop: acceptFiles => {
      uploadFunc(acceptFiles[0])
    }
  })

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      {children}
    </div>
  )
}

export default WrapperFileUpload
