import * as Collapsible from "@radix-ui/react-collapsible"
import { useState } from "react"
import UploadWidgetDropzone from "./dropzone"
import UploadWidgetHeader from "./header"
import UploadWidgetList from "./list"
import UploadWidgetMinimizedButton from "./minimized-btn"

function UploadWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible.Root onOpenChange={setIsOpen}>
      <div className="bg-zinc-900 w-[360px] overflow-hidden rounded-xl shadow-shape">
        {!isOpen && <UploadWidgetMinimizedButton />}

        <Collapsible.Content>
          <UploadWidgetHeader />

          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropzone />

            <div className="h-px bg-zinc-800 border-t border-black/50 box-content" />

            <UploadWidgetList />
          </div>

        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  )
}

export default UploadWidget
