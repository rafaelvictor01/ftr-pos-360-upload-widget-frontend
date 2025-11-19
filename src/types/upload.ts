import type { UploadStatusEnum } from "../enums/upload-status-enum"

export type UploadTp = {
  name: string
  file: File
  status: UploadStatusEnum

  originalSizeInBytes: number
  compressedSizeInBytes?: number
  uploadSizeInBytes: number

  remoteUrl?: string

  ctrl: AbortController
}
