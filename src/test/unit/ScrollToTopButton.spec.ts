import { mount } from '@vue/test-utils';
import ScrollToTopButton from '../../components/ScrollToTopButton.vue';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// Componente Wrapper para simular la altura de scroll
const createWrapper = () => {
    return mount(ScrollToTopButton, {
        // Globales necesarios si estás usando Bootstrap icons
        global: {
            stubs: {
                //'i': true 
            }
        }
    });
};

describe('ScrollToTopButton.vue', () => {
  // 1. Mockear propiedades y métodos del objeto window
  // Usaremos window.scrollY para simular la posición del scroll.
  const originalScrollY = window.scrollY;
  
  // 🔴 Mockeamos la función scrollTo para verificar las llamadas
  const scrollToSpy = vi.spyOn(window, 'scrollTo');

  // Función para simular el evento scroll y la posición
  const triggerScroll = (scrollYPos: number) => {
    // Simular la posición del scroll
    Object.defineProperty(window, 'scrollY', { value: scrollYPos, writable: true });
    // Disparar el evento 'scroll' para que Vue lo detecte
    window.dispatchEvent(new Event('scroll'));
  };

  beforeEach(() => {
    // Limpiar espías antes de cada test
    scrollToSpy.mockClear();
    // Reiniciar la posición de scroll
    Object.defineProperty(window, 'scrollY', { value: originalScrollY, writable: true });
  });

  test('Debe ser invisible si el scroll es menor al umbral (200px)', async () => {
    // 1. Simular un scroll bajo
    triggerScroll(150); 

    const wrapper = createWrapper();
    await wrapper.vm.$nextTick(); 

    // 2. Verificar que el botón NO existe
    // querySelector/queryByRole devuelve null si no encuentra el elemento.
    expect(wrapper.find('button[title="Volver Arriba"]').exists()).toBe(false);
  });

  test('Debe ser visible si el scroll supera el umbral (200px)', async () => {
    // 1. Simular un scroll alto
    triggerScroll(250); 

    const wrapper = createWrapper();
    await wrapper.vm.$nextTick(); 

    // 2. Verificar que el botón SÍ existe
    expect(wrapper.find('button[title="Volver Arriba"]').exists()).toBe(true);
  });

  test('El clic debe llamar a window.scrollTo con la configuración correcta', async () => {
    // 1. Simular scroll alto para asegurar la visibilidad del botón
    triggerScroll(500); 

    const wrapper = createWrapper();
    await wrapper.vm.$nextTick(); 
    
    // 2. Simular el clic en el botón visible
    const button = wrapper.find('button[title="Volver Arriba"]');
    await button.trigger('click');

    // 3. Verificar que window.scrollTo fue llamado con los argumentos correctos
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
    // 4. Verificar que se llamó exactamente una vez
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
  });
});