import { mount } from '@vue/test-utils';
import ScrollProgressBar from '../../components/ScrollProgressBar.vue';
import { afterEach, describe, expect, test, vi } from 'vitest';

const SCROLL_HEIGHT_MOCK = 2000;
const CLIENT_HEIGHT_MOCK = 500;

const triggerScrollEvent = () => {
    window.dispatchEvent(new Event('scroll'));
};

const setupScrollMocks = (scrollYPos: number) => {
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(SCROLL_HEIGHT_MOCK);
    vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(CLIENT_HEIGHT_MOCK);

    Object.defineProperty(window, 'scrollY', { value: scrollYPos, writable: true });
};


describe('ScrollProgressBar.vue', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('1. Al inicio de la página (scrollY = 0) debe mostrar 0% de progreso', async () => {
        setupScrollMocks(0); 

        const wrapper = mount(ScrollProgressBar);
        await wrapper.vm.$nextTick(); 
        
        const progressBar = wrapper.find('.progress-bar');

        expect(progressBar.attributes('style')).toContain('width: 0%');
        expect(progressBar.attributes('aria-valuenow')).toBe('0');
    });

    test('2. A mitad de la distancia de scroll (750px) debe mostrar 50% de progreso', async () => {
        const scrollPosition = 750;
        setupScrollMocks(scrollPosition); 

        const wrapper = mount(ScrollProgressBar);
        await wrapper.vm.$nextTick(); 
        
        triggerScrollEvent(); 
        await wrapper.vm.$nextTick(); 

        const progressBar = wrapper.find('.progress-bar');
        
        expect(progressBar.attributes('style')).toContain('width: 50');
        expect(progressBar.attributes('aria-valuenow')).toBe('50');
    });

    test('3. Al final de la página (1500px) debe mostrar 100% de progreso', async () => {
        const scrollPosition = 1500; 
        setupScrollMocks(scrollPosition); 

        const wrapper = mount(ScrollProgressBar);
        await wrapper.vm.$nextTick(); 
        
        triggerScrollEvent(); 
        await wrapper.vm.$nextTick(); 

        const progressBar = wrapper.find('.progress-bar');
        
        expect(progressBar.attributes('style')).toContain('width: 100%');
        expect(progressBar.attributes('aria-valuenow')).toBe('100');
    });
    
    test('4. Debe limpiar los listeners al desmontarse', () => {
        const removeScrollSpy = vi.spyOn(window, 'removeEventListener');
        
        setupScrollMocks(0);
        const wrapper = mount(ScrollProgressBar);
        wrapper.unmount();

        expect(removeScrollSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        expect(removeScrollSpy).toHaveBeenCalledWith('resize', expect.any(Function)); 
    });
});