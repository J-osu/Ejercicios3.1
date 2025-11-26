<template>
  <div class="progress-container">
    <!-- El estilo dinámico vincula el ancho al porcentaje de scrollProgress -->
    <div 
      class="progress-bar" 
      :style="{ width: scrollProgress + '%' }"
      role="progressbar"
      :aria-valuenow="scrollProgress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Progreso de lectura de la página"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 1. Ref para almacenar el porcentaje de scroll (0 a 100)
const scrollProgress = ref(0);

// 2. Implementa la Lógica de Cálculo
const updateScrollProgress = () => {
  // Altura Total del Contenido
  const scrollHeight = document.documentElement.scrollHeight;
  // Altura de la Ventana Visible
  const clientHeight = document.documentElement.clientHeight;
  // Scroll Actual desde la parte superior
  const scrollActual = window.scrollY;

  // Distancia total que el usuario puede desplazar la página
  const scrollableDistance = scrollHeight - clientHeight;

  if (scrollableDistance > 0) {
    // Fórmula para calcular el porcentaje
    let progress = (scrollActual / scrollableDistance) * 100;
    
    // Aseguramos que el valor no sea mayor que 100 o menor que 0
    progress = Math.min(100, Math.max(0, progress));
    
    // Actualiza el ref reactivo
    scrollProgress.value = progress;
  } else {
    // Caso de páginas muy cortas: si no hay scroll, el progreso es 100%
    scrollProgress.value = 100;
  }
};

// 3. Vincula la Lógica a los Eventos del Navegador
onMounted(() => {
  // Inicializar el valor al montar
  updateScrollProgress();
  // Conectar al evento 'scroll'
  window.addEventListener('scroll', updateScrollProgress);
  // También es útil conectarlo al resize, por si la altura de la ventana cambia.
  window.addEventListener('resize', updateScrollProgress); 
});

// 4. Limpieza crucial para evitar fugas de memoria
onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress);
  window.removeEventListener('resize', updateScrollProgress);
});
</script>

<style scoped>
/* Estilos para posicionar la barra de forma fija en la parte superior */
.progress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px; /* El grosor de la barra */
  background-color: #eee;
  z-index: 9999; /* Asegura que esté por encima de todos los elementos */
}

.progress-bar {
  height: 100%;
  background-color: #42b883; /* El color verde de Vue.js :) */
  transition: width 0.1s ease-out; /* Animación suave al actualizar el progreso */
  width: 0%; /* El valor inicial */
}
</style>