<template>
  <div class="container py-5">
    
    <h1 class="text-center mb-4 fw-bold text-secondary">Acciones de Navegación</h1>
    <p class="text-center lead text-muted mb-5">
      Este componente llama a métodos reales de <code class="bg-warning p-1 rounded">window.location</code>.
      <br>
      <strong>ATENCIÓN:</strong> El botón "Recargar" reiniciará la página. El botón "Ir" te llevará a una URL externa.
    </p>

    <!-- 1. El Componente de Herramientas de Navegación -->
    <NavigationTools />

    <!-- 2. Sección de Diagnóstico (Información de la ubicación actual) -->
    <div class="mt-5 pt-4 border-top">
        <h4 class="text-primary mb-3">Diagnóstico Actual (Desarrollo)</h4>
        <p class="small text-muted">
            La URL base es: <span class="fw-bold text-break">{{ currentUrl }}</span>.
            <br>
            Al hacer clic en "Recargar Página", verás una recarga completa del navegador.
        </p>
        <p class="small text-danger">
             Si estás en el entorno de pruebas unitarias (Vitest), el mock previene estas acciones. 
             Prueba este componente ejecutando la aplicación con `npm run dev`.
        </p>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import NavigationTools from '../components/NavigationTools.vue'; 

export default defineComponent({
  name: 'NavigationTestView',
  components: {
    NavigationTools, // Importamos el componente a probar
  },
  setup() {
    const currentUrl = ref('');

    onMounted(() => {
        // Obtenemos la URL actual para fines de diagnóstico
        currentUrl.value = window.location.href;
    });

    return {
      currentUrl,
    };
  },
});
</script>