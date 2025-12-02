// tests/unit/SmartRedirector.spec.ts

import { mount } from '@vue/test-utils';
import SmartRedirector from '../../components/SmartRedirector.vue';
import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest';

// Guardamos los objetos originales para restaurarlos después
const originalLocation = window.location;
const originalUserAgent = navigator.userAgent;

// Declaramos espías/mocks para los métodos de acción
let assignSpy: ReturnType<typeof vi.fn>;
let hrefMock: { value: string };

// 🔴 CONFIGURACIÓN GLOBAL DE MOCKS 
beforeEach(() => {
  // Reiniciamos los espías y el mock de location
  assignSpy = vi.fn();
  hrefMock = { value: 'http://mi-sitio.com/test' }; // Estado inicial simulado de href

  // Mockear window.location
  delete (window as any).location;
  window.location = {
    ...originalLocation, 
    // Usamos 'get' y 'set' para simular la propiedad href
    get href() { return hrefMock.value; },
    set href(val: string) { hrefMock.value = val; },
    assign: assignSpy, 
    reload: vi.fn(), // Añadimos reload por si acaso, aunque no lo usemos
    // La propiedad 'protocol' será simulada por cada test individualmente
  } as any; 

  // Mockear navigator.userAgent
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(originalUserAgent); 
});

afterEach(() => {
  // Restaurar los originales después de cada prueba
  vi.restoreAllMocks();
  vi.spyOn(window, 'location', 'get').mockReturnValue(originalLocation);
  Object.defineProperty(navigator, 'userAgent', { value: originalUserAgent, configurable: true });
});


describe('SmartRedirector.vue - Redirección Avanzada', () => {

  // TEST 1: Redirección a HTTPS (Prioridad 1)
  test('1. Si el protocolo es HTTP, debe forzar la redirección a HTTPS y detenerse', async () => {
    // Mockear estado: http:
    vi.spyOn(window.location, 'protocol', 'get').mockReturnValue('http:');
    hrefMock.value = 'http://mi-sitio.com/test';

    const wrapper = mount(SmartRedirector);
    await wrapper.vm.$nextTick();
    
    // 1. Comprobar que href fue reasignado al valor HTTPS
    expect(hrefMock.value).toBe('https://mi-sitio.com/test');
    
    // 2. Comprobar que location.assign NO se llamó (la ejecución se detuvo)
    expect(assignSpy).not.toHaveBeenCalled();
  });

  // TEST 2: Redirección para Firefox (Prioridad 2)
  test('2. Si es HTTPS y detecta Firefox, debe redirigir a /pagina-para-firefox', async () => {
    // Mockear estado: https:
    vi.spyOn(window.location, 'protocol', 'get').mockReturnValue('https:');
    
    // Mockear User Agent: Firefox
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 Firefox/99.0');

    const wrapper = mount(SmartRedirector);
    await wrapper.vm.$nextTick();

    // 1. Comprobar que se llamó a assign con la ruta de Firefox
    expect(assignSpy).toHaveBeenCalledWith('/pagina-para-firefox');
    
    // 2. Comprobar que no se intentó modificar el href (HTTPS check pasó)
    expect(hrefMock.value).toBe('http://mi-sitio.com/test'); // Valor inicial
  });
  
  // TEST 3: Redirección para Chrome
  test('3. Si es HTTPS y detecta Chrome (excluyendo Edge), debe redirigir a /pagina-para-chrome', async () => {
    // Mockear estado: https:
    vi.spyOn(window.location, 'protocol', 'get').mockReturnValue('https:');
    
    // Mockear User Agent: Chrome puro
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 Chrome/100.0.4896.88 Safari/537.36');

    const wrapper = mount(SmartRedirector);
    await wrapper.vm.$nextTick();

    // 1. Comprobar que se llamó a assign con la ruta de Chrome
    expect(assignSpy).toHaveBeenCalledWith('/pagina-para-chrome');
  });

  // TEST 4: No Redirección (Catch-all)
  test('4. Si es HTTPS y el navegador no está en la lista (Safari/Edge), no debe redirigir', async () => {
    // Mockear estado: https:
    vi.spyOn(window.location, 'protocol', 'get').mockReturnValue('https:');
    
    // Mockear User Agent: Edge (que contiene Chrome y Edg) o Safari
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.46'); // Edge
    
    const wrapper = mount(SmartRedirector);
    await wrapper.vm.$nextTick();

    // 1. Comprobar que no se llamó a assign
    expect(assignSpy).not.toHaveBeenCalled();
    
    // 2. Comprobar que no se modificó el href
    expect(hrefMock.value).toBe('http://mi-sitio.com/test'); 
  });
});