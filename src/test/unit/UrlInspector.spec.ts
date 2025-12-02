import { mount } from '@vue/test-utils';
import UrlInspector from '../../components/UrlInspector.vue';
import { beforeAll, afterAll, describe, expect, test, vi } from 'vitest';

describe('UrlInspector.vue', () => {
  // Definimos la URL de prueba estática
  const MOCK_URL_STRING = 'https://www.zeus-app.com:8080/products/tools?id=123&sort=price';
  // Utilizamos la API nativa URL para obtener las partes correctas para la aserción
  const mockLocation = new URL(MOCK_URL_STRING);

  // 🔴 1. Mockear window.location
  // Guardamos el objeto original
  const originalLocation = window.location;

  // Mockeamos las propiedades específicas que nuestro componente lee.
  // Es crucial usar 'get' y el accesor ya que location es de solo lectura.
  beforeAll(() => {
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      // Mantenemos otras propiedades de location que no usamos (ej: assign, reload)
      ...originalLocation, 
      href: mockLocation.href,
      protocol: mockLocation.protocol,
      hostname: mockLocation.hostname,
      port: mockLocation.port,
      pathname: mockLocation.pathname,
      search: mockLocation.search,
    } as any); // 'as any' es a menudo necesario para mocks de objetos globales
  });

  // Restaurar el objeto location original después de las pruebas
  afterAll(() => {
    vi.spyOn(window, 'location', 'get').mockReturnValue(originalLocation);
  });

  test('El componente debe extraer y mostrar todas las partes de la URL mockeada', async () => {
    // 2. Montar el componente (dispara onMounted, que usa el location mockeado)
    const wrapper = mount(UrlInspector);
    
    // Esperar al próximo tick para asegurar la actualización del reactive
    await wrapper.vm.$nextTick();

    // 3. Verificar que el texto renderizado coincide con los valores del mock
    const componentText = wrapper.text();
    
    // Verificación de la URL Completa (href)
    expect(componentText).toContain(MOCK_URL_STRING); 
    
    // Verificación de Protocolo
    expect(componentText).toContain(mockLocation.protocol); // 'https:'
    
    // Verificación de Dominio
    expect(componentText).toContain(mockLocation.hostname); // 'www.zeus-app.com'
    
    // Verificación de Puerto
    expect(componentText).toContain(mockLocation.port); // '8080'
    
    // Verificación de Ruta
    expect(componentText).toContain(mockLocation.pathname); // '/products/tools'
    
    // Verificación de Parámetros de Búsqueda
    expect(componentText).toContain(mockLocation.search); // '?id=123&sort=price'
  });
});