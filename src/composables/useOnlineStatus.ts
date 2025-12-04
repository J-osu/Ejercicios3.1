import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Composable que informa sobre el estado de conexión del navegador,
 * utilizando solo la propiedad síncrona navigator.onLine y sus eventos.
 * @returns { isOnline: Ref<boolean> } El estado actual de la conexión.
 */
export function useOnlineStatus() {
  
  // 1. Inicializar el ref con el valor síncrono actual de navigator.onLine
  const isOnline = ref(navigator.onLine);

  // Funciones de manejo de eventos síncronas
  const setOnline = () => {
    isOnline.value = true;
  };

  const setOffline = () => {
    isOnline.value = false;
  };

  onMounted(() => {
    // Esencial para la prueba: Asegurar que los listeners se añaden
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);
  });

  onUnmounted(() => {
    // Limpieza: Remover los event listeners
    window.removeEventListener('online', setOnline);
    window.removeEventListener('offline', setOffline);
  });

  return {
    isOnline,
  };
}
