import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

/**
 * Composable reutilizable para monitorizar las dimensiones de la ventana del navegador.
 * * @returns Un objeto con referencias reactivas para el ancho (width) y alto (height).
 */
export function useWindowSize(): { width: Ref<number>; height: Ref<number> } {
  // 1. Inicialización de los Refs
  // Inicializamos los valores con 0 como estado por defecto antes del montaje.
  const width = ref(0);
  const height = ref(0);

  // Función manejadora que actualiza los refs con las dimensiones actuales
  const updateSize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  // 2. onMounted: Conexión al navegador
  onMounted(() => {
    // 2.1. Inicializar los valores la primera vez
    updateSize(); 
    
    // 2.2. Añadir el listener para actualizaciones en tiempo real
    window.addEventListener('resize', updateSize);
  });

  // 3. onUnmounted: Limpieza crucial para evitar fugas de memoria
  onUnmounted(() => {
    window.removeEventListener('resize', updateSize);
  });

  return {
    width,
    height,
  };
}