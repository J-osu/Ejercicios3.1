import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'
import DropdownMenu from '../../components/DropDownMenu.vue'

describe('DropdownMenu.vue', () => {
  test('clic fuera cierra el menú', async () => {
    const wrapper = mount(DropdownMenu)

    // Abrir menú
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('[data-testid="menu"]').exists()).toBe(true)

    // Simular clic fuera
    const clickEvent = new MouseEvent('mousedown', { bubbles: true })
    document.body.dispatchEvent(clickEvent)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="menu"]').exists()).toBe(false)
  })

  test('clic dentro no cierra el menú', async () => {
    const wrapper = mount(DropdownMenu)

    // Abrir menú
    await wrapper.find('button').trigger('click')
    const menu = wrapper.find('[data-testid="menu"]')
    expect(menu.exists()).toBe(true)

    // Simular clic dentro del menú (primera opción)
    const firstOption = menu.find('p')
    const clickEvent = new MouseEvent('mousedown', { bubbles: true })
    firstOption.element.dispatchEvent(clickEvent)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="menu"]').exists()).toBe(true)
  })
})
