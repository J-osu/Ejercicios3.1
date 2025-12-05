import { mount } from '@vue/test-utils';
import CopyToClipboard from '../../components/CopyToClipboard.vue';
import { vi, describe, test, expect, afterEach, beforeAll } from 'vitest';

// 🔴 1. Definir el Mock para el Clipboard
const mockClipboard = {
    writeText: vi.fn(),
};

// Guardamos el objeto navigator original para restaurar
const originalNavigator = { ...global.navigator };

// 🔴 2. Asignar el Mock al objeto navigator global antes de que el componente se monte
beforeAll(() => {
    Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        configurable: true,
        writable: true,
    });
});

afterEach(() => {
    // Limpiar el estado de los espías después de cada test
    mockClipboard.writeText.mockClear();
    // Reestablecer los temporizadores falsos
    vi.useRealTimers();
});


describe('CopyToClipboard.vue', () => {
    const TEST_TEXT = 'Mi código secreto 12345';

    // TEST 1: Caso de Éxito (Promesa resuelta)
    test('1. Debe mostrar "¡Copiado!" si writeText resuelve la promesa', async () => {
        // Mockear éxito: writeText debe devolver una Promesa resuelta
        mockClipboard.writeText.mockResolvedValue(undefined);

        const wrapper = mount(CopyToClipboard, {
            props: { textToCopy: TEST_TEXT },
        });

        // 1. Simular clic en el botón
        await wrapper.find('button').trigger('click');

        // 2. Verificar que la función nativa fue llamada con el texto correcto
        expect(mockClipboard.writeText).toHaveBeenCalledWith(TEST_TEXT);
        
        // 3. Esperar la actualización asíncrona del DOM
        await wrapper.vm.$nextTick(); 

        // 4. Comprobar el mensaje de éxito
        expect(wrapper.find('.badge').text()).toBe('¡Copiado!');
    });

    // TEST 2: Caso de Error (Promesa rechazada)
    test('2. Debe mostrar "Error al copiar" si writeText rechaza la promesa', async () => {
        // Mockear error: writeText debe devolver una Promesa rechazada
        mockClipboard.writeText.mockRejectedValue(new Error('Permiso denegado'));

        const wrapper = mount(CopyToClipboard, {
            props: { textToCopy: TEST_TEXT },
        });

        // 1. Simular clic en el botón
        await wrapper.find('button').trigger('click');

        // 2. Esperar la actualización asíncrona del DOM (manejo del catch)
        await wrapper.vm.$nextTick(); 

        // 3. Comprobar el mensaje de error
        expect(wrapper.find('.badge').text()).toBe('Error al copiar');
    });

    // TEST 3: Limpieza del Mensaje (Temporizadores)
    test('3. El mensaje de feedback debe limpiarse después de 2 segundos', async () => {
        vi.useFakeTimers(); // Habilitar temporizadores falsos para control de tiempo
        mockClipboard.writeText.mockResolvedValue(undefined);

        const wrapper = mount(CopyToClipboard, {
            props: { textToCopy: TEST_TEXT },
        });

        await wrapper.find('button').trigger('click');
        await wrapper.vm.$nextTick(); 
        
        // El mensaje existe después del clic
        expect(wrapper.find('.badge').exists()).toBe(true);

        // Avanzar el tiempo simulado (2000 ms)
        vi.advanceTimersByTime(2000);

        // Esperar el tick de setTimeout
        await wrapper.vm.$nextTick();

        // El mensaje ya no debe existir
        expect(wrapper.find('.badge').exists()).toBe(false);
    });
});