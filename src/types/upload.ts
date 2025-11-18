import type { UploadStatusEnum } from "../enums/upload-status-enum"

export type UploadTp = {
  name: string
  file: File
  status: UploadStatusEnum
  ctrl: AbortController
}
