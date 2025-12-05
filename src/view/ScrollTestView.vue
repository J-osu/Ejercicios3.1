<template>
  <div class="container py-5">
    <h1 class="text-center mb-4 fw-bold text-secondary">Página de Prueba de Scroll</h1>
    <p class="text-center lead text-muted">Desplázate hacia abajo para ver aparecer el botón "Volver Arriba".</p>

    <div class="alert alert-info text-center sticky-top-custom shadow-sm mb-4">
      <h5 class="mb-0">Posición Actual del Scroll: {{ currentScrollY }} px</h5>
      <p class="small mb-0">El botón aparecerá al superar los 200px.</p>
    </div>

    <div v-for="section in 10" :key="section" class="card mb-4 shadow-sm">
      <div class="card-body">
        <h3 class="card-title text-primary">Sección de Contenido #{{ section }}</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. 
          Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. 
          Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. 
          Curabitur sodales ligula in libero. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor.
        </p>
        <p>
          Etiam leo eu elit. Pellentesque auctor, ipsum eu accumsan porttitor, nisl risus mattis est, ut consequat lectus libero eu sem. Donec at urna id tellus 
          varius volutpat. Mauris eget tellus in mauris interdum egestas. Nam id dui id elit tincidunt mattis. Sed nec arcu. Sed est.
        </p>
      </div>
    </div>
    
    <ScrollToTopButton />

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import ScrollToTopButton from '../components/ScrollToTopButton.vue';

export default defineComponent({
  name: 'ScrollTestView',
  components: {
    ScrollToTopButton,
  },
  setup() {
    const currentScrollY = ref(0);

    // Lógica para monitorizar y mostrar el scrollY (solo para fines de prueba/depuración)
    const updateScrollY = () => {
        currentScrollY.value = window.scrollY;
    };

    onMounted(() => {
        updateScrollY();
        window.addEventListener('scroll', updateScrollY);
    });

    onUnmounted(() => {
        window.removeEventListener('scroll', updateScrollY);
    });

    return {
      currentScrollY,
    };
  },
});
</script>

<style scoped>
/* Estilo para que el monitor de scroll se quede fijo en la parte superior */
.sticky-top-custom {
    position: sticky;
    top: 20px; /* Separación del borde superior */
    z-index: 10;
}
</style>