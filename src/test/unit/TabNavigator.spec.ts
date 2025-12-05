import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach, type MockedFunction } from 'vitest';
import TabNavigator from '../../components/TabNavigator.vue';

let pushStateSpy: MockedFunction<typeof history.pushState>;

describe('TabNavigator.vue - Simulación SPA', () => {

  beforeEach(() => {
    pushStateSpy = vi.spyOn(history, 'pushState').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Verifica que changeTab llama a history.pushState y actualiza el contenido', async () => {
    const wrapper = mount(TabNavigator);

    await wrapper.vm.$nextTick();
    
    const facturacionButton = wrapper.findAll('button')
      .find(b => b.text().includes('Facturación'));
        
    expect(facturacionButton).toBeDefined();

    await facturacionButton?.trigger('click');

    expect(pushStateSpy).toHaveBeenCalledTimes(2);

    expect(pushStateSpy).toHaveBeenLastCalledWith(
      { tab: 'facturacion' }, 
      '', 
      '/settings/facturacion'
    );

    const facturacionContent = wrapper.find('.bg-green-50');
    expect(facturacionContent.exists()).toBe(true);
    expect(facturacionContent.find('h2').text()).toBe('Contenido de Facturación');
    
    expect(wrapper.find('.bg-blue-50').exists()).toBe(false);
  });
});