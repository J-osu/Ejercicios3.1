import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import SearchFilter from '../../components/SearchFilter.vue'; 

const mockItems = [
    { id: 101, name: 'Apple MacBook Pro' },
    { id: 102, name: 'Google Pixel 8' },
    { id: 103, name: 'Samsung Galaxy S24' },
    { id: 104, name: 'Sony PlayStation 5' },
    { id: 105, name: 'Microsoft Surface' },
    { id: 106, name: 'AirPods Max Pro' }, 
    { id: 107, name: 'iPhone 15' },
    { id: 108, name: 'Intel Core i9' },
    { id: 109, name: 'AMD Ryzen 7' },
];

describe('SearchFilter.vue', () => {
    let wrapper: VueWrapper<any>;
    
    beforeEach(() => {
        wrapper = mount(SearchFilter, {
            props: {
                items: mockItems 
            }
        }); 
    });


    it('debe mostrar la lista completa inicialmente', () => {
        expect(wrapper.findAll('.results-list li')).toHaveLength(mockItems.length); 
    });

    it('debe filtrar los elementos correctamente basado en el query (insensible a mayúsculas)', async () => {
        const searchInput = wrapper.find('.search-input');
        
        await searchInput.setValue('pro');

        const filteredList = wrapper.findAll('.results-list li');
        
        expect(filteredList).toHaveLength(2);
        
        expect(filteredList[0]!.text()).toContain('Apple MacBook Pro');
        
        expect(filteredList[1]!.text()).toContain('AirPods Max Pro'); 
    });

    it('debe mostrar "No se encontraron coincidencias" si el filtro no devuelve resultados', async () => {
        const searchInput = wrapper.find('.search-input');
        await searchInput.setValue('XYZ_no_existe');
        expect(wrapper.findAll('.results-list li')).toHaveLength(1); 
        expect(wrapper.find('.no-results').text()).toContain('No se encontraron coincidencias para "XYZ_no_existe"');
    });


    it('debe contener la etiqueta <mark> con la clase "highlight" en las coincidencias', async () => {
        const searchInput = wrapper.find('.search-input');
        await searchInput.setValue('APple'); 

        const filteredList = wrapper.findAll('.results-list li');
        expect(filteredList).toHaveLength(1);
        
        const firstItem = filteredList[0]!; 
        const innerHTML = firstItem.find('span:first-child').html();

        expect(innerHTML).toContain('<mark class="highlight">Apple</mark> MacBook Pro');
    });


it('debe resaltar múltiples coincidencias dentro del mismo texto', async () => {
    const searchInput = wrapper.find('.search-input');
    await searchInput.setValue('Pro'); 
    
    const filteredList = wrapper.findAll('.results-list li');
    expect(filteredList).toHaveLength(2);
    
    const secondItem = filteredList[1]!; 
    
    const innerHTML = secondItem.find('span:first-child').html();
    expect(innerHTML).toContain('AirPods Max <mark class="highlight">Pro</mark>');
});
});