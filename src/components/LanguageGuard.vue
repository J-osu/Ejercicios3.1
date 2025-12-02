<!-- src/components/LanguageGuard.vue -->
<template>
  <div class="p-4 text-center">
    <h3 class="text-primary">Guardia de Idioma Activa</h3>
    <p>Comprobando URL para el parámetro <code class="bg-light p-1 rounded">?lang=</code>. <br>Revisa la consola y la URL.</p>
  </div>
</template>

<script setup lang="ts">
import { useLanguageRedirect } from '../composables/useLanguageRedirect';

// Ejecutar la lógica del Composable al montar el componente
useLanguageRedirect();
</script>