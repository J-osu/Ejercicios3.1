import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import { describe, expect, test, vi } from 'vitest';
import WindowSizeDisplay from '../../components/WindowSizeDisplay.vue';

const mockWidth = ref(1024);
const mockHeight = ref(768);

vi.mock('../../composables/useWindowSize', () => ({
  useWindowSize: () => ({
    width: mockWidth,
    height: mockHeight,
  }),
}));

describe('WindowSizeDisplay.vue', () => {
  test('El componente debe renderizar las dimensiones simuladas correctamente', async () => {
    const wrapper = mount(WindowSizeDisplay);
    
    await wrapper.vm.$nextTick();

    const displayElement = wrapper.find('p.lead').text();
    expect(displayElement).toContain('Ancho: 1024 px - Alto: 768 px');
  });
  
  test('El componente debe actualizarse reactivamente cuando cambian los valores', async () => {
    mockWidth.value = 100;
    mockHeight.value = 100;

    const wrapper = mount(WindowSizeDisplay);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('p.lead').text()).toContain('Ancho: 100 px - Alto: 100 px');

    mockWidth.value = 1920;
    mockHeight.value = 1080;
    
    await wrapper.vm.$nextTick();

    expect(wrapper.find('p.lead').text()).toContain('Ancho: 1920 px - Alto: 1080 px');
  });
});