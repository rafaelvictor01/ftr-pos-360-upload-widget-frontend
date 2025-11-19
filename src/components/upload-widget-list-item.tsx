import * as Progress from '@radix-ui/react-progress'
import { Download, ImageUp, Link2, RefreshCcw, X } from "lucide-react"
import { motion } from 'motion/react'
import { type UploadStatusEnum, UploadStatusEnumValues } from '../enums/upload-status-enum'
import { useUploads } from '../stores/uploads'
import type { UploadTp } from '../types/upload'
import { downloadUrl } from '../utils/download-url'
import { formatBytes } from '../utils/format-bytes'
import { Button } from './button'

interface IProps {
  uploadId: string
  upload: UploadTp
}

export function UploadWidgetListItem(props: IProps) {
  const cancelUpload = useUploads((store) => store.cancelUpload)
  const retryUpload = useUploads((store) => store.retryUpload)

  const progress = Math.min(
    props.upload.compressedSizeInBytes
      ? Math.round((props.upload.uploadSizeInBytes * 100) / props.upload.compressedSizeInBytes)
      : 0,
    100
  )

  return (
    <motion.div
      className="p-3 rounded-lg flex flex-col gap-3 shadow-shape-content bg-white/2 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium flex items-center gap-1">
          <ImageUp className="size-3 text-zinc-300" strokeWidth={1.5} />
          <span className='max-w-[180px] truncate'>{props.upload.name}</span>
        </span>

        <span className="text-[0.625rem] text-zinc-400 flex gap-1.5 items-center">
          <span className="line-through">{formatBytes(props.upload.originalSizeInBytes)}</span>

          <span className="size-1 rounded-full bg-zinc-700" />

          <span>
            {formatBytes(props.upload.compressedSizeInBytes ?? 0)}

            {props.upload.compressedSizeInBytes && (
              <span className="text-green-400 ml-1">
                -{Math.round((props.upload.originalSizeInBytes - props.upload.compressedSizeInBytes) * 100 / props.upload.originalSizeInBytes)}%
              </span>
            )}
          </span>

          <span className="size-1 rounded-full bg-zinc-700" />

          {props.upload.status === UploadStatusEnumValues.PROGRESS && (
            <span className='text-indigo-400'>{progress}%</span>
          )}

          {props.upload.status === UploadStatusEnumValues.SUCCESS && (
            <span className='text-green-400'>100%</span>
          )}

          {props.upload.status === UploadStatusEnumValues.ERROR && (
            <span className='text-red-400'>Error</span>
          )}

          {props.upload.status === UploadStatusEnumValues.CANCELED && (
            <span className='text-amber-400'>Canceled</span>
          )}
        </span>
      </div>

      <Progress.Root className='bg-zinc-800 rounded-full h-1 overflow-hidden'>
        <Progress.Indicator
          data-status={props.upload.status}
          className="
            h-1
            transition-all
            data-[status=PROGRESS]:bg-indigo-500
            data-[status=CANCELED]:bg-amber-400
            data-[status=ERROR]:bg-red-400
            data-[status=SUCCESS]:bg-green-400
          "
          style={{
            width: props.upload.status === UploadStatusEnumValues.PROGRESS ? `${progress}%` : '100%',
          }}
        />
      </Progress.Root>

      <div className="absolute top-2 right-2 flex items-center gap-1">
        <Button
          size="icon-sm"
          onClick={() => downloadUrl(props.upload.remoteUrl || '')}
          aria-disabled={(props.upload.status !== UploadStatusEnumValues.SUCCESS) || !props.upload.remoteUrl}
        >
          <Download className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Download compressed image</span>
        </Button>

        <Button
          size="icon-sm"
          disabled={(props.upload.status !== UploadStatusEnumValues.SUCCESS) || !props.upload.remoteUrl}
          onClick={() => props.upload.remoteUrl && navigator.clipboard.writeText(props.upload.remoteUrl)}
        >
          <Link2 className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Copy remote URL</span>
        </Button>

        <Button
          size="icon-sm"
          onClick={() => retryUpload(props.uploadId)}
          disabled={!([UploadStatusEnumValues.CANCELED, UploadStatusEnumValues.ERROR] as UploadStatusEnum[]).includes(props.upload.status)}
        >
          <RefreshCcw className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Retry upload</span>
        </Button>

        <Button
          size="icon-sm"
          onClick={() => cancelUpload(props.uploadId)}
          disabled={props.upload.status !== UploadStatusEnumValues.PROGRESS}
        >
          <X className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Cancel upload</span>
        </Button>
      </div>
    </motion.div>
  )
}
