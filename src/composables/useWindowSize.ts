import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

export function useWindowSize(): { width: Ref<number>; height: Ref<number> } {
  // 1. Inicialización de los Refs
  // Inicializamos los valores con 0 como estado por defecto antes del montaje.
  const ancho = ref(0);
  const alto = ref(0);

  // Función manejadora que actualiza los refs con las dimensiones actuales
  const actuTamaño = () => {
    ancho.value = window.innerWidth;
    alto.value = window.innerHeight;
  };

  // 2. onMounted: Conexión al navegador
  onMounted(() => {
    // 2.1. Inicializar los valores la primera vez
    actuTamaño(); 
    
    // 2.2. Añadir el listener para actualizaciones en tiempo real
    window.addEventListener('resize', actuTamaño);
  });

  // 3. onUnmounted: Limpieza crucial para evitar fugas de memoria
  onUnmounted(() => {
    window.removeEventListener('resize', actuTamaño);
  });

  return {
    width: ancho,
    height: alto,
  };
}