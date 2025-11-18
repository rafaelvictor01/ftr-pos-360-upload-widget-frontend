import type { IRequestOpts } from "./IRequestOpts"

export interface IUploadFileRequestDTO extends IRequestOpts {
  file: File
  onProgress: (sizeInBytes: number) => void
}
