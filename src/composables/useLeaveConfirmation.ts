import { watchEffect } from 'vue';
import type { Ref } from 'vue';

export function useLeaveConfirmation(tieneCambiosSinGuardar: Ref<boolean>): void {
  watchEffect((enLimpieza) => {
    
    const manejarAntesDeDescargar = (evento: BeforeUnloadEvent): void => {
      if (tieneCambiosSinGuardar.value) {
        evento.preventDefault();
        evento.returnValue = ''; 
        
      }
    };

    if (tieneCambiosSinGuardar.value) {
      window.addEventListener('beforeunload', manejarAntesDeDescargar);
    } 

    enLimpieza(() => {
      window.removeEventListener('beforeunload', manejarAntesDeDescargar);
    });
  });
}