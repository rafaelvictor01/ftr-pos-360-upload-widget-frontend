import UploadWidgetListItem from "./upload-widget-list-item";

function UploadWidgetList() {
  const isUploadListEmpty = false;

  return (
    <div className="px-3 flex flex-col gap-3">
      <span className="text-xs font-medium">
        Uploaded files{' '}
        <span className="text-zinc-400">(2)</span>
      </span>

      {isUploadListEmpty ? (
        <span className="text-xs text-zinc-400">No uploads added</span>
      ) : (
        <div className="flex flex-col gap-2">
          <UploadWidgetListItem />
          <UploadWidgetListItem />
        </div>
      )}
    </div>
  )
}

export default UploadWidgetList