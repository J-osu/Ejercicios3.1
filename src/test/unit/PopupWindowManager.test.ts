import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PopupWindowManager from '../../components/PopupWindowManager.vue'; 

interface MockedWindow { 
    closed: boolean; 
    close: ReturnType<typeof vi.fn>; 
}

let mockWindow: MockedWindow;
let mockCloseFn: ReturnType<typeof vi.fn>;
let openSpy: ReturnType<typeof vi.spyOn>;

const setupMockWindow = (blocked: boolean = false) => {
    mockCloseFn = vi.fn(); 

    mockWindow = {
        closed: false,
        close: mockCloseFn, 
    };

    openSpy = vi.spyOn(window, 'open').mockImplementation(() => {
        return blocked ? null : (mockWindow as any);
    });
};

beforeEach(() => {
    vi.restoreAllMocks();
});

vi.useFakeTimers();

describe('PopupWindowManager (Control de Pop-ups)', () => {

    it('debe abrir la ventana, guardar la referencia y cerrarla con el botón "Cerrar"', async () => {
        setupMockWindow(false); 

        const wrapper = mount(PopupWindowManager);

        const openButton = wrapper.find('.btn-open');
        await openButton.trigger('click');

        expect(openSpy).toHaveBeenCalledTimes(1);
        expect(openSpy).toHaveBeenCalledWith('https://www.google.com', '_blank', expect.stringContaining('width=600'));

        expect(wrapper.text()).toContain('Ventana abierta');
        let closeButton = wrapper.find('.btn-close');
        expect(closeButton.exists()).toBe(true);

        await closeButton.trigger('click');

        expect(mockCloseFn).toHaveBeenCalledTimes(1);

        expect(wrapper.text()).toContain('Ventana cerrada');
        expect(wrapper.find('.btn-open').exists()).toBe(true);
    });

    it('debe manejar el bloqueo del pop-up (window.open devuelve null) mostrando el mensaje de advertencia', async () => {
        setupMockWindow(true); 

        const wrapper = mount(PopupWindowManager);

        await wrapper.find('.btn-open').trigger('click');

        expect(openSpy).toHaveBeenCalledTimes(1);
        
        expect(wrapper.text()).toContain('¡Pop-up bloqueado!');
        expect(wrapper.find('.status-message.blocked').exists()).toBe(true);

        expect(wrapper.find('.btn-close').exists()).toBe(false);
    });

    it('debe cerrar la ventana abierta si el componente es desmontado (onBeforeUnmount)', async () => {
        setupMockWindow(false);
        const wrapper = mount(PopupWindowManager);

        await wrapper.find('.btn-open').trigger('click');
        expect(mockCloseFn).not.toHaveBeenCalled();

        wrapper.unmount();

        expect(mockCloseFn).toHaveBeenCalledTimes(1);
    });
});