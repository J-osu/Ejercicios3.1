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
    const limiteBoton = 200;
    const guardar = ref(0);
    const visibilidad = computed(() => {
      return guardar.value > limiteBoton;
    });
    const handleScroll = () => {
      guardar.value = window.scrollY;
    };
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };
    onMounted(() => {
      handleScroll();
      window.addEventListener('scroll', handleScroll);
    });

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
.scroll-to-top-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
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