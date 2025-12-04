<template>
  <div class="form-card">
    <h2>✍️ Editor de Documento</h2>

    <p v-if="hasUnsavedChanges" class="unsaved-warning">
      ⚠️ Tienes **cambios sin guardar**. Navegar fuera mostrará una advertencia.
    </p>
    <p v-else class="saved-status">
      ✅ Contenido guardado.
    </p>

    <div class="editor-area">
      <label for="editor">Edita tu contenido aquí:</label>
      <textarea 
        id="editor"
        v-model="editedContent" 
        rows="10" 
        placeholder="Comienza a escribir..."
      ></textarea>
    </div>

    <button 
      @click="saveChanges" 
      :disabled="!hasUnsavedChanges"
      :class="{ 'primary': hasUnsavedChanges }"
    >
      💾 Guardar Cambios
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useLeaveConfirmation } from '../composables/useLeaveConfirmation'; 

const editedContent = ref('Este es el contenido original de tu documento.');

const originalContent = ref('');


onMounted(() => {
  originalContent.value = editedContent.value;
});

const hasUnsavedChanges = computed((): boolean => {
  return editedContent.value !== originalContent.value;
});

useLeaveConfirmation(hasUnsavedChanges);

const saveChanges = () => {
  if (hasUnsavedChanges.value) {
    originalContent.value = editedContent.value;
    console.log('Cambios guardados correctamente.');

  }
};
</script>

<style scoped>
.form-card {
  max-width: 700px;
  margin: 40px auto;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
}

h2 {
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.editor-area {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  line-height: 1.5;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

textarea:focus {
  border-color: #007bff;
  outline: none;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #cccccc;
  color: #666;
  transition: background-color 0.3s, color 0.3s;
}

button.primary {
  background-color: #007bff;
  color: white;
}

button.primary:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.unsaved-warning {
  color: #dc3545; /* Rojo de peligro */
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.saved-status {
  color: #28a745; /* Verde de éxito */
  padding: 10px 0;
  margin-bottom: 20px;
}
</style>