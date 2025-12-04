import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useClickOutside(
  elemento: Ref<HTMLElement | null>,
  callback: (evento: MouseEvent) => void
) {
  const manejarClic = (evento: MouseEvent) => {
    const el = elemento.value
    if (!el) return

    if (!el.contains(evento.target as Node)) {
      callback(evento)
    }
  }

  onMounted(() => {
    document.addEventListener('mousedown', manejarClic)
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', manejarClic)
  })
}