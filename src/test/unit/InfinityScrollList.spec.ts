import { mount } from '@vue/test-utils'
import InfiniteScrollList from '../../components/InfinityScrollList.vue'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import flushPromises from 'flush-promises'

// ---------- MOCKS ----------

// Mock del composable useScrollDetector para capturar la callback
// y ejecutarla manualmente en el test
let capturedScrollCallback: (() => void) | null = null
vi.mock('@/composables/useScrollDetector', () => {
  return {
    useScrollDetector: (_el: any, callback: () => void) => {
      capturedScrollCallback = callback
    }
  }
})

// Mock del history.replaceState
const replaceStateMock = vi.spyOn(history, 'replaceState')

// Mock de fetch
const fetchMock = vi.spyOn(globalThis, 'fetch')


beforeEach(() => {
  vi.clearAllMocks()

fetchMock.mockImplementation((url: any) => {
    if (url.includes('offset=0')) {
      // Página 1
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              { name: 'bulbasaur' },
              { name: 'ivysaur' }
            ]
          })
      }) as any
    }

    if (url.includes('offset=20')) {
      // Página 2
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              { name: 'venusaur' },
              { name: 'charmander' }
            ]
          })
      }) as any
    }

    return Promise.reject(new Error('URL inesperada: ' + url))
  })
})


// ---------- TEST PRINCIPAL ----------

describe('InfiniteScrollList.vue — Infinite Scroll Test', () => {
  test('flujo completo: carga inicial, scroll → siguiente página, actualización de URL', async () => {
    // 1. Montar el componente
    const wrapper = mount(InfiniteScrollList)

    // fetch debe llamarse una sola vez para la primera página
    expect(fetchMock).toHaveBeenCalledTimes(1)

    // Esperar a que se renderice
    await flushPromises()


    // Comprobar que aparecen los pokemons de la página 1
    expect(wrapper.text()).toContain('bulbasaur')
    expect(wrapper.text()).toContain('ivysaur')

    // Asegurar que capturamos la callback del scroll
    expect(capturedScrollCallback).not.toBeNull()

    // 2. Simular scroll ejecutando directamente el callback
    await capturedScrollCallback!()

    // 3. Ahora fetch debe haberse llamado una segunda vez (página 2)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    // Esperar render
    await flushPromises()


    // 4. Verificar que history.replaceState fue llamado correctamente
    expect(replaceStateMock).toHaveBeenCalledWith(
      { page: 2 },
      '',
      '?page=2'
    )

    // 5. La lista debe contener PÁGINAS 1 + 2
    const text = wrapper.text()

    // Página 1
    expect(text).toContain('bulbasaur')
    expect(text).toContain('ivysaur')

    // Página 2
    expect(text).toContain('venusaur')
    expect(text).toContain('charmander')
  })
})
