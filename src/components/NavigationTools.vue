<template>
  <div class="card p-4 shadow-sm my-4 bg-light">
    <h3 class="text-primary mb-4 fw-bold">Panel de Control de Navegación</h3>
    
    <div class="mb-4">
      <button 
        @click="recargarpg" 
        class="btn btn-warning fw-bold text-dark w-100"
        aria-label="Recargar la página actual">
        <i class="bi bi-arrow-clockwise me-2"></i> Recargar Página (location.reload())
      </button>
      <small class="text-muted d-block mt-1">Llama a window.location.reload()</small>
    </div>

    <h5 class="text-secondary mb-3">Navegar a URL Externa</h5>
    <div class="input-group mb-3">
      <input 
        type="url" 
        class="form-control"
        placeholder="Escribe una URL, ej: https://google.com"
        v-model="urlexterna"
      />
      <button 
        @click="irUrl" 
        class="btn btn-primary fw-bold"
        aria-label="Ir a la URL externa">
        Ir (location.assign())
      </button>
    </div>
    <small class="text-muted d-block">URL actual: <span class="text-break">{{ urlexterna }}</span></small>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const urlexterna = ref('https://vuejs.org');

const recargarpg = () => {
  window.location.reload();
};

const irUrl = () => {
  window.location.assign(urlexterna.value);
};
</script>