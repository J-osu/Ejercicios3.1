<!-- src/components/SmartRedirector.vue -->
<template>
  <div class="card p-4 shadow-sm my-4 bg-light">
    <h3 class="text-primary mb-4 fw-bold">🚦 Componente de Redirección Inteligente</h3>
    <p class="lead">
      Comprobando entorno y forzando HTTPS...
    </p>
    <p class="small text-muted">
        Si el componente se monta sin redirección, su lógica se ejecutó correctamente.
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  // 1. Prioridad 1: Comprobación de HTTPS (Seguridad)
  if (window.location.protocol === 'http:') {
    console.warn('Protocolo HTTP detectado. Forzando redirección a HTTPS...');
    window.location.href = window.location.href.replace('http://', 'https://');
    return; // Detenemos la ejecución
  }

  // 2. Prioridad 2: Detección del Navegador (solo si ya estamos en HTTPS)
  const uAgent = navigator.userAgent;
  let tPath = '';

  if (uAgent.includes('Firefox')) {
    // Redirección específica para Firefox
    tPath = '/pagina-para-firefox';
    console.info('Navegador Firefox detectado. Redirigiendo a:', tPath);
  } else if (uAgent.includes('Chrome') && !uAgent.includes('Edg')) {
    // Redirección específica para Chrome (excluyendo Edge, que también contiene 'Chrome')
    tPath = '/pagina-para-chrome';
    console.info('Navegador Chrome detectado. Redirigiendo a:', tPath);
  } 
  
  // 3. Ejecutar la redirección final si se encontró una ruta objetivo
  if (tPath) {
    // Usamos location.assign() para modificar el historial de navegación
    window.location.assign(tPath);
  }
});
</script>