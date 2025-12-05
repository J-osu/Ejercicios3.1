import { mount } from '@vue/test-utils';
import ScrollToTopButton from '../../components/ScrollToTopButton.vue';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const createWrapper = () => {
    return mount(ScrollToTopButton, {
        global: {
            stubs: {
                'i': true 
            }
        }
    });
};

describe('ScrollToTopButton.vue', () => {
  const originalScrollY = window.scrollY;
  
  const scrollToSpy = vi.spyOn(window, 'scrollTo');

  const triggerScroll = (scrollYPos: number) => {
    Object.defineProperty(window, 'scrollY', { value: scrollYPos, writable: true });
    window.dispatchEvent(new Event('scroll'));
  };

  beforeEach(() => {
    scrollToSpy.mockClear();
    Object.defineProperty(window, 'scrollY', { value: originalScrollY, writable: true });
  });

  test('Debe ser invisible si el scroll es menor al umbral (200px)', async () => {
    triggerScroll(150); 

    const wrapper = createWrapper();
    await wrapper.vm.$nextTick(); 

    expect(wrapper.find('button[title="Volver Arriba"]').exists()).toBe(false);
  });

  test('Debe ser visible si el scroll supera el umbral (200px)', async () => {
    triggerScroll(250); 

    const wrapper = createWrapper();
    await wrapper.vm.$nextTick(); 

    expect(wrapper.find('button[title="Volver Arriba"]').exists()).toBe(true);
  });

  test('El clic debe llamar a window.scrollTo con la configuración correcta', async () => {
    triggerScroll(500); 

    const wrapper = createWrapper();
    await wrapper.vm.$nextTick(); 
    
    const button = wrapper.find('button[title="Volver Arriba"]');
    await button.trigger('click');

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
  });
});