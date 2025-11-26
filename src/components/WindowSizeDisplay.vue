<template>
  <div class="card p-4 shadow-sm bg-light">
    <h4 class="text-secondary fw-bold">Monitor de Dimensiones (useWindowSize)</h4>
    <p class="lead">
      Ancho: <span class="text-primary fw-bolder">{{ width }}</span> px 
      - Alto: <span class="text-primary fw-bolder">{{ height }}</span> px
    </p>
    <p class="small text-muted mt-2">
        Intenta redimensionar la ventana para ver la MÁGIA.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useWindowSize } from '../composables/useWindowSize'; // Importamos nuestro composable

export default defineComponent({
  name: 'WindowSizeDisplay',
  setup() {
    // 1. Usar el composable y obtener las referencias reactivas
    const { width, height } = useWindowSize();

    // 2. Retornar las referencias para que el template las use
    return {
      width,
      height,
    };
  },
});
</script>