import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import SearchFilter from '../../components/SearchFilter.vue'; 

// 1. DATOS CORREGIDOS: Coinciden con los 9 ítems de la versión autónoma de SearchFilter.vue
const mockItems = [
    { id: 101, name: 'Apple MacBook Pro' },
    { id: 102, name: 'Google Pixel 8' },
    { id: 103, name: 'Samsung Galaxy S24' },
    { id: 104, name: 'Sony PlayStation 5' },
    { id: 105, name: 'Microsoft Surface' },
    { id: 106, name: 'AirPods Max Pro' }, // ¡Este es el ítem problemático!
    { id: 107, name: 'iPhone 15' },
    { id: 108, name: 'Intel Core i9' },
    { id: 109, name: 'AMD Ryzen 7' },
];

describe('SearchFilter.vue', () => {
    let wrapper: VueWrapper<any>;
    
    // Asumimos que el componente usa props (aunque la versión autónoma no las use, la estructura del test sí las necesita)
    beforeEach(() => {
        wrapper = mount(SearchFilter, {
            props: {
                items: mockItems // Pasamos los 9 datos
            }
        }); 
    });

    // ----------------------------------------------------------------
    // TEST DE FILTRADO
    // ----------------------------------------------------------------

    it('debe mostrar la lista completa inicialmente', () => {
        // CORRECCIÓN 1: La lista ahora debe tener 9 elementos
        expect(wrapper.findAll('.results-list li')).toHaveLength(mockItems.length); // Espera 9
    });

    it('debe filtrar los elementos correctamente basado en el query (insensible a mayúsculas)', async () => {
        const searchInput = wrapper.find('.search-input');
        
        // Simular la escritura de "pro" (debería filtrar 2: MacBook Pro, AirPods Max Pro)
        await searchInput.setValue('pro');

        const filteredList = wrapper.findAll('.results-list li');
        
        // La lista filtrada tiene 2 resultados
        expect(filteredList).toHaveLength(2);
        
        // Aserción 1: El primero es "Apple MacBook Pro"
        expect(filteredList[0]!.text()).toContain('Apple MacBook Pro');
        
        // CORRECCIÓN 2: El segundo ítem es 'AirPods Max Pro'
        expect(filteredList[1]!.text()).toContain('AirPods Max Pro'); 
    });

    it('debe mostrar "No se encontraron coincidencias" si el filtro no devuelve resultados', async () => {
        const searchInput = wrapper.find('.search-input');
        await searchInput.setValue('XYZ_no_existe');
        // El número de elementos <li> debe ser 1 (solo el mensaje 'no-results')
        expect(wrapper.findAll('.results-list li')).toHaveLength(1); 
        expect(wrapper.find('.no-results').text()).toContain('No se encontraron coincidencias para "XYZ_no_existe"');
    });

    // ----------------------------------------------------------------
    // TEST DE RESALTADO
    // ----------------------------------------------------------------

    it('debe contener la etiqueta <mark> con la clase "highlight" en las coincidencias', async () => {
        const searchInput = wrapper.find('.search-input');
        await searchInput.setValue('APple'); 

        const filteredList = wrapper.findAll('.results-list li');
        expect(filteredList).toHaveLength(1);
        
        const firstItem = filteredList[0]!; 
        const innerHTML = firstItem.find('span:first-child').html();

        // Verifica que la etiqueta <mark> envuelve la capitalización original ("Apple")
        expect(innerHTML).toContain('<mark class="highlight">Apple</mark> MacBook Pro');
    });

// En src/test/unit/SearchFilter.test.ts

it('debe resaltar múltiples coincidencias dentro del mismo texto', async () => {
    const searchInput = wrapper.find('.search-input');
    await searchInput.setValue('Pro'); 
    
    const filteredList = wrapper.findAll('.results-list li');
    // Esperamos 2 resultados: MacBook Pro, AirPods Max Pro
    expect(filteredList).toHaveLength(2);
    
    // Seleccionar el segundo resultado ("AirPods Max Pro")
    const secondItem = filteredList[1]!; 
    
    // Obtener el HTML dentro del primer <span> del <li>
    const innerHTML = secondItem.find('span:first-child').html();
    expect(innerHTML).toContain('AirPods Max <mark class="highlight">Pro</mark>');
});
});