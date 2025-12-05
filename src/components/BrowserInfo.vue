<template>
  <div class="card p-4 shadow-sm my-4 bg-light">
    <h3 class="text-primary mb-4 fw-bold">Panel de Diagnóstico del Navegador</h3>

    <ul class="list-unstyled">
      
      <li class="mb-2">
        <strong class="text-dark me-2">Idioma Preferido:</strong>
        <span class="text-secondary fw-bold">{{ lenguagefav }}</span>
        <span class="small text-muted">({{ getLanguageName(lenguagefav) }})</span>
      </li>
      
      <li class="mb-2">
        <strong class="text-dark me-2">Plataforma (SO):</strong>
        <span class="text-secondary fw-bold">{{ sisoperativo }}</span>
      </li>
      
      <li class="mb-2">
        <strong class="text-dark me-2">Cookies Habilitadas:</strong>
        <span class="fw-bold" :class="cookiesEnabledText === 'Sí' ? 'text-success' : 'text-danger'">
          {{ cookiesEnabledText }}
        </span>
      </li>

    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
const lenguage = ref('');
const plataforma = ref('');
const cookieEnabled = ref(false);
const getLanguageName = (code: string): string => {
    if (code.startsWith('es')) return 'Español';
    if (code.startsWith('en')) return 'Inglés';
    if (code.startsWith('fr')) return 'Francés';
    return 'Desconocido';
};
const cookiesEnabledText = computed(() => {
  return cookieEnabled.value ? 'Sí' : 'No';
});

const lenguagefav = computed(() => lenguage.value);
const sisoperativo = computed(() => plataforma.value);


onMounted(() => {
  lenguage.value = navigator.language;
  plataforma.value = navigator.platform;
  cookieEnabled.value = navigator.cookieEnabled;
});
</script>