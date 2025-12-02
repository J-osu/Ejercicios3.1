import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useClickOutside(
  element: Ref<HTMLElement | null>,
  callback: (event: MouseEvent) => void
) {
  const handleClick = (event: MouseEvent) => {
    const el = element.value
    if (!el) return

    // Si el clic NO está dentro del elemento, llamamos al callback
    if (!el.contains(event.target as Node)) {
      callback(event)
    }
  }

  onMounted(() => {
    document.addEventListener('mousedown', handleClick)
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClick)
  })
}
