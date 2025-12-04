<template>
  <div class="d-flex align-items-center gap-3 p-3 border rounded shadow-sm bg-light">
    
    <span class="text-muted small me-3">Fragmento: "{{ textToCopy.substring(0, 30) }}..."</span>

    <button 
      @click="copyText" 
      class="btn btn-primary btn-sm fw-bold"
      aria-label="Copiar texto al portapapeles"
      :disabled="!!feedbackMessage"
    >
      <i class="bi bi-clipboard me-2"></i> Copiar
    </button>

    <span v-if="feedbackMessage" 
          class="badge py-2"
          :class="isSuccess ? 'bg-success' : 'bg-danger'">
      {{ feedbackMessage }}
    </span>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Definición de Props de TypeScript
const props = defineProps<{
    textToCopy: string;
}>();

// Estado para el feedback y su control de tiempo
const feedbackMessage = ref('');
const isSuccess = computed(() => feedbackMessage.value.includes('¡Copiado!'));

// Función para limpiar el feedback después de 2 segundos
const clearFeedback = () => {
  setTimeout(() => {
    feedbackMessage.value = '';
  }, 2000);
};

// Método principal asíncrono
const copyText = async () => {
  // 1. Comprobar disponibilidad de la API
  if (!navigator.clipboard) {
    feedbackMessage.value = "Error: API no soportada en este navegador.";
    clearFeedback();
    return;
  }

  try {
    // 2. Ejecución asíncrona de la copia
    await navigator.clipboard.writeText(props.textToCopy);
    
    // Éxito
    feedbackMessage.value = "¡Copiado!";
  } catch (err) {
    // Error (p. ej., permiso denegado por el navegador)
    feedbackMessage.value = "Error al copiar";
  } finally {
    // 3. Limpiar el mensaje de feedback
    clearFeedback();
  }
};
</script>