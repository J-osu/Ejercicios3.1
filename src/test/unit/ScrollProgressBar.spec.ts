import { mount } from '@vue/test-utils';
import ScrollProgressBar from '../../components/ScrollProgressBar.vue';
import { afterEach, describe, expect, test, vi } from 'vitest';

// Constantes de ejemplo para la simulación
const SCROLL_HEIGHT_MOCK = 2000;
const CLIENT_HEIGHT_MOCK = 500;
// Distancia total de scroll disponible: 2000 - 500 = 1500

// Función para simular el evento scroll
const triggerScrollEvent = () => {
    window.dispatchEvent(new Event('scroll'));
};

// Función para configurar los mocks del DOM y del ScrollY
const setupScrollMocks = (scrollYPos: number) => {
    // 1. Mockear las propiedades del DOM (Altura de la página y ventana)
    // Es CRUCIAL usar 'get' ya que son propiedades de solo lectura (accesors)
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(SCROLL_HEIGHT_MOCK);
    vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(CLIENT_HEIGHT_MOCK);

    // 2. Mockear la posición del scroll
    Object.defineProperty(window, 'scrollY', { value: scrollYPos, writable: true });
};


describe('ScrollProgressBar.vue', () => {
    // Limpiar el estado de los mocks después de cada prueba
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('1. Al inicio de la página (scrollY = 0) debe mostrar 0% de progreso', async () => {
        // Simular: scrollY = 0
        setupScrollMocks(0); 

        const wrapper = mount(ScrollProgressBar);
        await wrapper.vm.$nextTick(); 
        
        // El progreso se aplica como un estilo inline: width: X%
        const progressBar = wrapper.find('.progress-bar');

        // Verificar el estilo de ancho
        expect(progressBar.attributes('style')).toContain('width: 0%');
        // Verificar el atributo de accesibilidad
        expect(progressBar.attributes('aria-valuenow')).toBe('0');
    });

    test('2. A mitad de la distancia de scroll (750px) debe mostrar 50% de progreso', async () => {
        // Distancia total = 1500. Mitad = 750
        const scrollPosition = 750;
        setupScrollMocks(scrollPosition); 

        const wrapper = mount(ScrollProgressBar);
        await wrapper.vm.$nextTick(); 
        
        // Forzar el recálculo (necesario si la simulación ocurre antes del onMounted)
        triggerScrollEvent(); 
        await wrapper.vm.$nextTick(); 

        const progressBar = wrapper.find('.progress-bar');
        
        // 750 / 1500 = 0.5 * 100 = 50%
        expect(progressBar.attributes('style')).toContain('width: 50');
        expect(progressBar.attributes('aria-valuenow')).toBe('50');
    });

    test('3. Al final de la página (1500px) debe mostrar 100% de progreso', async () => {
        // Posición máxima de scroll
        const scrollPosition = 1500; 
        setupScrollMocks(scrollPosition); 

        const wrapper = mount(ScrollProgressBar);
        await wrapper.vm.$nextTick(); 
        
        triggerScrollEvent(); 
        await wrapper.vm.$nextTick(); 

        const progressBar = wrapper.find('.progress-bar');
        
        // 1500 / 1500 = 1 * 100 = 100%
        expect(progressBar.attributes('style')).toContain('width: 100%');
        expect(progressBar.attributes('aria-valuenow')).toBe('100');
    });
    
    test('4. Debe limpiar los listeners al desmontarse', () => {
        // Espiar la función removeEventListener de window
        const removeScrollSpy = vi.spyOn(window, 'removeEventListener');
        
        setupScrollMocks(0);
        const wrapper = mount(ScrollProgressBar);
        wrapper.unmount(); // Dispara onUnmounted
        
        // Verificar que el listener de 'scroll' fue eliminado
        expect(removeScrollSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        // Verificar que el listener de 'resize' fue eliminado (por buena práctica)
        expect(removeScrollSpy).toHaveBeenCalledWith('resize', expect.any(Function)); 
    });
});