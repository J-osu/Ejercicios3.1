<template>
  <div class="d-flex align-items-center gap-3 p-3 border rounded shadow-sm bg-light">
    
    <span class="text-muted small me-3">Fragmento: "{{ textToCopy.substring(0, 30) }}..."</span>

    <button 
      @click="copyText" 
      class="btn btn-primary btn-sm fw-bold"
      aria-label="Copiar texto al portapapeles"
      :disabled="!!msdevuelta"
    >
      <i class="bi bi-clipboard me-2"></i> Copiar
    </button>

    <span v-if="msdevuelta" 
          class="badge py-2"
          :class="suceso ? 'bg-success' : 'bg-danger'">
      {{ msdevuelta }}
    </span>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
const props = defineProps<{
    textToCopy: string;
}>();

const msdevuelta = ref('');
const suceso = computed(() => msdevuelta.value.includes('¡Copiado!'));
const clearFeedback = () => {
  setTimeout(() => {
    msdevuelta.value = '';
  }, 2000);
};

const copyText = async () => {
  if (!navigator.clipboard) {
    msdevuelta.value = "Error: API no soportada en este navegador.";
    clearFeedback();
    return;
  }

  try {
    await navigator.clipboard.writeText(props.textToCopy);
    msdevuelta.value = "¡Copiado!";
  } catch (err) {
    msdevuelta.value = "Error al copiar";
  } finally {
    clearFeedback();
  }
};
</script>