import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import CountdownTimer from '../../components/CountdownTimer.vue'; 

const getCounterText = (wrapper: VueWrapper<any>) => {
    return wrapper.find('.timer-display').text().replace(/\s/g, ''); 
};

describe('CountdownTimer.vue (Fake Timers)', () => {
    
    const START_TIME = new Date('2025-11-20T10:00:00Z'); 
    const TARGET_DATE = new Date('2025-11-21T12:30:30Z'); 

    beforeEach(() => {
        vi.useFakeTimers(); 
        vi.setSystemTime(START_TIME); 
    });
    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('1. Debe mostrar los valores correctos (1 día, 2h, 30m, 30s) en el estado inicial', async () => {
        
        const wrapper = mount(CountdownTimer, {
            props: {
                targetDate: TARGET_DATE,
            },
        });
        
        await nextTick();
        
        vi.advanceTimersByTime(0);
        await nextTick();

        const expected = '1Días:02Horas:30Minutos:30Segundos';
        expect(getCounterText(wrapper)).toContain(expected);
        expect(wrapper.find('.finished-message').exists()).toBe(false);
    });
    
    it('2. Debe actualizar el contador después de avanzar 1 segundo', async () => {
        
        const wrapper = mount(CountdownTimer, {
            props: {
                targetDate: TARGET_DATE,
            },
        });
        
        await nextTick();
        vi.advanceTimersByTime(0);

        expect(getCounterText(wrapper)).toContain(':30Segundos');
        
        vi.advanceTimersByTime(1000);
        await nextTick();
        
        expect(getCounterText(wrapper)).toContain(':29Segundos');
        
        vi.advanceTimersByTime(10000);
        await nextTick();

        expect(getCounterText(wrapper)).toContain(':19Segundos');
    });

    it('3. Debe finalizar la cuenta atrás y mostrar el mensaje de evento terminado', async () => {
        
        const wrapper = mount(CountdownTimer, {
            props: {
                targetDate: TARGET_DATE,
            },
        });
        
        await nextTick();
        vi.advanceTimersByTime(0);

        const totalRemainingMs = 
            (1 * 24 * 3600 + 2 * 3600 + 30 * 60 + 30) * 1000;
        
        expect(wrapper.find('.timer-display').exists()).toBe(true);
        
        vi.advanceTimersByTime(totalRemainingMs + 1);
        
        await nextTick();

        expect(wrapper.find('.timer-display').exists()).toBe(false);
        
        const finishedMessage = wrapper.find('.finished-message');
        expect(finishedMessage.exists()).toBe(true);
        expect(finishedMessage.text()).toBe('¡El evento ha comenzado!');
 
        expect(vi.getTimerCount()).toBe(0);
    });
});