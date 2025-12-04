<template>
  <div class="popup-manager">
    <h3>Gestor de Ventana Emergente (Pop-up)</h3>
    <p>URL de prueba: **https://www.google.com**</p>

    <button
      v-if="!isPopupOpen"
      @click="openPopup"
      :disabled="isPopupBlocked"
      class="btn-open"
    >
      Abrir Ventana Pop-up
    </button>
    <button
      v-else
      @click="closePopup"
      class="btn-close"
    >
      Cerrar Ventana Pop-up
    </button>

    <p v-if="isPopupBlocked" class="status-message blocked">
      ⚠️ **¡Pop-up bloqueado!** El navegador impidió la apertura de la ventana. Asegúrate de
      permitir los pop-ups para este sitio.
    </p>
    <p v-else-if="isPopupOpen" class="status-message open">
      ✅ Ventana abierta.
    </p>
    <p v-else class="status-message closed">
      ❌ Ventana cerrada.
    </p>

    <hr>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import type { Ref } from 'vue';

// 1. Define un ref para almacenar la referencia a la ventana.
// El tipo Window | null es apropiado ya que window.open devuelve Window o null.
const popupWindow: Ref<Window | null> = ref(null);
const isPopupBlocked = ref(false); // Para controlar el estado de bloqueo del navegador

const TEST_URL = 'https://www.google.com'; // URL de prueba

/**
 * Propiedad computada para determinar si la ventana emergente está actualmente abierta.
 *
 * Devuelve true si la referencia existe Y la ventana no ha sido cerrada por el usuario/sistema.
 */
const isPopupOpen = computed(() => {
  // Comprueba si la referencia existe y si la propiedad 'closed' no es true
  return !!popupWindow.value && !popupWindow.value.closed;
});

/**
 * Método para abrir la ventana emergente.
 */
const openPopup = () => {
  isPopupBlocked.value = false; // Resetear el estado de bloqueo

  // Llamada a window.open
  const newWindow = window.open(
    TEST_URL,
    '_blank',
    'width=600,height=400,scrollbars=yes,resizable=yes'
  );

  // 1. Almacenar la referencia.
  popupWindow.value = newWindow;

  // 2. Controlar si window.open fue bloqueado (devuelve null).
  if (!newWindow) {
    isPopupBlocked.value = true;
    console.error('El pop-up fue bloqueado por el navegador.');
  }
};

/**
 * Método para cerrar la ventana emergente.
 */
const closePopup = () => {
  // 1. Comprobar si la referencia existe Y si la ventana no ha sido cerrada.
  if (popupWindow.value && !popupWindow.value.closed) {
    // 2. Llamar al método close() de la ventana.
    popupWindow.value.close();
    console.log('Ventana emergente cerrada.');
  }

  // 3. Limpiar la referencia.
  popupWindow.value = null;
  isPopupBlocked.value = false; // Restablecer el estado de bloqueo si estaba activo
};

// Hook de ciclo de vida: Asegurar que la ventana se cierre si el componente se desmonta
onBeforeUnmount(() => {
  if (isPopupOpen.value) {
    closePopup();
  }
});
</script>

<style scoped>
.popup-manager {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 500px;
  margin: 20px auto;
  text-align: center;
}

h3 {
  color: #3498db;
  margin-bottom: 15px;
}

button {
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-open {
  background-color: #2ecc71;
  color: white;
}
.btn-open:hover:not(:disabled) {
  background-color: #27ae60;
}

.btn-close {
  background-color: #e74c3c;
  color: white;
}
.btn-close:hover {
  background-color: #c0392b;
}

button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.status-message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  font-style: italic;
}

.blocked {
  background-color: #fdd;
  color: #c0392b;
  border: 1px solid #c0392b;
}

.open {
  background-color: #e9fbe8;
  color: #27ae60;
  border: 1px solid #27ae60;
}

.closed {
  background-color: #f7f7f7;
  color: #7f8c8d;
}

hr {
    margin-top: 20px;
    border: 0;
    border-top: 1px solid #eee;
}
</style>