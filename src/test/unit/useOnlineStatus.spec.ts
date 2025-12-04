import { mount } from '@vue/test-utils';
import { useOnlineStatus } from '../../composables/useOnlineStatus';
import { vi, describe, test, expect, afterEach, beforeEach } from 'vitest';
import { defineComponent } from 'vue';

// Componente Wrapper (sin cambios)
const TestComponent = defineComponent({
    template: '<div>{{ isOnline }}</div>',
    setup() {
        const { isOnline } = useOnlineStatus();
        return { isOnline };
    },
});

describe('useOnlineStatus (Prueba Sencilla)', () => {
    
    // Declaración de espías con ámbito de test
    let onlineSpy: ReturnType<typeof vi.fn>;
    let addEventListenerSpy: ReturnType<typeof vi.fn>;
    let removeEventListenerSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        // 1. Resetear todos los mocks
        vi.restoreAllMocks();
        
        // 2. Crear los espías de window DENTRO del beforeEach para que el entorno esté limpio
        onlineSpy = vi.spyOn(navigator, 'onLine', 'get');
        addEventListenerSpy = vi.spyOn(window, 'addEventListener');
        removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
        
        // Asegurar que el espía de navigator.onLine esté listo para la lectura síncrona
    });

    afterEach(() => {
        // Necesario para limpiar el estado entre pruebas
        vi.clearAllMocks(); 
    });


    // 🚨 FIX 1: El valor inicial ahora debe pasar
    test('1. El valor inicial debe coincidir con navigator.onLine', () => {
        // Escenario 1: Inicialización Offline (Esperado false)
        onlineSpy.mockReturnValue(false); 
        const wrapperOffline = mount(TestComponent);
        
        // Verifica que el valor síncrono sea false
        expect(wrapperOffline.vm.isOnline).toBe(false); 
        
        // Escenario 2: Inicialización Online (Esperado true)
        onlineSpy.mockReturnValue(true); 
        const wrapperOnline = mount(TestComponent);
        expect(wrapperOnline.vm.isOnline).toBe(true); 
    });
    
    // 🚨 FIX 2 & 3: Reactividad y Limpieza
    test('2. Debe actualizar el estado al disparar eventos online/offline', async () => {
        onlineSpy.mockReturnValue(true); 
        const wrapper = mount(TestComponent);
        
        // Verificar estado inicial (true)
        expect(wrapper.vm.isOnline).toBe(true); 

        // Simular evento 'offline'
        window.dispatchEvent(new Event('offline'));
        await wrapper.vm.$nextTick(); 
        expect(wrapper.vm.isOnline).toBe(false);

        // Simular evento 'online'
        window.dispatchEvent(new Event('online'));
        await wrapper.vm.$nextTick(); 

        expect(wrapper.vm.isOnline).toBe(true);
    });

    test('3. Debe limpiar los event listeners en onUnmounted', () => {
        onlineSpy.mockReturnValue(true); 
        const wrapper = mount(TestComponent);
        
        // 1. Verificar que los listeners se añadieron (FALLO 3 RESUELTO)
        expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));

        wrapper.unmount(); 

        // 2. Verificar que los listeners se eliminaron correctamente
        expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    });
});