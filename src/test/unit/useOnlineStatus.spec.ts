import { mount } from '@vue/test-utils';
import { useOnlineStatus } from '../../composables/useOnlineStatus';
import { vi, describe, test, expect, afterEach, beforeEach, beforeAll } from 'vitest';
import { defineComponent } from 'vue';

const fetchSpy = vi.spyOn(window, 'fetch');
const onlineSpy = vi.spyOn(navigator, 'onLine', 'get');
const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');


const TestComponent = defineComponent({
    template: '<div>{{ isOnline }}</div>',
    setup() {
        const { isOnline } = useOnlineStatus();
        return { isOnline };
    },
});

describe('useOnlineStatus', () => {

    const mockFetchSuccess = (isOk: boolean) => {
        fetchSpy.mockResolvedValue({
            ok: isOk,
            status: isOk ? 200 : 500,
        } as Response);
    };

    beforeEach(() => {
        // Restaurar solo los mocks que Vitest creó (fetch, onlineSpy)
        vi.restoreAllMocks(); 
        vi.useFakeTimers(); 
        
        // Es esencial resetear los espías de add/removeEventListener entre tests
        addEventListenerSpy.mockClear(); 
        removeEventListenerSpy.mockClear(); 

        // Restablecer el espía de fetch y onlineSpy para cada test
        vi.spyOn(window, 'fetch');
        vi.spyOn(navigator, 'onLine', 'get');
    });

    afterEach(() => {
        
        vi.useRealTimers(); 
    });

    test('1. El estado inicial debe coincidir con el resultado del ping test', async () => {
        onlineSpy.mockReturnValue(true); 
        mockFetchSuccess(true); // PING exitoso
        
        const wrapper = mount(TestComponent);
        await vi.dynamicImportSettled(); 
        
        await new Promise(resolve => setTimeout(resolve, 0)); 
        
        expect(wrapper.vm.isOnline).toBe(true);

        // Escenario 2: PING fallido (Esperado false)
        wrapper.unmount(); 
        onlineSpy.mockReturnValue(true); 
        mockFetchSuccess(false); 
        
        const wrapperFail = mount(TestComponent);
        await vi.dynamicImportSettled(); 
        await new Promise(resolve => setTimeout(resolve, 0)); 
        
        expect(wrapperFail.vm.isOnline).toBe(false);
    });
    
    test('2. Debe actualizar el estado cuando se disparen los eventos online/offline', async () => {
        onlineSpy.mockReturnValue(true);
        mockFetchSuccess(true); 
        const wrapper = mount(TestComponent);
        
        await vi.dynamicImportSettled(); 
        expect(wrapper.vm.isOnline).toBe(true);

        window.dispatchEvent(new Event('offline'));
        await wrapper.vm.$nextTick(); 
        expect(wrapper.vm.isOnline).toBe(false);

        window.dispatchEvent(new Event('online'));
        mockFetchSuccess(true); 
        await vi.dynamicImportSettled(); 
        
        // Esta línea es la que fallaba.
        expect(wrapper.vm.isOnline).toBe(true);
    });

    test('3. Debe limpiar los event listeners en onUnmounted', () => {
        // Configuramos el mock para que onMounted pase rápido
        onlineSpy.mockReturnValue(true); 
        mockFetchSuccess(true);
        
        const wrapper = mount(TestComponent);
        
        // Verificar que los listeners se añadieron (Number of calls: > 0)
        expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));

        wrapper.unmount(); 

        // Verificar que los listeners se eliminaron
        expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    });
});