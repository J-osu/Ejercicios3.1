<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Define el tipo de las pestañas para mayor seguridad
type TabName = 'perfil' | 'facturacion' | 'seguridad';

// 1. Define un ref (activeTab) para almacenar el nombre de la pestaña activa
const activeTab = ref<TabName>('perfil');

/**
 * 2. Método para cambiar la pestaña activa y actualizar la URL sin recargar.
 * @param tabName El nombre de la pestaña a la que se desea navegar.
 */
const changeTab = (tabName: TabName) => {
  // 1. Actualizar el ref activeTab con el nuevo tabName
  activeTab.value = tabName;

  // 2. Construir un objeto de estado simple
  const stateObject = { tab: tabName };

  // 3. Construir la nueva URL. Usamos un prefijo /spa/ para claridad.
  // Nota: La URL debe ser relativa al origen.
  const newUrl = `/settings/${tabName}`;

  // 4. Llamar a history.pushState(stateObject, '', newUrl)
  // El segundo argumento (title) se ignora en la mayoría de los navegadores modernos
  try {
    window.history.pushState(stateObject, '', newUrl);
    console.log(`Navegación simulada a: ${newUrl}`, stateObject);
  } catch (error) {
    console.error("Error al usar history.pushState:", error);
  }
};

/**
 * Función para manejar la navegación del navegador (botón "atrás" o "adelante").
 * Cuando la URL cambia por un control del navegador, el evento 'popstate' se dispara.
 */
const handlePopState = (event: PopStateEvent) => {
  // Intentamos obtener el estado de la pestaña desde el objeto state
  const tabFromState = event.state?.tab as TabName | undefined;

  if (tabFromState) {
    // Si el estado tiene la pestaña, la actualizamos
    activeTab.value = tabFromState;
  } else {
    // Si no hay estado (ej. al ir a la URL inicial), parseamos la URL actual.
    // Usamos una implementación básica de parseo basada en el pathname.
    const pathSegments = window.location.pathname.split('/');
    const currentTab = pathSegments[pathSegments.length - 1] as TabName;
    
    // Verificamos si es una pestaña válida antes de asignarla
    if (['perfil', 'facturacion', 'seguridad'].includes(currentTab)) {
      activeTab.value = currentTab;
    } else {
      // Si la URL es la base, volvemos a la pestaña por defecto
      activeTab.value = 'perfil';
      // Es recomendable hacer un replaceState aquí para limpiar el historial, pero no es un requisito.
    }
  }
};

// 2. En el hook onMounted, establecer la pestaña inicial y escuchar el evento popstate
onMounted(() => {
  // Establecer el estado inicial (simulando que el enrutador establece la URL)
  changeTab(activeTab.value); 
  
  // Agregar el listener para el botón de "atrás" del navegador
  window.addEventListener('popstate', handlePopState);
});

// Limpieza: importante si el componente fuera a ser desmontado
// onBeforeUnmount(() => {
//   window.removeEventListener('popstate', handlePopState);
// });
</script>

<template>
  <div class="p-6 md:p-10 bg-gray-100 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl">
      <h1 class="text-3xl font-bold text-gray-800 p-6 border-b border-gray-200">
        Navegador de Configuración (SPA Simulada)
      </h1>

      <!-- 2. Diseña el Template: Botones de Pestañas -->
      <div class="flex border-b border-gray-200">
        <!-- Función de Ayuda para las clases de la pestaña activa -->
        <template v-for="tab in ['perfil', 'facturacion', 'seguridad']" :key="tab">
          <button 
            @click="changeTab(tab as TabName)"
            :class="{
              'border-blue-600 text-blue-600 font-semibold': activeTab === tab,
              'border-transparent text-gray-500 hover:text-gray-700': activeTab !== tab
            }"
            class="px-6 py-3 text-sm tracking-wider capitalize border-b-2 transition-colors duration-200 ease-in-out focus:outline-none"
          >
            {{ tab }}
          </button>
        </template>
      </div>

      <!-- Contenido Dinámico (v-if) -->
      <div class="p-8">
        <div v-if="activeTab === 'perfil'" class="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 class="text-2xl font-bold text-blue-800 mb-3">Contenido del Perfil</h2>
          <p class="text-gray-700">Aquí puedes ver y editar tu información personal. La URL en la barra de direcciones refleja `/settings/perfil` sin recargar la página.</p>
          <p class="mt-4 text-sm text-blue-600">Estado Actual: {{ activeTab }}</p>
        </div>

        <div v-else-if="activeTab === 'facturacion'" class="bg-green-50 p-6 rounded-lg border border-green-200">
          <h2 class="text-2xl font-bold text-green-800 mb-3">Contenido de Facturación</h2>
          <p class="text-gray-700">Gestiona tus métodos de pago e historial de transacciones. La URL se actualizó a `/settings/facturacion`.</p>
          <p class="mt-4 text-sm text-green-600">Estado Actual: {{ activeTab }}</p>
        </div>

        <div v-else-if="activeTab === 'seguridad'" class="bg-red-50 p-6 rounded-lg border border-red-200">
          <h2 class="text-2xl font-bold text-red-800 mb-3">Contenido de Seguridad</h2>
          <p class="text-gray-700">Cambia tu contraseña y revisa las sesiones activas. Observa cómo la URL ahora es `/settings/seguridad`.</p>
          <p class="mt-4 text-sm text-red-600">Estado Actual: {{ activeTab }}</p>
        </div>
      </div>
      
      <div class="p-6 pt-0 text-sm text-gray-500 border-t border-gray-100">
        <p>¡Desafío cumplido! Al hacer clic en las pestañas, la URL se actualiza gracias a <code class="bg-gray-100 p-0.5 rounded text-xs">history.pushState()</code>.</p>
        <p class="mt-2">Además, si usas el botón **Atrás** del navegador, el componente debería responder (gracias al listener <code class="bg-gray-100 p-0.5 rounded text-xs">popstate</code>).</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
  No se requiere CSS personalizado ya que se utilizó Tailwind para el diseño.
  El componente está listo para integrarse en una aplicación Vue con Tailwind.
*/
</style>