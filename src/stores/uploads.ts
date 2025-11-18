import { type AxiosError, CanceledError } from 'axios'
import { enableMapSet } from 'immer'
import { create } from "zustand"
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/shallow'
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
    function updateUpload(uploadId: string, data: Partial<UploadTp>) {
      const upload = get().uploads.get(uploadId);

      if (!upload) {
        return
      }

      set((state) => {
        state.uploads.set(uploadId, {
          ...upload,
          ...data,
        })
      })
    }

    async function processUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId)

      if (!upload) return

      try {
        await uploadFileController({
          file: upload.file,
          signal: upload.ctrl.signal,
          onProgress: (sizeInBytes) => {
            updateUpload(uploadId, { uploadSizeInBytes: sizeInBytes })
          }
        })

        updateUpload(uploadId, { status: UploadStatusEnumValues.SUCCESS })
      } catch (err) {
        if (!(err instanceof CanceledError)) {
          const axiosError = err as AxiosError

          console.error([
            'Unexpected Error:',
            `Code: ${axiosError.response?.status}`,
            `Route: ${axiosError.request?.responseURL}`,
            `Message: ${axiosError.message}`
          ])

          updateUpload(uploadId, { status: UploadStatusEnumValues.ERROR })

          throw err
        }
      }
    }

    function cancelUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId)

      if (!upload) return

      upload.ctrl.abort()

      updateUpload(uploadId, {
        status: UploadStatusEnumValues.CANCELED,
        uploadSizeInBytes: upload.originalSizeInBytes
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

export const usePendingUploads = () => {
  return useUploads(
    useShallow((store) => {
      const isThereAnyPendingUploads = Array.from(store.uploads.values()).some(
        (upload) => upload.status === UploadStatusEnumValues.PROGRESS
      )

      if (!isThereAnyPendingUploads) {
        return { isThereAnyPendingUploads, globalPercentage: 100 }
      }

      const { total, uploaded } = Array.from(store.uploads.values()).reduce(
        (acc, upload) => {
          acc.total += upload.originalSizeInBytes
          acc.uploaded += upload.uploadSizeInBytes

          return acc
        },
        { total: 0, uploaded: 0 }
      )

      const globalPercentage = Math.min(
        Math.round((uploaded * 100) / total),
        100
      )

      return { isThereAnyPendingUploads, globalPercentage }
    })
  )
}
