import { mount } from '@vue/test-utils';
import { useLanguageRedirect } from '../../composables/useLanguageRedirect';
import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest';

const originalLocation = window.location;
let assignSpy: ReturnType<typeof vi.fn>;

const TestComponent = {
  template: '<div></div>',
  setup() {
    useLanguageRedirect();
  },
};

beforeEach(() => {
  assignSpy = vi.fn();
  
  delete (window as any).location;
  window.location = {
    ...originalLocation, 
    assign: assignSpy,
    search: '', 
  } as any;
});

afterEach(() => {
  vi.spyOn(window, 'location', 'get').mockReturnValue(originalLocation);
});


const mockSearch = (searchString: string) => {
    vi.spyOn(window.location, 'search', 'get').mockReturnValue(searchString);
};

describe('useLanguageRedirect', () => {

  test('1. Si lang=en, debe redirigir a /lang-en.html', async () => {
    mockSearch('?lang=en&theme=dark'); 

    mount(TestComponent);
    
    await vi.dynamicImportSettled(); 

    expect(assignSpy).toHaveBeenCalledWith('/lang-en.html');
    expect(assignSpy).toHaveBeenCalledTimes(1);
  });

  test('2. Si lang=es, debe redirigir a /lang-es.html', async () => {
    mockSearch('?lang=es'); 

    mount(TestComponent);
    await vi.dynamicImportSettled(); 

    expect(assignSpy).toHaveBeenCalledWith('/lang-es.html');
    expect(assignSpy).toHaveBeenCalledTimes(1);
  });

  test('3. Si lang está ausente, no debe haber redirección', async () => {
    mockSearch('?theme=dark'); 

    mount(TestComponent);
    await vi.dynamicImportSettled(); 

    expect(assignSpy).not.toHaveBeenCalled();
  });
  
  test('4. Si lang tiene un valor no soportado, no debe haber redirección', async () => {
    mockSearch('?lang=fr'); 

    mount(TestComponent);
    await vi.dynamicImportSettled(); 

    expect(assignSpy).not.toHaveBeenCalled();
  });
});