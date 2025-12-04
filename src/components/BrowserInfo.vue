<template>
  <div class="card p-4 shadow-sm my-4 bg-light">
    <h3 class="text-primary mb-4 fw-bold">Panel de Diagnóstico del Navegador</h3>

    <ul class="list-unstyled">
      
      <li class="mb-2">
        <strong class="text-dark me-2">Idioma Preferido:</strong>
        <span class="text-secondary fw-bold">{{ preferredLanguage }}</span>
        <span class="small text-muted">({{ getLanguageName(preferredLanguage) }})</span>
      </li>
      
      <li class="mb-2">
        <strong class="text-dark me-2">Plataforma (SO):</strong>
        <span class="text-secondary fw-bold">{{ operatingSystem }}</span>
      </li>
      
      <li class="mb-2">
        <strong class="text-dark me-2">Cookies Habilitadas: </strong>
        <span class="fw-bold" :class="cookiesEnabledText === 'Sí' ? 'text-success' : 'text-danger'">
          {{ cookiesEnabledText }}
        </span>
      </li>

    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

// 1. Definición de Refs para el estado inicial
// Aunque son síncronos, los inicializamos en onMounted para garantizar que navigator exista.
const language = ref('');
const platform = ref('');
const cookieEnabled = ref(false);

// Función auxiliar simple para traducir el código de idioma (UX)
const getLanguageName = (code: string): string => {
    // Esto es un placeholder; en un proyecto real se usaría i18n
    if (code.startsWith('es')) return 'Español';
    if (code.startsWith('en')) return 'Inglés';
    if (code.startsWith('fr')) return 'Francés';
    return 'Desconocido';
};

// 2. Propiedad Computed para la legibilidad de 'Cookies Habilitadas'
const cookiesEnabledText = computed(() => {
  return cookieEnabled.value ? 'Sí' : 'No';
});

// 3. Propiedades Computed para la visualización directa
const preferredLanguage = computed(() => language.value);
const operatingSystem = computed(() => platform.value);


onMounted(() => {
  // 4. Lectura síncrona de las propiedades en onMounted
  language.value = navigator.language;
  platform.value = navigator.platform;
  cookieEnabled.value = navigator.cookieEnabled;
});
</script>