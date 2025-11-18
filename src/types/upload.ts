import type { UploadStatusEnum } from "../enums/upload-status-enum"

export type UploadTp = {
  name: string
  file: File
  status: UploadStatusEnum
  originalSizeInBytes: number
  uploadSizeInBytes: number

  ctrl: AbortController
}
