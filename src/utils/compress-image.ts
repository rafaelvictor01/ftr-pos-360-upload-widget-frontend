interface ICompressImageProps {
  file: File
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

export function compressImage(props: ICompressImageProps) {
  const maxWidth = props.maxWidth || Number.POSITIVE_INFINITY
  const maxHeight = props.maxHeight || Number.POSITIVE_INFINITY
  const quality = props.quality || 1

  const allowedFileTypes = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/webp',
  ]

  if (!allowedFileTypes.includes(props.file.type))
    throw new Error('Image format not supported')

  return new Promise<File>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const compressedImg = new Image()

      compressedImg.onload = () => {
        const canvas = document.createElement('canvas')

        let width = compressedImg.width
        let height = compressedImg.height

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const context = canvas.getContext('2d')

        if (!context) {
          reject(new Error('Failed to get canvas context.'))
          return
        }

        context.drawImage(compressedImg, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image.'))
              return
            }

            const compressedFile = new File(
              [blob],
              convertToWebp(props.file.name),
              {
                type: 'image/webp',
                lastModified: Date.now()
              }
            )

            resolve(compressedFile)
          },
          'image/webp',
          quality
        )
      }

      compressedImg.src = event.target?.result as string
    }

    reader.readAsDataURL(props.file)
  })
}

function convertToWebp(filename: string) {
  const lastDotIndex = filename.lastIndexOf(".")

  if (lastDotIndex === -1)
    return `${filename}.webp`

  return `${filename.substring(0, lastDotIndex)}.webp`
}
