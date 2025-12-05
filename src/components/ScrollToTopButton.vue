<template>
  <button
    v-if="isVisible"
    @click="scrollToTop"
    class="scroll-to-top-btn btn btn-primary shadow-lg"
    aria-label="Volver al inicio de la página"
    title="Volver Arriba"
  >
    <i class="bi bi-arrow-up"></i> 
  </button>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'ScrollToTopButton',
  setup() {
    // Definición del umbral de píxeles para mostrar el botón
    const limiteBoton = 200;

    // 1. Ref para almacenar la posición actual del scroll vertical
    const guardar = ref(0);

    // 2. Propiedad Computed para determinar la visibilidad
    const visibilidad = computed(() => {
      // El botón es visible si la posición es mayor que el umbral
      return guardar.value > limiteBoton;
    });

    // Función que actualiza el ref scrollY con la posición actual
    const handleScroll = () => {
      // window.scrollY es el valor estándar para la posición vertical del scroll
      guardar.value = window.scrollY;
    };

    // 3. Método para desplazar la vista hacia arriba
    const scrollToTop = () => {
      // Uso de la función nativa del objeto window
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // Desplazamiento suave para mejor UX
      });
    };

    // 4. onMounted: Añadir el listener
    onMounted(() => {
      // Inicializar el valor al montar el componente
      handleScroll();
      // Conectar al evento 'scroll'
      window.addEventListener('scroll', handleScroll);
    });

    // 5. onUnmounted: Limpiar el listener para evitar fugas de memoria
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return {
      isVisible: visibilidad,
      scrollToTop,
    };
  },
});
</script>

<style scoped>
/* Estilos para posicionar el botón de manera fija */
.scroll-to-top-btn {
  position: fixed;
  bottom: 20px; /* Separación del fondo */
  right: 20px; /* Separación de la derecha */
  z-index: 1000; /* Asegura que esté por encima de otros elementos */
  width: 50px;
  height: 50px;
  border-radius: 50%; /* Lo hace redondo */
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: gray;
  i {
    color: blue;
    font-size: 1.5rem;
  }
}
</style>