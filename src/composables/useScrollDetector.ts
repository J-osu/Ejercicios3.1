import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useScrollDetector(
  contenedorDesplazamiento: Ref<HTMLElement | null>,
  callback: () => void,
  margen: number = 100
) {
  const manejarDesplazamiento = () => {
    const el = contenedorDesplazamiento.value
    if (!el) return

    const cercaDelFondo =
      el.scrollHeight - el.scrollTop <= el.clientHeight + margen

    if (cercaDelFondo) {
      callback()
    }
  }

  onMounted(() => {
    const el = contenedorDesplazamiento.value
    if (!el) return
    el.addEventListener('scroll', manejarDesplazamiento)
  })

  onUnmounted(() => {
    const el = contenedorDesplazamiento.value
    if (!el) return
    el.removeEventListener('scroll', manejarDesplazamiento)
  })
}