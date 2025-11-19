export async function downloadUrl(pathname: string) {
  const blob = new Blob([pathname], {
    type: 'application/octet-stream' // Content-Type fixo para .xlsx
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  const segments = pathname
      .split("/")
      .filter((segment) => segment.length > 0)

  const fileName = segments.length > 0 ? segments[segments.length - 1] : null

  if (!fileName)
    throw new Error("URL does not contain a valid filename")

  link.href = url
  link.download = fileName

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
