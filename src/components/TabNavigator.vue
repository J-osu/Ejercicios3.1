<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

type NombrePestana = 'perfil' | 'facturacion' | 'seguridad';

const pestañaActiva = ref<NombrePestana>('perfil');

const cambiarPestana = (nombrePestaña: NombrePestana) => {
  pestañaActiva.value = nombrePestaña;
  const objetoEstado = { tab: nombrePestaña };
  const nuevaUrl = `/settings/${nombrePestaña}`;
  try {
    window.history.pushState(objetoEstado, '', nuevaUrl);
  } catch (error) {
    console.error(error);
  }
};

const manejarEstadoPop = (evento: PopStateEvent) => {
  if (evento.state && evento.state.tab) {
    pestañaActiva.value = evento.state.tab;
    return;
  }
  const rutaActual = window.location.pathname;
  const coincidenciaPestana = rutaActual.match(/\/settings\/(perfil|facturacion|seguridad)$/i);
  
  if (coincidenciaPestana) {
    pestañaActiva.value = coincidenciaPestana[1] as NombrePestana;
  } else {
    pestañaActiva.value = 'perfil'; 
  }
};

onMounted(() => {
  cambiarPestana(pestañaActiva.value);
  window.addEventListener('popstate', manejarEstadoPop);
});

onUnmounted(() => {
  window.removeEventListener('popstate', manejarEstadoPop);
});
</script>

<template>
  <div class="tab-navigator-demo p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-xl">
    <h1 class="text-3xl font-extrabold text-blue-600 mb-6 border-b-2 pb-2">
      Navegador de Pestañas con History API
    </h1>
    
    <div class="flex border-b border-gray-200 mb-6">
      <button 
        @click="cambiarPestana('perfil')"
        :class="['tab-button', { 'active-tab': pestañaActiva === 'perfil' }]"
      >
        Perfil
      </button>
      <button 
        @click="cambiarPestana('facturacion')"
        :class="['tab-button', { 'active-tab': pestañaActiva === 'facturacion' }]"
      >
        Facturación
      </button>
      <button 
        @click="cambiarPestana('seguridad')"
        :class="['tab-button', { 'active-tab': pestañaActiva === 'seguridad' }]"
      >
        Seguridad
      </button>
    </div>

    <div class="tab-content-wrapper">
      <div v-if="pestañaActiva === 'perfil'" class="bg-blue-50 p-6 rounded-lg border border-blue-200 transition duration-200">
        <h2 class="text-2xl font-bold text-blue-800 mb-3">Contenido del Perfil</h2>
        <p class="text-gray-700">Aquí puedes editar tu nombre, email y otra información personal. La URL actual es `/settings/perfil`.</p>
        <p class="mt-4 text-sm text-blue-600">Estado Actual: {{ pestañaActiva }}</p>
      </div>

      <div v-else-if="pestañaActiva === 'facturacion'" class="bg-green-50 p-6 rounded-lg border border-green-200 transition duration-200">
        <h2 class="text-2xl font-bold text-green-800 mb-3">Contenido de Facturación</h2>
        <p class="text-gray-700">Gestiona tus métodos de pago e historial de transacciones. La URL se actualizó a `/settings/facturacion`.</p>
        <p class="mt-4 text-sm text-green-600">Estado Actual: {{ pestañaActiva }}</p>
      </div>

      <div v-else-if="pestañaActiva === 'seguridad'" class="bg-red-50 p-6 rounded-lg border border-red-200 transition duration-200">
        <h2 class="text-2xl font-bold text-red-800 mb-3">Contenido de Seguridad</h2>
        <p class="text-gray-700">Cambia tu contraseña y revisa las sesiones activas. Observa cómo la URL ahora es `/settings/seguridad`.</p>
        <p class="mt-4 text-sm text-red-600">Estado Actual: {{ pestañaActiva }}</p>
      </div>
    </div>
    
    <div class="p-6 pt-0 text-sm text-gray-500 border-t border-gray-100 mt-6">
      <p>Al hacer clic en las pestañas, la URL se actualiza gracias a <code class="bg-gray-100 p-0.5 rounded text-xs">history.pushState()</code>.</p>
      <p class="mt-2">Además, si navegas a otra página y usas el botón "Atrás" del navegador, la pestaña correcta se restaura gracias al evento <code class="bg-gray-100 p-0.5 rounded text-xs">popstate</code>.</p>
    </div>
  </div>
</template>

<style scoped>
.tab-button {
  padding: 10px 15px;
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: #6b7280;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-bottom: -1px;
}

.tab-button:hover {
  color: #616161;
}

.active-tab {
  border-bottom: 3px solid #3b82f6;
  color: #ffffff;
  font-weight: 600;
}
</style>