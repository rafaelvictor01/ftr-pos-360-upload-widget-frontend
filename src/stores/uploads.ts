import { enableMapSet } from 'immer'
import { create } from "zustand"
import { immer } from 'zustand/middleware/immer'
import type { UploadTp } from "../types/upload"


type TUploadsState = {
  uploads: Map<string, UploadTp>

  addUploads: (files: File[]) => void
}

enableMapSet()

export const useUploads = create<TUploadsState, [['zustand/immer', never]]>(
  immer((set) => {
    function addUploads(files: File[]) {
      files.forEach((currFile) => {
        const uploadId = crypto.randomUUID()
        const upload: UploadTp = { name: currFile.name, file: currFile }
        set((oldState) => { oldState.uploads.set(uploadId, upload) })
      })
    }

    return {
      uploads: new Map(),
      addUploads
    }
  })
)