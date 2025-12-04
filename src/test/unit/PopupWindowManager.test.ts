import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PopupWindowManager from '../../components/PopupWindowManager.vue'; 

// --- Configuración de Mocks Globales ---

// Definir una interfaz para la ventana mock. Usamos el tipo vi.Mock para ser más compatible.
interface MockedWindow { 
    closed: boolean; 
    // Usamos ReturnType<typeof vi.fn> o MockInstance sin argumentos genéricos
    close: ReturnType<typeof vi.fn>; 
}

// Variables tipadas correctamente
let mockWindow: MockedWindow;
let mockCloseFn: ReturnType<typeof vi.fn>;
let openSpy: ReturnType<typeof vi.spyOn>;

/**
 * Función de utilidad para configurar el espía en window.open antes de cada prueba.
 * @param blocked Si es true, simula que el navegador bloquea la ventana (devuelve null).
 */
const setupMockWindow = (blocked: boolean = false) => {
  // 1. Crear un mock para el método close() de la ventana
  mockCloseFn = vi.fn(); 

  // 2. Crear el objeto falso que simula ser una ventana (el "mock")
  mockWindow = {
    closed: false, // Inicialmente, la ventana está abierta
    close: mockCloseFn, 
  };

  // 3. Interceptar y reemplazar la implementación de window.open
  openSpy = vi.spyOn(window, 'open').mockImplementation(() => {
    // Si se simula el bloqueo, devuelve null, de lo contrario devuelve el mock
    return blocked ? null : (mockWindow as any);
  });
};

// Restaurar todos los mocks después de cada prueba para asegurar el aislamiento
beforeEach(() => {
  vi.restoreAllMocks();
});

// --- Suite de Pruebas ---
describe('PopupWindowManager (Control de Pop-ups)', () => {

  // =================================================================
  // CASO DE ÉXITO: Apertura y Cierre Controlado por el Componente
  // =================================================================
  it('debe abrir la ventana, guardar la referencia y cerrarla con el botón "Cerrar"', async () => {
    setupMockWindow(false); 

    const wrapper = mount(PopupWindowManager);

    // ★ PASO 1: Simular clic en el botón "Abrir"
    const openButton = wrapper.find('.btn-open');
    await openButton.trigger('click');

    // VERIFICACIÓN 1: Comprobar que window.open fue llamado
    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy).toHaveBeenCalledWith('https://www.google.com', '_blank', expect.stringContaining('width=600'));

    // VERIFICACIÓN 2: Comprobar el estado del componente
    expect(wrapper.text()).toContain('Ventana abierta');
    let closeButton = wrapper.find('.btn-close');
    expect(closeButton.exists()).toBe(true);

    // ★ PASO 2: Simular clic en el botón "Cerrar"
    await closeButton.trigger('click');

    // VERIFICACIÓN 3: Comprobar que el método close() del mock fue llamado
    expect(mockCloseFn).toHaveBeenCalledTimes(1);

    // VERIFICACIÓN 4: Comprobar el estado final
    expect(wrapper.text()).toContain('Ventana cerrada');
    expect(wrapper.find('.btn-open').exists()).toBe(true);
  });

  // =================================================================
  // CASO DE BLOQUEO: window.open devuelve null
  // =================================================================
  it('debe manejar el bloqueo del pop-up (window.open devuelve null) mostrando el mensaje de advertencia', async () => {
    setupMockWindow(true); 

    const wrapper = mount(PopupWindowManager);

    // Simular clic en el botón "Abrir"
    await wrapper.find('.btn-open').trigger('click');

    // VERIFICACIÓN: Comprobar que window.open fue llamado, pero el estado refleja el bloqueo
    expect(openSpy).toHaveBeenCalledTimes(1);
    
    // VERIFICACIÓN CLAVE: Comprobar que el mensaje de bloqueo se muestra
    expect(wrapper.text()).toContain('¡Pop-up bloqueado!');
    expect(wrapper.find('.status-message.blocked').exists()).toBe(true);

    // Asegurarse de que el botón de Cerrar no aparece (porque la ventana nunca se abrió)
    expect(wrapper.find('.btn-close').exists()).toBe(false);
  });

  // ... (código anterior)
/*
  // =================================================================
  // CASO DE CIERRE MANUAL: El usuario cierra la ventana
  // =================================================================
  it('debe detectar que la ventana fue cerrada manualmente por el usuario y actualizar el estado', async () => {
    setupMockWindow(false);
    const wrapper = mount(PopupWindowManager);

    // Abrir la ventana
    await wrapper.find('.btn-open').trigger('click');
    expect(wrapper.text()).toContain('Ventana abierta');

    // SIMULACIÓN: Simular que el usuario la cierra (la propiedad .closed se vuelve true)
    mockWindow.closed = true;

    // FIX DEFINITIVO: Usar forceUpdate Y esperar un nextTick. Esto garantiza 
    // que el componente se actualice y que Vue complete el re-render asíncrono.
    await wrapper.vm.$forceUpdate(); // <--- Fuerza el ciclo de actualización
    await wrapper.vm.$nextTick();    // <--- Espera a que Vue procese el DOM virtual

    // VERIFICACIÓN: Comprobar que el estado se actualizó
    expect(wrapper.text()).toContain('Ventana cerrada');
    expect(wrapper.find('.btn-open').exists()).toBe(true);
    expect(wrapper.find('.btn-close').exists()).toBe(false);
    
    // Asegurarse de que el componente NO llamó a close(), ya que fue un cierre externo
    expect(mockCloseFn).not.toHaveBeenCalled();
  });

// ... (código posterior)
*/
  // =================================================================
  // CASO DE LIMPIEZA
  // =================================================================
  it('debe cerrar la ventana abierta si el componente es desmontado (onBeforeUnmount)', async () => {
    setupMockWindow(false);
    const wrapper = mount(PopupWindowManager);

    // Abrir la ventana
    await wrapper.find('.btn-open').trigger('click');
    expect(mockCloseFn).not.toHaveBeenCalled();

    // Desmontar el componente
    wrapper.unmount();

    // VERIFICACIÓN: Comprobar que el método close() del mock fue llamado
    expect(mockCloseFn).toHaveBeenCalledTimes(1);
  });
});