import UploadWidgetListItem from "./list-tem"

function UploadWidgetList() {
  return (
    <div className="px-3 flex flex-col gap-3">
      <span className="text-xs font-medium">
        Uploaded files{' '}
        <span className="text-zinc-400">(2)</span>
      </span>

      <div className="space-y-2">
        <UploadWidgetListItem />
        <UploadWidgetListItem />
      </div>
    </div>
  )
}

export default UploadWidgetList