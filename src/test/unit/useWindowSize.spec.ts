import { afterEach, describe, expect, test, vi } from 'vitest';
import { useWindowSize } from '../../composables/useWindowSize';
import { mount } from '@vue/test-utils'; // Utilizaremos mount para simular el ciclo de vida

// Componente Wrapper simple para ejecutar el composable y acceder a su estado.
const TestComponent = {
  template: '<div></div>',
  setup() {
    return { ...useWindowSize() };
  },
};

describe('useWindowSize', () => {
  // Guardamos los descriptores originales para restaurarlos después
  const originalInnerWidthDesc = Object.getOwnPropertyDescriptor(window, 'innerWidth');
  const originalInnerHeightDesc = Object.getOwnPropertyDescriptor(window, 'innerHeight');

  // Función para simular el evento resize
  const setWindowSize = (newWidth: number, newHeight: number) => {
    // Redefinimos las propiedades para que sean configurables en JSDOM
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: newWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: newHeight,
    });
    // Disparamos el evento resize
    window.dispatchEvent(new Event('resize'));
  };

  // Restaurar el estado inicial de window después de cada prueba
  afterEach(() => {
    // Restaurar descriptores originales si existían
    if (originalInnerWidthDesc) {
      Object.defineProperty(window, 'innerWidth', originalInnerWidthDesc);
    }
    if (originalInnerHeightDesc) {
      Object.defineProperty(window, 'innerHeight', originalInnerHeightDesc);
    }
    // Restaurar cualquier spy
    vi.restoreAllMocks?.();
  });

  test('Los valores iniciales deben ser las dimensiones de la ventana al montarse', async () => {
    // 1. Simular dimensiones iniciales de la ventana
    setWindowSize(800, 600);

    // 2. Montar el componente para disparar onMounted del composable
    const wrapper = mount(TestComponent);

    // Esperar a que el tick de Vue se ejecute para asegurar la actualización
    await wrapper.vm.$nextTick();

    // 3. Verificar los valores iniciales
    expect(wrapper.vm.width).toBe(800);
    expect(wrapper.vm.height).toBe(600);
  });

  test('Los valores se deben actualizar reactivamente con el evento resize', async () => {
    // 1. Montar el componente (inicializa con las dimensiones actuales)
    const wrapper = mount(TestComponent);

    // 2. Simular un cambio de tamaño
    setWindowSize(1200, 900);

    // 3. Esperar al próximo tick de Vue
    await wrapper.vm.$nextTick();

    // 4. Verificar que los refs se han actualizado
    expect(wrapper.vm.width).toBe(1200);
    expect(wrapper.vm.height).toBe(900);
  });
  
  test('El listener debe limpiarse al desmontar el componente (evitar memory leaks)', () => {
    // Espía la función removeEventListener de window
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const wrapper = mount(TestComponent);

    // Desmontar el componente (dispara onUnmounted)
    wrapper.unmount();

    // Verificar que removeEventListener fue llamado con 'resize' y una función
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeSpy.mockRestore?.();
  });
});