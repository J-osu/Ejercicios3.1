import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useScrollDetector(
  scrollContainer: Ref<HTMLElement | null>,
  callback: () => void,
  buffer: number = 100
) {
  const handleScroll = () => {
    const el = scrollContainer.value
    if (!el) return

    const nearBottom =
      el.scrollHeight - el.scrollTop <= el.clientHeight + buffer

    if (nearBottom) {
      callback()
    }
  }

  onMounted(() => {
    const el = scrollContainer.value
    if (!el) return
    el.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    const el = scrollContainer.value
    if (!el) return
    el.removeEventListener('scroll', handleScroll)
  })
}
