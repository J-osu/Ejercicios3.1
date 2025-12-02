import { mount } from '@vue/test-utils';
import NavigationTools from '../../components/NavigationTools.vue';
import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest';

describe('NavigationTools.vue', () => {
  // Guardamos el objeto location original para restaurarlo después
  const originalLocation = window.location;
  
  // Declaramos los espías/mocks fuera del setup para que sean accesibles en los tests
  let assignSpy: ReturnType<typeof vi.fn>;
  let reloadSpy: ReturnType<typeof vi.fn>;

  // 🔴 Configuración Crucial: Mocking de window.location
  beforeEach(() => {
    // 1. Definir los espías como funciones de Vitest (vi.fn())
    assignSpy = vi.fn();
    reloadSpy = vi.fn();
    
    // 2. Reemplazamos el objeto window.location con un mock que contiene nuestros espías
    // Esto es necesario porque window.location no es un objeto simple y es de solo lectura.
    delete (window as any).location;
    window.location = {
      ...originalLocation, // Copiamos otras propiedades (href, pathname, etc.)
      assign: assignSpy,  // Inyectamos nuestro espía para location.assign()
      reload: reloadSpy,  // Inyectamos nuestro espía para location.reload()
    } as any; // Usamos 'as any' para evitar problemas de tipado con objetos globales
  });

  // 🔴 Restauración Crucial: Limpiamos los mocks después de cada prueba
  afterEach(() => {
    // Restaurar el objeto location original
    vi.spyOn(window, 'location', 'get').mockReturnValue(originalLocation);
  });
  
  test('El botón "Recargar Página" debe llamar a window.location.reload', async () => {
    const wrapper = mount(NavigationTools);
    
    // 1. Encontrar el botón de recarga por su texto
    const reloadButton = wrapper.find('button.btn-warning');
    
    // 2. Simular el clic
    await reloadButton.trigger('click');

    // 3. Verificar la aserción: reloadSpy debe haber sido llamado
    expect(reloadSpy).toHaveBeenCalledTimes(1);
    expect(assignSpy).not.toHaveBeenCalled(); // Aseguramos que el otro método NO se llamó
  });

  test('El botón "Ir" debe llamar a window.location.assign con la URL por defecto', async () => {
    const wrapper = mount(NavigationTools);
    
    // 1. Encontrar el botón "Ir" (el que llama a assign)
    const assignButton = wrapper.find('button.btn-primary');
    
    // 2. Simular el clic
    await assignButton.trigger('click');

    // 3. Verificar la aserción: assignSpy debe haber sido llamado con la URL por defecto
    expect(assignSpy).toHaveBeenCalledTimes(1);
    expect(assignSpy).toHaveBeenCalledWith('https://vuejs.org');
  });
  
  test('El botón "Ir" debe llamar a location.assign con el nuevo valor del input', async () => {
    const wrapper = mount(NavigationTools);
    const newUrl = 'https://www.google.com/search?q=zeus';
    
    // 1. Encontrar el input de texto
    const inputField = wrapper.find('input[type="url"]');
    
    // 2. Cambiar el valor del input (actualiza el ref externalUrl)
    await inputField.setValue(newUrl);

    // 3. Simular el clic en el botón "Ir"
    const assignButton = wrapper.find('button.btn-primary');
    await assignButton.trigger('click');

    // 4. Verificar la aserción: assignSpy debe haber sido llamado con la NUEVA URL
    expect(assignSpy).toHaveBeenCalledWith(newUrl);
    expect(assignSpy).toHaveBeenCalledTimes(1);
  });
});