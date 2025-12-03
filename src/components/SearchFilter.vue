<script setup lang="ts">
import { ref, computed } from 'vue';

// ----------------------------------------------------------------------
// DATA DE PRUEBA INTERNA (Para que funcione de forma autónoma)
// ----------------------------------------------------------------------
interface Item {
    id: number;
    name: string;
}

const itemsData: Item[] = [
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

const searchQuery = ref('');

// ----------------------------------------------------------------------
// LÓGICA DE FILTRADO Y RESALTADO
// ----------------------------------------------------------------------

const highlightMatches = (text: string): string => {
    if (!searchQuery.value) {
        return text;
    }

    const escapedQuery = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedQuery, 'gi');

    return text.replace(regex, (match) => `<mark class="highlight">${match}</mark>`);
};

const filteredItems = computed(() => {
    if (!searchQuery.value) {
        return itemsData;
    }

    const query = searchQuery.value.toLowerCase();

    return itemsData.filter(item => {
        return item.name.toLowerCase().includes(query);
    });
});
</script>

<template>
    <div class="search-filter-container">
        <h2>Filtro de Búsqueda y Resaltado (Prueba Autónoma)</h2>
        
        <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Escribe para filtrar y resaltar..."
            class="search-input"
        />

        <p class="status-text">
            Mostrando {{ filteredItems.length }} de {{ itemsData.length }} resultados. 
        </p>

        <ul class="results-list">
            <li v-for="item in filteredItems" :key="item.id">
                <span v-html="highlightMatches(item.name)"></span>
                <span class="item-id"> (ID: {{ item.id }})</span>
            </li>
            <li v-if="filteredItems.length === 0" class="no-results">
                No se encontraron coincidencias para "{{ searchQuery }}".
            </li>
        </ul>
    </div>
</template>

<style scoped>
.search-filter-container {
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.search-filter-container h2 {
    color: black;
}

.search-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
}

.results-list {
    list-style: none;
    padding: 0;
}

.results-list li {
    padding: 8px 0;
    border-bottom: 1px dotted #eee;
    font-size: 1em;
    color: black;
}

.results-list li:last-child {
    border-bottom: none;
}

.no-results {
    color: #cc0000;
    font-style: italic;
    padding: 10px 0;
}

.status-text {
    font-size: 0.9em;
    color: #666;
    margin-top: 0;
}
</style>