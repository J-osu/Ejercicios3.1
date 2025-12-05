<template>
  <div class="progress-container">
    <div 
      class="progress-bar" 
      :style="{ width: scrollProgresivo + '%' }"
      role="progressbar"
      :aria-valuenow="scrollProgresivo"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Progreso de lectura de la página"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const scrollProgresivo = ref(0);

const actualizarScroll = () => {
  const alto = document.documentElement.scrollHeight;
  const altura = document.documentElement.clientHeight;
  const scrollActual = window.scrollY;
  const scrollableLimite = alto - altura;

  if (scrollableLimite > 0) {
    let progress = (scrollActual / scrollableLimite) * 100;
    progress = Math.min(100, Math.max(0, progress));
    scrollProgresivo.value = progress;
  } else {
    scrollProgresivo.value = 100;
  }
};

onMounted(() => {
  actualizarScroll();
  window.addEventListener('scroll', actualizarScroll);
  window.addEventListener('resize', actualizarScroll); 
});

onUnmounted(() => {
  window.removeEventListener('scroll', actualizarScroll);
  window.removeEventListener('resize', actualizarScroll);
});
</script>

<style scoped>
.progress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background-color: #eee;
  z-index: 9999;
}

.progress-bar {
  height: 100%;
  background-color: #42b883;
  transition: width 0.1s ease-out;
  width: 0%;
}
</style>