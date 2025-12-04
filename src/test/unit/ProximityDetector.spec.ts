import { mount, flushPromises } from '@vue/test-utils';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import ProximityDetector from '../../components/ProximityDetector.vue';
import { TEST_USER_LAT, TEST_USER_LON } from '../../data/mockFriends';

// 🔴 1. Variables globales para capturar los callbacks de watchPosition
let successCallback: PositionCallback | null = null;
let errorCallback: PositionErrorCallback | null = null;
let watchId: number = 1;

// 2. Mockear navigator.geolocation
const geolocationMock = {
    watchPosition: vi.fn((success, error) => {
        // Guardamos los callbacks para activarlos manualmente desde el test
        successCallback = success;
        errorCallback = error;
        return watchId; // Devolvemos un ID simulado
    }),
    clearWatch: vi.fn((id: number) => {
        if (id === watchId) {
            successCallback = null;
            errorCallback = null;
        }
    }),
    getCurrentPosition: vi.fn(), // Añadimos mock por completitud
};

beforeEach(() => {
      // Restaurar los contadores (sin cambios)
      geolocationMock.watchPosition.mockClear();
      geolocationMock.clearWatch.mockClear();
      
      // 🚨 CORRECCIÓN CRÍTICA: Definir la propiedad geolocation en navigator
      // Esto asegura que 'geolocation' existe antes de que el composable intente acceder a ella.
      Object.defineProperty(navigator, 'geolocation', {
          value: geolocationMock, // Inyectamos el objeto con nuestros espías
          writable: true,
          configurable: true,
      });
  });

afterEach(() => {
      // 🚨 LIMPIEZA: Eliminar la propiedad definida después de cada test
      Object.defineProperty(navigator, 'geolocation', {
          value: undefined,
          writable: true,
          configurable: true,
      });
      vi.restoreAllMocks();
  });


describe('ProximityDetector.vue', () => {
    
    // Coordenadas que simulan la posición del usuario:
    // Cerca de los amigos Ana y Luis
    const COORDS_NEAR = { latitude: TEST_USER_LAT, longitude: TEST_USER_LON }; 
    // Lejos de todos los amigos (Berlín)
    const COORDS_FAR = { latitude: 52.5200, longitude: 13.4050 };

    // Función auxiliar para simular la actualización de la posición
    const triggerPositionUpdate = (coords: { latitude: number, longitude: number }) => {
        if (successCallback) {
            successCallback({
                coords: { 
                    ...coords, 
                    accuracy: 10, 
                    altitude: null, 
                    altitudeAccuracy: null, 
                    heading: null, 
                    speed: null,
                    // 🚨 CORRECCIÓN: Añadir la función toJSON para cumplir con la interfaz
                    toJSON: () => coords, 
                } as GeolocationCoordinates, // Forzamos el tipo completo
                timestamp: Date.now(),
            } as GeolocationPosition); // Forzamos el tipo completo
        }
    };
    
    // TEST 1: Amigos Cercanos
    test('1. Debe mostrar amigos si la posición está dentro del radio de 1km', async () => {
        const wrapper = mount(ProximityDetector);
        
        // 1. Simular la obtención de coordenadas cercanas
        triggerPositionUpdate(COORDS_NEAR); 
        
        // 2. Esperar a que Vue reaccione a la actualización del ref (coords)
        await wrapper.vm.$nextTick(); 
        await flushPromises(); // Asegurar que todas las promesas asíncronas se resuelven

        // 3. Comprobar que los amigos cercanos aparecen
        const componentText = wrapper.text();
        expect(componentText).toContain('Ana (Cerca)');
        expect(componentText).toContain('Luis (Cerca)');
        
        // 4. Comprobar que los amigos lejanos no aparecen
        expect(componentText).not.toContain('Carlos (Muy Lejos)'); 
        expect(componentText).toContain('Amigos en el Radar (2)'); 
        expect(wrapper.find('.alert-warning').exists()).toBe(false); // No debe mostrar el mensaje de "Nadie cerca"
    });

    // TEST 2: Sin Amigos Cercanos
    test('2. Debe mostrar el mensaje de "Nadie cerca" si la posición está lejos', async () => {
        const wrapper = mount(ProximityDetector);
        
        // 1. Simular la obtención de coordenadas lejanas
        triggerPositionUpdate(COORDS_FAR); 
        
        await wrapper.vm.$nextTick();
        await flushPromises();

        // 2. Comprobar que el mensaje de ausencia es visible
        expect(wrapper.find('.alert-warning').text()).toContain('Nadie cerca por ahora.');
        expect(wrapper.text()).not.toContain('Ana (Cerca)');
        expect(wrapper.text()).toContain('Amigos en el Radar (0)');
    });
    
    // TEST 3: Limpieza (Memory Leak Prevention)
    test('3. Debe limpiar el watchPosition al desmontar', () => {
        const wrapper = mount(ProximityDetector);
        
        // 1. Desmontar el componente
        wrapper.unmount();
        
        // 2. Verificar que clearWatch fue llamado con el watchId simulado
        expect(geolocationMock.clearWatch).toHaveBeenCalledTimes(1);
        expect(geolocationMock.clearWatch).toHaveBeenCalledWith(watchId);
    });
});