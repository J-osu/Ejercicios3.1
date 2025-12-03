import { watchEffect } from 'vue';
import type { Ref } from 'vue';

/**
 * 🛡️ Composable para prevenir que el usuario abandone la página con cambios sin guardar.
 * Muestra el diálogo de confirmación nativo del navegador.
 *
 * @param hasUnsavedChanges - Una Ref<boolean> que es true si hay cambios sin guardar.
 */
export function useLeaveConfirmation(hasUnsavedChanges: Ref<boolean>): void {
  // watchEffect se ejecuta inmediatamente y vuelve a ejecutar si la dependencia (hasUnsavedChanges.value) cambia.
  watchEffect((onCleanup) => {
    
    // 1. Define la función que manejará el evento 'beforeunload'
    const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
      // Si hasUnsavedChanges.value es true, activa el diálogo nativo
      if (hasUnsavedChanges.value) {
        // Previene la descarga de la página. (Necesario en algunos navegadores)
        event.preventDefault();
        
        // Asignar una cadena vacía es el estándar para activar el prompt en navegadores modernos.
        event.returnValue = ''; 
        
      }
    };

    // 2. Lógica para añadir o quitar el listener condicionalmente
    if (hasUnsavedChanges.value) {
      // Si hay cambios sin guardar, activamos el guardián
      console.log('🚨 Guardián activado: Se añadió el listener "beforeunload".');
      window.addEventListener('beforeunload', handleBeforeUnload);
    } else {
      // Si no hay cambios, nos aseguramos de que el listener no esté activo
      // Nota: El listener se elimina automáticamente por la función de limpieza si estaba activo.
      console.log('✅ Guardián desactivado.');
    }

    // 3. Función de limpieza (Crucial para prevenir fugas de memoria)
    // Se ejecuta:
    // a) Justo antes de que el watchEffect se vuelva a ejecutar (si hasUnsavedChanges cambia de valor).
    // b) Cuando el componente que usa este composable es desmontado (unmounted).
    onCleanup(() => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      console.log('🧹 Listener "beforeunload" eliminado.');
    });
  });
}