<template>
  <div class="container py-5">
    
    <h1 class="text-center mb-5 fw-bold text-secondary">🧪 Entorno de Prueba: Analizador de URL</h1>
    
    <!-- 1. El Componente Analizador -->
    <UrlInspector />

    <!-- 2. Herramientas de Navegación para Pruebas -->
    <div class="card p-4 shadow-lg bg-white mt-5">
      <h4 class="mb-3 text-primary">Escenarios de Prueba</h4>
      <p class="small text-muted">
        Haz clic en los enlaces para cambiar la URL de la aplicación. 
        El Analizador de URL se actualizará automáticamente.
      </p>
      
      <div class="d-flex flex-wrap gap-3">
        <!-- Ruta Base (Ejemplo: http://localhost:5173/analyzer-test) -->
        <router-link :to="{ path: '/analyzer-test' }" 
                     class="btn btn-outline-secondary">
          Ruta Base
        </router-link>

        <!-- Ruta con Parámetros de Búsqueda -->
        <router-link :to="{ path: '/analyzer-test', query: { user: 'zeus', session: '123' } }" 
                     class="btn btn-outline-info">
          Con Parámetros (?user=zeus...)
        </router-link>

        <!-- Ruta con Subcarpetas -->
        <router-link :to="{ path: '/analyzer-test/documents/v1' }" 
                     class="btn btn-outline-success">
          Con Pathname (/documents/v1)
        </router-link>

        <!-- Ruta Compleja con todo -->
        <router-link :to="{ path: '/analyzer-test/config', query: { mode: 'dev', theme: 'dark' } }" 
                     class="btn btn-outline-warning">
          Ruta Compleja (Path + Query)
        </router-link>
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UrlInspector from '../components/UrlInspector.vue'; 

export default defineComponent({
  name: 'UrlInspectorTestView',
  components: {
    UrlInspector, // Importamos el componente a probar
  },
});
</script>