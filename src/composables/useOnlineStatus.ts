import { ref, onMounted, onUnmounted } from 'vue';

export function useOnlineStatus() {
  
  const enlinea = ref(navigator.onLine);

  const prendido = () => {
    enlinea.value = true;
    console.log('CONEXIÓN RECUPERADA: Online');
  };

  const apagado = () => {
    enlinea.value = false;
    console.log('CONEXIÓN PERDIDA: Offline');
  };

  onMounted(() => {
    window.addEventListener('online', prendido);
    window.addEventListener('offline', apagado);
  });

  onUnmounted(() => {
    window.removeEventListener('online', prendido);
    window.removeEventListener('offline', apagado);
  });

  return {
    isOnline: enlinea,
  };
}