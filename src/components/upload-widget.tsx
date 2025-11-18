import * as Collapsible from "@radix-ui/react-collapsible"
import { motion, useCycle } from 'motion/react'
import { usePendingUploads } from "../stores/uploads"
import { UploadWidgetDropzone } from "./upload-widget-dropzone"
import { UploadWidgetHeader } from "./upload-widget-header"
import { UploadWidgetList } from "./upload-widget-list"
import { UploadWidgetMinimizedButton } from "./upload-widget-minimized-btn"

export function UploadWidget() {
  const { isThereAnyPendingUploads } = usePendingUploads()

  const [isOpen, toggleOpen] = useCycle(false, true)

  return (
    <Collapsible.Root onOpenChange={() => toggleOpen()}>
      <motion.div
        data-progress={isThereAnyPendingUploads}
        className="bg-zinc-900 max-w-[360px] overflow-hidden rounded-xl shadow-shape"
        animate={isOpen ? 'open' : 'closed'}
        variants={{
          closed: {
            width: 'max-content',
            height: 44,
            transition: {
              type: 'inertia'
            }
          },
          open: {
            width: 360,
            height: 'auto',
            transition: {
              duration: 0.1
            }
          }
        }}
      >
        {!isOpen && <UploadWidgetMinimizedButton />}

        <Collapsible.Content>
          <UploadWidgetHeader />

          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropzone />

            <div className="h-px bg-zinc-800 border-t border-black/50 box-content" />

            <UploadWidgetList />
          </div>

        </Collapsible.Content>
      </motion.div>
    </Collapsible.Root>
  )
}

