<script setup lang="ts">
import { ref, onMounted } from 'vue';

const longitudHistorial = ref(0);

onMounted(() => {
  longitudHistorial.value = window.history.length;
});

const irAtras = () => {
  try {
    window.history.back();
  } catch (e) {
    console.error("Error al ir atrás en el historial. Puede que no haya una página anterior.", e);
  }
};

const irAdelante = () => {
  try {
    window.history.forward();
  } catch (e) {
    console.error("Error al ir adelante en el historial. Puede que no haya una página siguiente.", e);
  }
};

const irA = (paginas: number) => {
  try {
    window.history.go(paginas);
  } catch (e) {
    console.error(`Error al ir ${paginas} pasos. Asegúrate de que existe esa entrada en el historial.`, e);
  }
};
</script>

<template>
  <div class="p-6 max-w-lg mx-auto mt-10 bg-white shadow-xl rounded-xl border border-gray-100">
    <h1 class="text-3xl font-extrabold text-blue-600 mb-4 text-center">
      Controles de Navegación del Historial
    </h1>
    <p class="text-center text-gray-500 mb-6">
      Replica los botones del navegador usando la API <code class="bg-gray-100 p-1 rounded">window.history</code>.
    </p>

    <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p class="text-lg font-semibold text-blue-800">
        Páginas en el historial de sesión: 
        <span class="text-2xl font-bold ml-2">{{ longitudHistorial }}</span>
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      <button 
        @click="irAtras" 
        class="w-full py-3 px-4 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
      >
        <span class="mr-2">&#x25C0;</span> Atrás
      </button>
      
      <button 
        @click="irAdelante" 
        class="w-full py-3 px-4 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
      >
        Adelante <span class="ml-2">&#x25B6;</span>
      </button>
      
      <button 
        @click="irA(-2)" 
        class="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
      >
        Ir 2 páginas Atrás
      </button>
    </div>
    
    <p class="mt-6 text-xs text-gray-400 text-center">
      Nota: Para que "Atrás", "Adelante" y "Ir 2 páginas Atrás" funcionen, debes haber navegado 
      a otras URLs en el mismo origen de sesión.
    </p>
  </div>
</template>

<style scoped>
</style>