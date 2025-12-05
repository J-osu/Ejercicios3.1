import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

export function useWindowSize(): { width: Ref<number>; height: Ref<number> } {
  const ancho = ref(0);
  const alto = ref(0);
  const actuTamaño = () => {
    ancho.value = window.innerWidth;
    alto.value = window.innerHeight;
  };

  onMounted(() => {
    actuTamaño(); 
    window.addEventListener('resize', actuTamaño);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', actuTamaño);
  });

  return {
    width: ancho,
    height: alto,
  };
}