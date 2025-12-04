// src/test/unit/CountdownTimer.test.ts

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import CountdownTimer from '../../components/CountdownTimer.vue'; 

// Función auxiliar para obtener el texto del contador
const getCounterText = (wrapper: VueWrapper<any>) => {
    // Devuelve una cadena fácil de comparar (ej: '1Días:02Horas:30Minutos:30Segundos')
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
        // Restaurar y limpiar el estado de los mocks
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    // ----------------------------------------------------
    // Test 1: Estado inicial
    // ----------------------------------------------------
    it('1. Debe mostrar los valores correctos (1 día, 2h, 30m, 30s) en el estado inicial', async () => {
        
        const wrapper = mount(CountdownTimer, {
            props: {
                targetDate: TARGET_DATE,
            },
        });
        
        // El componente llama a updateCountdown() en onMounted, pero
        // si el DOM no se actualiza inmediatamente, forzamos el tick.
        await nextTick();
        
        // El componente también llama a setInterval, que debe dispararse
        // inmediatamente si el cálculo no se hizo en la primera renderización.
        // Simulamos el primer tick del intervalo si el primer cálculo falló.
        vi.advanceTimersByTime(0); // Ejecuta timers pendientes (el primer setInterval)
        await nextTick();

        const expected = '1Días:02Horas:30Minutos:30Segundos';
        expect(getCounterText(wrapper)).toContain(expected);
        expect(wrapper.find('.finished-message').exists()).toBe(false);
    });
    
    // ----------------------------------------------------
    // Test 2: Actualización por segundo
    // ----------------------------------------------------
    it('2. Debe actualizar el contador después de avanzar 1 segundo', async () => {
        
        const wrapper = mount(CountdownTimer, {
            props: {
                targetDate: TARGET_DATE,
            },
        });
        
        await nextTick();
        vi.advanceTimersByTime(0); // Inicializar valores

        // Comprobación inicial (Segundos: 30)
        expect(getCounterText(wrapper)).toContain(':30Segundos');
        
        // Avanza 1 segundo
        vi.advanceTimersByTime(1000);
        await nextTick();
        
        // Comprueba que los segundos son 29
        expect(getCounterText(wrapper)).toContain(':29Segundos');
        
        // Avanza 10 segundos adicionales
        vi.advanceTimersByTime(10000);
        await nextTick();

        // Ahora deberían ser 19 segundos.
        expect(getCounterText(wrapper)).toContain(':19Segundos');
    });

    // ----------------------------------------------------
    // Test 3: Finalización de la cuenta atrás
    // ----------------------------------------------------
    it('3. Debe finalizar la cuenta atrás y mostrar el mensaje de evento terminado', async () => {
        
        const wrapper = mount(CountdownTimer, {
            props: {
                targetDate: TARGET_DATE,
            },
        });
        
        await nextTick();
        vi.advanceTimersByTime(0); // Inicializar valores

        // 1 día 2h 30m 30s = 95430000 ms
        const totalRemainingMs = 
            (1 * 24 * 3600 + 2 * 3600 + 30 * 60 + 30) * 1000;
        
        expect(wrapper.find('.timer-display').exists()).toBe(true);
        
        // Avanza el tiempo total restante + 1 ms para forzar la finalización
        vi.advanceTimersByTime(totalRemainingMs + 1);
        
        await nextTick();

        // Comprueba que la cuenta atrás ha desaparecido
        expect(wrapper.find('.timer-display').exists()).toBe(false);
        
        // Comprueba que el mensaje de finalización está visible
        const finishedMessage = wrapper.find('.finished-message');
        expect(finishedMessage.exists()).toBe(true);
        expect(finishedMessage.text()).toBe('¡El evento ha comenzado!');
 
        expect(vi.getTimerCount()).toBe(0);
    });
});