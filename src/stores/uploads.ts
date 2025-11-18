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
          signal: upload.ctrl.signal
        })

        set((oldState) => {
          oldState.uploads.set(uploadId, {
            ...upload,
            status: UploadStatusEnumValues.SUCCESS
          })
        })
      } catch {
        set((oldState) => {
          oldState.uploads.set(uploadId, {
            ...upload,
            status: UploadStatusEnumValues.ERROR
          })
        })
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
          status: UploadStatusEnumValues.PROGRESS
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
