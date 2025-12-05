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
  if (window.location.protocol === 'http:') {
    console.warn('Protocolo HTTP detectado. Forzando redirección a HTTPS...');
    window.location.href = window.location.href.replace('http://', 'https://');
    return;
  }

  const uAgent = navigator.userAgent;
  let tPath = '';

  if (uAgent.includes('Firefox')) {
    tPath = '/pagina-para-firefox';
    console.info('Navegador Firefox detectado. Redirigiendo a:', tPath);
  } else if (uAgent.includes('Chrome') && !uAgent.includes('Edg')) {
    tPath = '/pagina-para-chrome';
    console.info('Navegador Chrome detectado. Redirigiendo a:', tPath);
  } 

  if (tPath) {
    window.location.assign(tPath);
  }
});
</script>