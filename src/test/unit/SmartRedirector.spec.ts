import { mount } from '@vue/test-utils';
import SmartRedirector from '../../components/SmartRedirector.vue';
import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest';

const originalLocation = window.location;
const originalUserAgent = navigator.userAgent;

let assignSpy: ReturnType<typeof vi.fn>;
let hrefMock: { value: string };

beforeEach(() => {
  assignSpy = vi.fn();
  hrefMock = { value: 'http://mi-sitio.com/test' }; 

  delete (window as any).location;
  window.location = {
    ...originalLocation, 
    get href() { return hrefMock.value; },
    set href(val: string) { hrefMock.value = val; },
    assign: assignSpy, 
    reload: vi.fn(), 
  } as any; 

  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(originalUserAgent); 
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(window, 'location', 'get').mockReturnValue(originalLocation);
  Object.defineProperty(navigator, 'userAgent', { value: originalUserAgent, configurable: true });
});


describe('SmartRedirector.vue - Redirección Avanzada', () => {

  test('1. Si el protocolo es HTTP, debe forzar la redirección a HTTPS y detenerse', async () => {
    vi.spyOn(window.location, 'protocol', 'get').mockReturnValue('http:');
    hrefMock.value = 'http://mi-sitio.com/test';

    const wrapper = mount(SmartRedirector);
    await wrapper.vm.$nextTick();
    
    expect(hrefMock.value).toBe('https://mi-sitio.com/test');
    
    expect(assignSpy).not.toHaveBeenCalled();
  });

  test('2. Si es HTTPS y detecta Firefox, debe redirigir a /pagina-para-firefox', async () => {
    vi.spyOn(window.location, 'protocol', 'get').mockReturnValue('https:');
    
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 Firefox/99.0');

    const wrapper = mount(SmartRedirector);
    await wrapper.vm.$nextTick();

    expect(assignSpy).toHaveBeenCalledWith('/pagina-para-firefox');
    
    expect(hrefMock.value).toBe('http://mi-sitio.com/test'); 
  });
  
  test('3. Si es HTTPS y detecta Chrome (excluyendo Edge), debe redirigir a /pagina-para-chrome', async () => {
    vi.spyOn(window.location, 'protocol', 'get').mockReturnValue('https:');
    
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 Chrome/100.0.4896.88 Safari/537.36');

    const wrapper = mount(SmartRedirector);
    await wrapper.vm.$nextTick();

    expect(assignSpy).toHaveBeenCalledWith('/pagina-para-chrome');
  });

  test('4. Si es HTTPS y el navegador no está en la lista (Safari/Edge), no debe redirigir', async () => {
    vi.spyOn(window.location, 'protocol', 'get').mockReturnValue('https:');
    
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.46'); 
    
    const wrapper = mount(SmartRedirector);
    await wrapper.vm.$nextTick();

    expect(assignSpy).not.toHaveBeenCalled();
    
    expect(hrefMock.value).toBe('http://mi-sitio.com/test'); 
  });
});