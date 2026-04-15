import { onBeforeUnmount, onMounted } from 'vue'
import { useTicketEditorStore } from '~/stores/ticketEditor'

export const useUnsavedChangesGuard = () => {
  const store = useTicketEditorStore()

  const beforeUnload = (event: BeforeUnloadEvent) => {
    if (!store.hasUnsavedChanges.value) {
      return
    }

    event.preventDefault()
    event.returnValue = ''
  }

  onMounted(() => {
    window.addEventListener('beforeunload', beforeUnload)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', beforeUnload)
  })
}
