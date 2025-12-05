import { mount } from '@vue/test-utils';
import UrlInspector from '../../components/UrlInspector.vue';
import { beforeAll, afterAll, describe, expect, test, vi } from 'vitest';

describe('UrlInspector.vue', () => {
  const MOCK_URL_STRING = 'https://www.zeus-app.com:8080/products/tools?id=123&sort=price';
  const mockLocation = new URL(MOCK_URL_STRING);

  const originalLocation = window.location;

  beforeAll(() => {
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...originalLocation, 
      href: mockLocation.href,
      protocol: mockLocation.protocol,
      hostname: mockLocation.hostname,
      port: mockLocation.port,
      pathname: mockLocation.pathname,
      search: mockLocation.search,
    } as any); 
  });

  afterAll(() => {
    vi.spyOn(window, 'location', 'get').mockReturnValue(originalLocation);
  });

  test('El componente debe extraer y mostrar todas las partes de la URL mockeada', async () => {
    const wrapper = mount(UrlInspector);
    
    await wrapper.vm.$nextTick();

    const componentText = wrapper.text();
    
    expect(componentText).toContain(MOCK_URL_STRING); 
    
    expect(componentText).toContain(mockLocation.protocol); 
    
    expect(componentText).toContain(mockLocation.hostname); 
    
    expect(componentText).toContain(mockLocation.port); 
    
    expect(componentText).toContain(mockLocation.pathname); 
    
    expect(componentText).toContain(mockLocation.search); 
  });
});