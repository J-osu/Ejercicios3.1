import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach, type MockedFunction } from 'vitest';
import HistoryControls from '../../components/HistoryControls.vue';

// 1. Mockea los métodos y la propiedad length del objeto history.
let backSpy: MockedFunction<typeof history.back>;
let forwardSpy: MockedFunction<typeof history.forward>;
let goSpy: MockedFunction<typeof history.go>;
let originalHistoryLength: number;

describe('HistoryControls.vue', () => {

  beforeEach(() => {
    // Almacenar el valor original de history.length antes de mockear
    originalHistoryLength = window.history.length;
    
    // Mockear history.length para simular un historial con entradas
    Object.defineProperty(window.history, 'length', {
      value: 5,
      writable: true, // Esto es importante para poder reasignar el valor original
    });

    // Definir los spies en los métodos de history
    backSpy = vi.spyOn(history, 'back').mockImplementation(() => {});
    forwardSpy = vi.spyOn(history, 'forward').mockImplementation(() => {});
    goSpy = vi.spyOn(history, 'go').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restaurar los mocks después de cada prueba
    vi.restoreAllMocks();
    
    // Restaurar el valor original de history.length
    Object.defineProperty(window.history, 'length', {
      value: originalHistoryLength,
      writable: true,
    });
  });

  it('Muestra la longitud correcta del historial al montar', async () => {
    // history.length fue mockeado a 5 en beforeEach
    const wrapper = mount(HistoryControls);
    
    // El valor se lee en onMounted. Debemos esperar a que Vue actualice el DOM.
    await wrapper.vm.$nextTick();
    
    // Verificar que el texto del historial es 5
    const historyLengthDisplay = wrapper.find('.bg-blue-50 p').text();
    expect(historyLengthDisplay).toContain('5');
  });

  it('Llama a history.back() al hacer clic en el botón "Atrás"', async () => {
    // Montar el componente
    const wrapper = mount(HistoryControls);
    
    // Buscar el botón 'Atrás'. Se usa el texto para identificarlo de forma única.
    const backButton = wrapper.findAll('button').find(b => b.text().includes('Atrás') && !b.text().includes('2 páginas'));
    
    expect(backButton).toBeDefined();

    // Simular el clic
    await backButton?.trigger('click');

    // Comprobar que backSpy fue llamado exactamente una vez
    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(forwardSpy).not.toHaveBeenCalled();
    expect(goSpy).not.toHaveBeenCalled();
  });

  it('Llama a history.forward() al hacer clic en el botón "Adelante"', async () => {
    // Montar el componente
    const wrapper = mount(HistoryControls);
    
    // Buscar el botón 'Adelante'
    const forwardButton = wrapper.findAll('button').find(b => b.text().includes('Adelante'));
    
    expect(forwardButton).toBeDefined();

    // Simular el clic
    await forwardButton?.trigger('click');

    // Comprobar que forwardSpy fue llamado exactamente una vez
    expect(forwardSpy).toHaveBeenCalledTimes(1);
    expect(backSpy).not.toHaveBeenCalled();
    expect(goSpy).not.toHaveBeenCalled();
  });

  it('Llama a history.go(-2) al hacer clic en el botón "Ir 2 páginas atrás"', async () => {
    // Montar el componente
    const wrapper = mount(HistoryControls);
    
    // Buscar el botón 'Ir 2 páginas Atrás'
    const go2BackButton = wrapper.findAll('button').find(b => b.text().includes('Ir 2 páginas Atrás'));
    
    expect(go2BackButton).toBeDefined();

    // Simular el clic
    await go2BackButton?.trigger('click');

    // Comprobar que goSpy fue llamado exactamente una vez con el argumento correcto
    expect(goSpy).toHaveBeenCalledTimes(1);
    expect(goSpy).toHaveBeenCalledWith(-2);
    expect(backSpy).not.toHaveBeenCalled();
    expect(forwardSpy).not.toHaveBeenCalled();
  });
});