import { afterEach, describe, expect, test, vi } from 'vitest';
import { useWindowSize } from '../../composables/useWindowSize';
import { mount } from '@vue/test-utils'; 

const TestComponent = {
  template: '<div></div>',
  setup() {
    return { ...useWindowSize() };
  },
};

describe('useWindowSize', () => {
  const originalInnerWidthDesc = Object.getOwnPropertyDescriptor(window, 'innerWidth');
  const originalInnerHeightDesc = Object.getOwnPropertyDescriptor(window, 'innerHeight');

  const setWindowSize = (newWidth: number, newHeight: number) => {
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
    window.dispatchEvent(new Event('resize'));
  };

  afterEach(() => {
    if (originalInnerWidthDesc) {
      Object.defineProperty(window, 'innerWidth', originalInnerWidthDesc);
    }
    if (originalInnerHeightDesc) {
      Object.defineProperty(window, 'innerHeight', originalInnerHeightDesc);
    }
    vi.restoreAllMocks();
  });

  test('Los valores iniciales deben reflejar las dimensiones simuladas', async () => {
    setWindowSize(800, 600);

    const wrapper = mount(TestComponent);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.width).toBe(800);
    expect(wrapper.vm.height).toBe(600);
  });

  test('Los valores se deben actualizar reactivamente con el evento resize', async () => {
    const wrapper = mount(TestComponent);

    setWindowSize(1200, 900);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.width).toBe(1200);
    expect(wrapper.vm.height).toBe(900);
  });
  
  test('El listener debe limpiarse al desmontar el componente (evitar memory leaks)', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const wrapper = mount(TestComponent);
    wrapper.unmount();

    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });
});