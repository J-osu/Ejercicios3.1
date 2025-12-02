import { mount } from '@vue/test-utils';
import { useLanguageRedirect } from '../../composables/useLanguageRedirect';
import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest';

// 🔴 Configuración Crucial de Mocking para window.location

const originalLocation = window.location;
let assignSpy: ReturnType<typeof vi.fn>;

// Componente Wrapper para ejecutar el composable y acceder a los hooks
const TestComponent = {
  template: '<div></div>',
  setup() {
    useLanguageRedirect();
  },
};

beforeEach(() => {
  // 1. Resetear el espía de assign
  assignSpy = vi.fn();
  
  // 2. Mockear window.location.assign y window.location.search (por defecto)
  delete (window as any).location;
  window.location = {
    ...originalLocation, 
    assign: assignSpy,
    search: '', // Valor por defecto: sin parámetros
  } as any;
});

afterEach(() => {
  // Restaurar el objeto location original
  vi.spyOn(window, 'location', 'get').mockReturnValue(originalLocation);
});


// Función auxiliar para mockear window.location.search dinámicamente
const mockSearch = (searchString: string) => {
    vi.spyOn(window.location, 'search', 'get').mockReturnValue(searchString);
};

describe('useLanguageRedirect', () => {

  test('1. Si lang=en, debe redirigir a /lang-en.html', async () => {
    // Simular URL: ?lang=en&theme=dark
    mockSearch('?lang=en&theme=dark'); 

    mount(TestComponent);
    
    // El onMounted se dispara al montar
    await vi.dynamicImportSettled(); 

    // Verificar la redirección
    expect(assignSpy).toHaveBeenCalledWith('/lang-en.html');
    expect(assignSpy).toHaveBeenCalledTimes(1);
  });

  test('2. Si lang=es, debe redirigir a /lang-es.html', async () => {
    // Simular URL: ?lang=es
    mockSearch('?lang=es'); 

    mount(TestComponent);
    await vi.dynamicImportSettled(); 

    // Verificar la redirección
    expect(assignSpy).toHaveBeenCalledWith('/lang-es.html');
    expect(assignSpy).toHaveBeenCalledTimes(1);
  });

  test('3. Si lang está ausente, no debe haber redirección', async () => {
    // Simular URL: Sin parámetros o solo otros parámetros
    mockSearch('?theme=dark'); 

    mount(TestComponent);
    await vi.dynamicImportSettled(); 

    // Verificar que location.assign NO fue llamado
    expect(assignSpy).not.toHaveBeenCalled();
  });
  
  test('4. Si lang tiene un valor no soportado, no debe haber redirección', async () => {
    // Simular URL: ?lang=fr
    mockSearch('?lang=fr'); 

    mount(TestComponent);
    await vi.dynamicImportSettled(); 

    // Verificar que location.assign NO fue llamado
    expect(assignSpy).not.toHaveBeenCalled();
  });
});