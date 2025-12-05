import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach, type MockedFunction } from 'vitest';
import HistoryControls from '../../components/HistoryControls.vue';

let backSpy: MockedFunction<typeof history.back>;
let forwardSpy: MockedFunction<typeof history.forward>;
let goSpy: MockedFunction<typeof history.go>;
let originalHistoryLength: number;

describe('HistoryControls.vue', () => {

  beforeEach(() => {
    originalHistoryLength = window.history.length;
    
    Object.defineProperty(window.history, 'length', {
      value: 5,
      writable: true,
    });

    backSpy = vi.spyOn(history, 'back').mockImplementation(() => {});
    forwardSpy = vi.spyOn(history, 'forward').mockImplementation(() => {});
    goSpy = vi.spyOn(history, 'go').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    
    Object.defineProperty(window.history, 'length', {
      value: originalHistoryLength,
      writable: true,
    });
  });

  it('Muestra la longitud correcta del historial al montar', async () => {
    const wrapper = mount(HistoryControls);
    
    await wrapper.vm.$nextTick();
    
    const historyLengthDisplay = wrapper.find('.bg-blue-50 p').text();
    expect(historyLengthDisplay).toContain('5');
  });

  it('Llama a history.back() al hacer clic en el botón "Atrás"', async () => {
    const wrapper = mount(HistoryControls);
    
    const backButton = wrapper.findAll('button').find(b => b.text().includes('Atrás') && !b.text().includes('2 páginas'));
    
    expect(backButton).toBeDefined();

    await backButton?.trigger('click');

    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(forwardSpy).not.toHaveBeenCalled();
    expect(goSpy).not.toHaveBeenCalled();
  });

  it('Llama a history.forward() al hacer clic en el botón "Adelante"', async () => {
    const wrapper = mount(HistoryControls);
    
    const forwardButton = wrapper.findAll('button').find(b => b.text().includes('Adelante'));
    
    expect(forwardButton).toBeDefined();

    await forwardButton?.trigger('click');

    expect(forwardSpy).toHaveBeenCalledTimes(1);
    expect(backSpy).not.toHaveBeenCalled();
    expect(goSpy).not.toHaveBeenCalled();
  });

  it('Llama a history.go(-2) al hacer clic en el botón "Ir 2 páginas atrás"', async () => {
    const wrapper = mount(HistoryControls);
    
    const go2BackButton = wrapper.findAll('button').find(b => b.text().includes('Ir 2 páginas Atrás'));
    
    expect(go2BackButton).toBeDefined();

    await go2BackButton?.trigger('click');

    expect(goSpy).toHaveBeenCalledTimes(1);
    expect(goSpy).toHaveBeenCalledWith(-2);
    expect(backSpy).not.toHaveBeenCalled();
    expect(forwardSpy).not.toHaveBeenCalled();
  });
});