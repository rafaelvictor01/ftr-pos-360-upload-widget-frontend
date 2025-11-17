import UploadWidgetDropzone from "./dropzone"
import UploadWidgetHeader from "./header"
import UploadWidgetList from "./list"

function UploadWidget() {
  return (
    <div className="bg-zinc-900 max-w-[360px] overflow-hidden w-full rounded-xl shadow-shape">
      <UploadWidgetHeader />

      <div className="flex flex-col gap-4 py-3">
        <UploadWidgetDropzone />

        <div className="h-px bg-zinc-800 border-t border-black/50 box-content" />

        <UploadWidgetList />
      </div>

    </div>
  )
}

export default UploadWidget
