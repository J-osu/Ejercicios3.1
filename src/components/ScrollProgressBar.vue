<template>
  <div class="progress-container">
    <!-- El estilo dinámico vincula el ancho al porcentaje de scrollProgress -->
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

// 1. Ref para almacenar el porcentaje de scroll (0 a 100)
const scrollProgresivo = ref(0);

// 2. Implementa la Lógica de Cálculo
const actualizarScroll = () => {
  // Altura Total del Contenido
  const alto = document.documentElement.scrollHeight;
  // Altura de la Ventana Visible
  const altura = document.documentElement.clientHeight;
  // Scroll Actual desde la parte superior
  const scrollActual = window.scrollY;

  // Distancia total que el usuario puede desplazar la página
  const scrollableLimite = alto - altura;

  if (scrollableLimite > 0) {
    // Fórmula para calcular el porcentaje
    let progress = (scrollActual / scrollableLimite) * 100;
    
    // Aseguramos que el valor no sea mayor que 100 o menor que 0
    progress = Math.min(100, Math.max(0, progress));
    
    // Actualiza el ref reactivo
    scrollProgresivo.value = progress;
  } else {
    // Caso de páginas muy cortas: si no hay scroll, el progreso es 100%
    scrollProgresivo.value = 100;
  }
};

// 3. Vincula la Lógica a los Eventos del Navegador
onMounted(() => {
  // Inicializar el valor al montar
  actualizarScroll();
  // Conectar al evento 'scroll'
  window.addEventListener('scroll', actualizarScroll);
  // También es útil conectarlo al resize, por si la altura de la ventana cambia.
  window.addEventListener('resize', actualizarScroll); 
});

// 4. Limpieza crucial para evitar fugas de memoria
onUnmounted(() => {
  window.removeEventListener('scroll', actualizarScroll);
  window.removeEventListener('resize', actualizarScroll);
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