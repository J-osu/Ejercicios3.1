import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach, type MockedFunction } from 'vitest';
import TabNavigator from '../../components/TabNavigator.vue';

// Define el tipo de la función mockeada de history.pushState
let pushStateSpy: MockedFunction<typeof history.pushState>;

describe('TabNavigator.vue - Simulación SPA', () => {

  beforeEach(() => {
    // Mockea history.pushState antes de cada prueba
    // Esto previene la navegación real y nos permite espiar las llamadas.
    pushStateSpy = vi.spyOn(history, 'pushState').mockImplementation(() => {});
  });

  afterEach(() => {
    // Limpia todos los mocks después de cada prueba
    vi.restoreAllMocks();
  });

  it('Verifica que changeTab llama a history.pushState y actualiza el contenido', async () => {
    // 1. Montar el componente.
    const wrapper = mount(TabNavigator);

    // Esperar a que se ejecute onMounted, que llama a pushState para la pestaña inicial ('perfil').
    await wrapper.vm.$nextTick();
    
    // 2. Simular un clic en el botón de la pestaña "Facturación".
    // Los botones están definidos en el template con v-for, por lo que los encontramos por su texto.
    const facturacionButton = wrapper.findAll('button').find(b => b.text().includes('facturacion'));
    
    expect(facturacionButton).toBeDefined();

    await facturacionButton?.trigger('click');

    // 3. Comprobar que pushState fue llamado DOS veces: 
    //    1. Una vez en onMounted para la pestaña inicial ('perfil').
    //    2. Una vez por el clic en 'facturacion'.
    expect(pushStateSpy).toHaveBeenCalledTimes(2);

    // 4. Comprobar que fue llamado con los argumentos correctos (verificando la última llamada, que es la del clic).
    expect(pushStateSpy).toHaveBeenLastCalledWith(
      { tab: 'facturacion' }, 
      '', 
      '/settings/facturacion'
    );

    // 5. Verifica que el contenido de la pestaña de facturación está visible en el DOM.
    // Buscamos el título específico de la pestaña de Facturación (fondo verde).
    const facturacionContent = wrapper.find('.bg-green-50');
    expect(facturacionContent.exists()).toBe(true);
    expect(facturacionContent.find('h2').text()).toBe('Contenido de Facturación');
    
    // Opcional: Asegurarse de que el contenido anterior (perfil, azul) ya no está visible.
    expect(wrapper.find('.bg-blue-50').exists()).toBe(false);
  });
});