import { mount } from '@vue/test-utils';
import NavigationTools from '../../components/NavigationTools.vue';
import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest';

describe('NavigationTools.vue', () => {
  const originalLocation = window.location;
  
  let assignSpy: ReturnType<typeof vi.fn>;
  let reloadSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    assignSpy = vi.fn();
    reloadSpy = vi.fn();
    
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      assign: assignSpy,
      reload: reloadSpy,
    } as any;
  });

  afterEach(() => {
    vi.spyOn(window, 'location', 'get').mockReturnValue(originalLocation);
  });
  
  test('El botón "Recargar Página" debe llamar a window.location.reload', async () => {
    const wrapper = mount(NavigationTools);
    
    const reloadButton = wrapper.find('button.btn-warning');
    
    await reloadButton.trigger('click');

    expect(reloadSpy).toHaveBeenCalledTimes(1);
    expect(assignSpy).not.toHaveBeenCalled();
  });

  test('El botón "Ir" debe llamar a window.location.assign con la URL por defecto', async () => {
    const wrapper = mount(NavigationTools);
    
    const assignButton = wrapper.find('button.btn-primary');
    
    await assignButton.trigger('click');

    expect(assignSpy).toHaveBeenCalledTimes(1);
    expect(assignSpy).toHaveBeenCalledWith('https://vuejs.org');
  });
  
  test('El botón "Ir" debe llamar a location.assign con el nuevo valor del input', async () => {
    const wrapper = mount(NavigationTools);
    const newUrl = 'https://www.google.com/search?q=zeus';
    
    const inputField = wrapper.find('input[type="url"]');
    
    await inputField.setValue(newUrl);

    const assignButton = wrapper.find('button.btn-primary');
    await assignButton.trigger('click');

    expect(assignSpy).toHaveBeenCalledWith(newUrl);
    expect(assignSpy).toHaveBeenCalledTimes(1);
  });
});