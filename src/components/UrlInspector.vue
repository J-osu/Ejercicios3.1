<template>
  <div class="card p-4 shadow-sm my-4 bg-light">
    <h3 class="text-primary mb-4 fw-bold">🔎 Analizador de URL (window.location)</h3>

    <dl class="row mb-0">
      
      <dt class="col-sm-3 fw-bold text-dark">URL Completa (href)</dt>
      <dd class="col-sm-9 text-break">{{ urlParts.href }}</dd>
      
      <dt class="col-sm-3 fw-bold text-dark">Protocolo (protocol)</dt>
      <dd class="col-sm-9 text-break">{{ urlParts.protocol }}</dd>
      
      <dt class="col-sm-3 fw-bold text-dark">Dominio (hostname)</dt>
      <dd class="col-sm-9 text-break">{{ urlParts.hostname }}</dd>
      
      <dt class="col-sm-3 fw-bold text-dark">Puerto (port)</dt>
      <dd class="col-sm-9 text-break">{{ urlParts.port || 'N/A' }}</dd>
      
      <dt class="col-sm-3 fw-bold text-dark">Ruta (pathname)</dt>
      <dd class="col-sm-9 text-break">{{ urlParts.pathname }}</dd>
      
      <dt class="col-sm-3 fw-bold text-dark">Parámetros (search)</dt>
      <dd class="col-sm-9 text-break">{{ urlParts.search || 'N/A' }}</dd>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';

// 1. Interfaz de TypeScript para tipar las partes de la URL
interface UrlParts {
  href: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
}

// 2. Objeto reactivo inicializado con valores vacíos
const urlParts = reactive<UrlParts>({
  href: '',
  protocol: '',
  hostname: '',
  port: '',
  pathname: '',
  search: '',
});

// 3. onMounted: Asignar los valores de window.location
onMounted(() => {
  // Asignación de propiedades del objeto location al objeto reactivo
  urlParts.href = window.location.href;
  urlParts.protocol = window.location.protocol;
  urlParts.hostname = window.location.hostname;
  urlParts.port = window.location.port;
  urlParts.pathname = window.location.pathname;
  urlParts.search = window.location.search;
});
</script>