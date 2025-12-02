import { mount } from '@vue/test-utils'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import FullscreenWrapper from '../../components/FullscreenWrapper.vue'

describe('FullscreenWrapper.vue', () => {
  let requestFullscreenMock: any
  let exitFullscreenMock: any
  let fullscreenElementGetter: any

  beforeEach(() => {
    // Crear métodos en JSDOM si no existen
    if (!Element.prototype.requestFullscreen) {
      Element.prototype.requestFullscreen = vi.fn()
    }
    if (!document.exitFullscreen) {
      document.exitFullscreen = vi.fn()
    }

    // Crear property fullscreenElement si no existe
    if (!('fullscreenElement' in document)) {
      Object.defineProperty(document, 'fullscreenElement', {
        configurable: true,
        get: () => null
      })
    }

    requestFullscreenMock = vi.spyOn(Element.prototype, 'requestFullscreen').mockImplementation(async () => {})
    exitFullscreenMock = vi.spyOn(document, 'exitFullscreen').mockImplementation(async () => {})
    fullscreenElementGetter = vi.spyOn(document, 'fullscreenElement', 'get')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('entra en pantalla completa al hacer clic cuando no hay fullscreen', async () => {
    fullscreenElementGetter.mockReturnValue(null)

    const wrapper = mount(FullscreenWrapper)
    const button = wrapper.find('button')

    await button.trigger('click')

    expect(requestFullscreenMock).toHaveBeenCalledTimes(1)
    expect(requestFullscreenMock.mock.instances[0]).toBe(wrapper.vm.wrapperRef)
  })

  test('sale de pantalla completa al hacer clic cuando ya hay fullscreen', async () => {
    const wrapper = mount(FullscreenWrapper)
    fullscreenElementGetter.mockReturnValue(wrapper.vm.wrapperRef)

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(exitFullscreenMock).toHaveBeenCalledTimes(1)
  })

  test('actualiza isFullscreen al cambiar fullscreenElement', async () => {
    const wrapper = mount(FullscreenWrapper)

    // Inicialmente no está en fullscreen
    fullscreenElementGetter.mockReturnValue(null)
    expect(wrapper.vm.isFullscreen).toBe(false)

    // Simular que entra en fullscreen
    fullscreenElementGetter.mockReturnValue(wrapper.vm.wrapperRef)
    document.dispatchEvent(new Event('fullscreenchange'))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isFullscreen).toBe(true)

    // Simular salir de fullscreen
    fullscreenElementGetter.mockReturnValue(null)
    document.dispatchEvent(new Event('fullscreenchange'))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isFullscreen).toBe(false)
  })
})
