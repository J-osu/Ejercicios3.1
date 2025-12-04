<script setup lang="ts">
import { ref, computed } from 'vue';

interface Elemento {
    name: string;
}

const datosElementos: Elemento[] = [
    {name: 'Apple MacBook Pro' },
    {name: 'Google Pixel 8' },
    {name: 'Samsung Galaxy S24' },
    {name: 'Sony PlayStation 5' },
    {name: 'Microsoft Surface' },
    {name: 'AirPods Max Pro' },
    {name: 'iPhone 15' },
    {name: 'Intel Core i9' },
    {name: 'AMD Ryzen 7' },
];

const consultaBusqueda = ref('');

const resaltarCoincidencias = (texto: string): string => {
    if (!consultaBusqueda.value) {
        return texto;
    }

    const consultaEscape = consultaBusqueda.value.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
    const regex = new RegExp(`(${consultaEscape})`, 'gi');
    return texto.replace(regex, '<mark class="highlight">$1</mark>');

};

const elementosFiltrados = computed(() => {
    if (!consultaBusqueda.value) {
        return datosElementos;
    }

    const consultaMinusculas = consultaBusqueda.value.toLowerCase();
    
    return datosElementos.filter(elemento => {
        return elemento.name.toLowerCase().includes(consultaMinusculas);
    });
});
</script>

<template>
    <div class="search-filter-container">
        <h2>Búsqueda con Filtro de Texto</h2>
        
        <input
            type="text"
            v-model="consultaBusqueda"
            placeholder="Escribe para buscar..."
            class="search-input"
        />

        <p class="status-text">
            Mostrando {{ elementosFiltrados.length }} de {{ datosElementos.length }} resultados. 
        </p>

        <ul class="results-list">
            <li v-for="elemento in elementosFiltrados"  >
                <span class="item-nombre" v-html="resaltarCoincidencias(elemento.name)"></span>
            </li>
            <li v-if="elementosFiltrados.length === 0" class="no-results">
                No se encontraron coincidencias para "{{ consultaBusqueda }}".
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

.status-text {
    margin-bottom: 10px;
    color: #555;
}

.results-list {
    list-style: none;
    padding: 0;
}

.results-list li {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    font-size: 1.1em;
}

.results-list li:last-child {
    border-bottom: none;
}
.item-nombre{
    color: #555;
}
.item-id {
    color: #aaa;
    font-size: 0.8em;
}

.no-results {
    color: #e74c3c;
    font-style: italic;
    padding: 10px 0;
}

/* El estilo de la etiqueta <mark> se puede anular globalmente o usar un :deep() */
:deep(mark) {
    background-color: #fcf8e3;
    padding: 2px 0;
    border-radius: 2px;
}
</style>