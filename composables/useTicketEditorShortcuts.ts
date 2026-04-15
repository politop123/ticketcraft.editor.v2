import { onBeforeUnmount, onMounted } from 'vue'
import { useTicketEditorStore } from '~/stores/ticketEditor'

export const useTicketEditorShortcuts = () => {
  const store = useTicketEditorStore()

  const isEditableTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) {
      return false
    }
    return ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (isEditableTarget(event.target)) {
      return
    }

    const modifier = event.metaKey || event.ctrlKey

    if (modifier && event.key.toLowerCase() === 'c') {
      event.preventDefault()
      store.copySelected()
      return
    }

    if (modifier && event.key.toLowerCase() === 'v') {
      event.preventDefault()
      store.pasteClipboard()
      return
    }

    if (modifier && event.key.toLowerCase() === 'd') {
      event.preventDefault()
      store.duplicateSelected()
      return
    }

    if (modifier && event.key.toLowerCase() === 'a') {
      event.preventDefault()
      store.selectAll()
      return
    }

    if (modifier && event.key.toLowerCase() === 'z' && !event.shiftKey) {
      event.preventDefault()
      store.undo()
      return
    }

    if (
      (modifier && event.key.toLowerCase() === 'y') ||
      (modifier && event.shiftKey && event.key.toLowerCase() === 'z')
    ) {
      event.preventDefault()
      store.redo()
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      store.clearSelection()
      return
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault()
      store.removeSelected()
      return
    }

    const movementStep = event.shiftKey ? 10 : 1
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        store.moveSelected(0, -movementStep)
        break
      case 'ArrowDown':
        event.preventDefault()
        store.moveSelected(0, movementStep)
        break
      case 'ArrowLeft':
        event.preventDefault()
        store.moveSelected(-movementStep, 0)
        break
      case 'ArrowRight':
        event.preventDefault()
        store.moveSelected(movementStep, 0)
        break
      default:
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeyDown)
  })
}
