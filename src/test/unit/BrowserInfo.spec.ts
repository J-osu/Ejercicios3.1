import { mount } from '@vue/test-utils';
import BrowserInfo from '../../components/BrowserInfo.vue';
import { describe, test, expect, vi, afterEach } from 'vitest';

describe('BrowserInfo.vue', () => {
    // Función de ayuda para montar el componente y esperar el tick
    const mountComponent = async () => {
        const wrapper = mount(BrowserInfo);
        // onMounted se dispara, necesitamos el nextTick para que Vue actualice los refs
        await wrapper.vm.$nextTick(); 
        return wrapper;
    };

    test('Debe mostrar la información mockeada correctamente (Cookies deshabilitadas)', async () => {
        // 🔴 1. Mockear las propiedades del objeto navigator (getters)
        // Es crucial usar 'get' ya que son propiedades de solo lectura
        const languageSpy = vi.spyOn(navigator, 'language', 'get').mockReturnValue('fr-FR');
        const platformSpy = vi.spyOn(navigator, 'platform', 'get').mockReturnValue('MacIntel');
        const cookieEnabledSpy = vi.spyOn(navigator, 'cookieEnabled', 'get').mockReturnValue(false);

        const wrapper = await mountComponent();
        const text = wrapper.text();

        // 3. Verificación de las aserciones
        // Verificación de Idioma
        expect(text).toContain('fr-FR');
        expect(text).toContain('(Francés)');

        // Verificación de Plataforma
        expect(text).toContain('MacIntel');

        // Verificación de Cookies
        expect(text).toContain('Cookies Habilitadas: No');
        expect(text).not.toContain('Cookies Habilitadas: Sí');
    });

    test('Debe mostrar la información mockeada correctamente (Cookies habilitadas)', async () => {
        // 4. Asignar valores para el segundo escenario
        const languageSpy = vi.spyOn(navigator, 'language', 'get').mockReturnValue('es-ES');
        const platformSpy = vi.spyOn(navigator, 'platform', 'get').mockReturnValue('Win32');
        const cookieEnabledSpy = vi.spyOn(navigator, 'cookieEnabled', 'get').mockReturnValue(true);

        const wrapper = await mountComponent();
        const text = wrapper.text();

        // Verificación de Idioma
        expect(text).toContain('es-ES');
        expect(text).toContain('(Español)');
        
        // Verificación de Plataforma
        expect(text).toContain('Win32');

        // Verificación de Cookies
        expect(text).toContain('Cookies Habilitadas: Sí');
        expect(text).not.toContain('Cookies Habilitadas: No'); 
    });

    // Restaurar los mocks después de cada test
    afterEach(() => {
        vi.restoreAllMocks();
    });
});