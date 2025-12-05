<template>
  <div class="popup-manager">
    <h3>Gestor de Ventana Emergente (Pop-up)</h3>
    <p>URL de prueba: **https://www.google.com**</p>

    <button
      v-if="!estaEmergenteAbierta"
      @click="abrirEmergente"
      :disabled="estaEmergenteBloqueada"
      class="btn-open"
    >
      Abrir Ventana Pop-up
    </button>
    <button
      v-else
      @click="cerrarEmergente"
      class="btn-close"
    >
      Cerrar Ventana Pop-up
    </button>

    <p v-if="estaEmergenteBloqueada" class="status-message blocked">
      Pop-up bloqueado.
      El navegador impidió la apertura de la ventana. Asegúrate de
      permitir los pop-ups para este sitio.
    </p>
    <p v-else-if="estaEmergenteAbierta" class="status-message open">
      Ventana abierta.
    </p>
    <p v-else class="status-message closed">
      Ventana cerrada.
    </p>

    <hr>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import type { Ref } from 'vue';

const URL_POR_DEFECTO = 'https://www.google.com';
const NOMBRE_POR_DEFECTO = '_blank';
const CARACTERISTICAS_POR_DEFECTO = 'width=600,height=400,resizable=yes,scrollbars=yes';

const ventanaEmergente: Ref<Window | null> = ref(null);
const estaEmergenteBloqueada = ref(false);

const estaEmergenteAbierta = computed((): boolean => {
  return ventanaEmergente.value !== null && !ventanaEmergente.value.closed;
});

const abrirEmergente = (): void => {
  if (estaEmergenteAbierta.value) {
    ventanaEmergente.value?.focus();
    return;
  }
  
  estaEmergenteBloqueada.value = false;

  ventanaEmergente.value = window.open(
    URL_POR_DEFECTO,
    NOMBRE_POR_DEFECTO,
    CARACTERISTICAS_POR_DEFECTO
  );

  if (!ventanaEmergente.value) {
    estaEmergenteBloqueada.value = true;
    ventanaEmergente.value = null; 
  } else if (typeof ventanaEmergente.value.focus === "function") {
    ventanaEmergente.value.focus();
  }

};

const cerrarEmergente = (): void => {
  if (ventanaEmergente.value && !ventanaEmergente.value.closed) {
    ventanaEmergente.value.close();
  }
  ventanaEmergente.value = null;
  estaEmergenteBloqueada.value = false; 
};

onBeforeUnmount(() => {
  if (estaEmergenteAbierta.value) {
    cerrarEmergente();
  }
})
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
.btn-close:hover:not(:disabled) {
  background-color: #c0392b;
}

button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.status-message {
  margin-top: 15px;
  padding: 8px;
  border-radius: 4px;
}

.blocked {
  background-color: #f7e0e0;
  color: #c0392b;
  font-weight: bold;
  border: 1px solid #e74c3c;
}

.open {
  background-color: #e6f7e9;
  color: #27ae60;
  font-weight: bold;
}

.closed {
  color: #95a5a6;
}

hr {
  margin-top: 20px;
  border: 0;
  border-top: 1px solid #eee;
}
</style>