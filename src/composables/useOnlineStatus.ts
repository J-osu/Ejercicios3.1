import { ref, onMounted, onUnmounted } from 'vue';

export function useOnlineStatus() {
  
  // 1. Inicializar el ref con el valor síncrono actual de navigator.onLine
  const enlinea = ref(navigator.onLine);

  // Funciones de manejo de eventos
  const prendido = () => {
    enlinea.value = true;
    console.log('CONEXIÓN RECUPERADA: Online');
  };

  const apagado = () => {
    enlinea.value = false;
    console.log('CONEXIÓN PERDIDA: Offline');
  };

  onMounted(() => {
    // 2. Añadir los event listeners al objeto global window
    window.addEventListener('online', prendido);
    window.addEventListener('offline', apagado);
  });

  onUnmounted(() => {
    // 3. Limpieza: Remover los event listeners cuando el componente se desmonte
    window.removeEventListener('online', prendido);
    window.removeEventListener('offline', apagado);
  });

  return {
    isOnline: enlinea,
  };
}