import { UploadCloud } from "lucide-react"

function UploadWidgetTitle() {
  return (
    <div className="flex items-center gap-1.5 text-sm font-medium">
      <UploadCloud className="size-4 text-zinc-400" strokeWidth={1.5} />
      <span className="text-sm font-medium">Upload Files</span>
    </div>
  )
}

export default UploadWidgetTitle
