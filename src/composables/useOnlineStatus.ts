import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Composable reactivo que informa sobre el estado de conexión del navegador.
 * Monitorea los eventos 'online' y 'offline' del objeto window.
 * @returns { isOnline: Ref<boolean> } El estado actual de la conexión.
 */
// Usar un recurso de mismo origen reduce problemas de CORS en producción
const PING_URL = '/ping.txt'; // <-- Debe coincidir con el archivo en tu carpeta 'public'

async function checkRealConnectivity(): Promise<boolean> {
  // Siempre hacemos la verificación real, ya que navigator.onLine no es confiable
  try {
    const response = await fetch(PING_URL, {
        method: 'HEAD', // Solo necesitamos los headers, no el cuerpo
        cache: 'no-store' // Forzar la red
    });
    // Si la respuesta es OK (código 200-299), hay conexión
    return response.ok; 
  } catch (error) {
    // Si fetch falla (problemas de red o DNS)
    return false; 
  }
}
export function useOnlineStatus() {
  
  const isOnline = ref(navigator.onLine); // Se inicializa con el valor nativo
  let intervalId: number | undefined; 

  const setOnline = async () => {
    // En tests y UX es deseable una respuesta rápida: marcamos online
    // de forma optimista y luego confirmamos con un ping real.
    isOnline.value = true;
    const ok = await checkRealConnectivity();
    if (!ok) isOnline.value = false;
  };

  const setOffline = () => {
    isOnline.value = false;
    console.log('CONEXIÓN PERDIDA (Nativo).');
  };

  onMounted(async () => {
    // Inicializar el valor al montar con la verificación real
    isOnline.value = await checkRealConnectivity(); 
    
      // Agregar listeners nativos con el tercer argumento false
      window.addEventListener('online', setOnline, false);
      window.addEventListener('offline', setOffline, false);
    
    // ⏱️ VERIFICACIÓN PERIÓDICA (Mantiene la exactitud)
    intervalId = window.setInterval(async () => {
        // Verificamos si el estado cambió o si estamos offline según el nativo
        const newStatus = await checkRealConnectivity();
        if (newStatus !== isOnline.value) {
            isOnline.value = newStatus;
            console.log('Verificación Periódica: El estado cambió a', newStatus);
        }
    }, 15000); // Acortamos el intervalo a 15 segundos para una respuesta más rápida
  });

  onUnmounted(() => {
    // ... (la lógica de limpieza sigue igual) ...
      window.removeEventListener('online', setOnline, false);
      window.removeEventListener('offline', setOffline, false);
    if (intervalId !== undefined) {
        window.clearInterval(intervalId);
    }
  });

  return { isOnline };
}
