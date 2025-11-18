import type { AxiosError } from 'axios'
import { enableMapSet } from 'immer'
import { create } from "zustand"
import { immer } from 'zustand/middleware/immer'
import { uploadFileController } from '../controllers/upload-file-controller'
import { UploadStatusEnumValues } from '../enums/upload-status-enum'
import type { UploadTp } from "../types/upload"

type TUploadsState = {
  uploads: Map<string, UploadTp>

  addUploads: (files: File[]) => void
  cancelUpload: (uploadId: string) => void
}

enableMapSet()

export const useUploads = create<TUploadsState, [['zustand/immer', never]]>(
  immer((set, get) => {
    async function processUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId)

      if (!upload) return

      try {
        await uploadFileController({
          file: upload.file,
          signal: upload.ctrl.signal,
          onProgress: (sizeInBytes) => {
            set((oldState) => {
              oldState.uploads.set(uploadId, {
                ...upload,
                uploadSizeInBytes: sizeInBytes
              })
            })
          }
        })

        set((oldState) => {
          oldState.uploads.set(uploadId, {
            ...upload,
            status: UploadStatusEnumValues.SUCCESS
          })
        })
      } catch (err) {
        const axiosError = err as AxiosError

        if (
          axiosError.code !== 'ERR_ABORTED' &&
          axiosError.code !== 'ERR_CANCELED'
        ) {
          console.error([
            'Unexpected Error:',
            `Code: ${axiosError.response?.status}`,
            `Route: ${axiosError.request?.responseURL}`,
            `Message: ${axiosError.message}`
          ])

          set((oldState) => {
            oldState.uploads.set(uploadId, {
              ...upload,
              status: UploadStatusEnumValues.ERROR
            })
          })

          throw err
        }
      }
    }

    function cancelUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId)

      if (!upload) return

      upload.ctrl.abort()

      set((oldState) => {
        oldState.uploads.set(uploadId, {
          ...upload,
          status: UploadStatusEnumValues.CANCELED
        })
      })
    }

    function addUploads(files: File[]) {
      files.forEach((currFile) => {
        const uploadId = crypto.randomUUID()
        const ctrl = new AbortController()

        const upload: UploadTp = {
          name: currFile.name,
          file: currFile,
          ctrl,
          status: UploadStatusEnumValues.PROGRESS,
          uploadSizeInBytes: 0,
          originalSizeInBytes: currFile.size
        }

        set((oldState) => { oldState.uploads.set(uploadId, upload) })

        processUpload(uploadId)
      })
    }

    return {
      uploads: new Map(),
      addUploads,
      cancelUpload
    }
  })
)
