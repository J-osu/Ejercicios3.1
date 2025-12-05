<template>
  <div class="container py-5">
    
    <h1 class="text-center mb-4 fw-bold text-secondary">🚨 Prueba: Componente de Redirección Inteligente</h1>
    
    <div class="card p-4 shadow-lg mb-4 bg-light">
      <h4 class="text-primary mb-3">Diagnóstico Actual (Lectura de window/navigator)</h4>
      
      <dl class="row small mb-0">
        <dt class="col-sm-4">Protocolo Actual:</dt>
        <dd class="col-sm-8 fw-bold" :class="isHttp ? 'text-danger' : 'text-success'">
          {{ currentProtocol }} ({{ isHttp ? 'RED: Fallará el check HTTPS' : 'OK: Check HTTPS Pasado' }})
        </dd>
        
        <dt class="col-sm-4">Agente de Usuario (UserAgent):</dt>
        <dd class="col-sm-8 text-break fst-italic">{{ currentUserAgent }}</dd>
      </dl>
    </div>

    <div class="alert alert-warning text-center fw-bold">
      ¡ADVERTENCIA! Al hacer clic, el componente se montará y ejecutará su lógica. 
      Podrías ser redirigido inmediatamente.
    </div>

    <div class="text-center mb-5">
      <button 
        v-if="!isRedirectorMounted"
        @click="mountRedirector" 
        class="btn btn-danger btn-lg fw-bold shadow">
        MONTAR REDIRECTOR Y EJECUTAR LÓGICA
      </button>
      <div v-else class="alert alert-success">
        Componente Montado. ¡Revisa la consola y la URL!
      </div>
    </div>

    <div v-if="isRedirectorMounted">
      <SmartRedirector />
    </div>

    <div class="mt-5 pt-4 border-top">
        <h4 class="text-secondary mb-3">Instrucciones de Prueba Manual</h4>
        <ul class="small">
            <li><strong>Prueba de HTTPS:</strong> Si tu entorno de desarrollo lo permite, navega manualmente a la URL usando <code class="bg-light p-1 rounded">http://</code> en lugar de <code class="bg-light p-1 rounded">https://</code>. El componente debería redirigirte automáticamente al protocolo seguro.</li>
            <li><strong>Prueba de Navegador:</strong> Usa diferentes navegadores (Firefox, Chrome, Edge) y haz clic en "MONTAR". La lógica debería redirigirte a las rutas internas: <code class="bg-light p-1 rounded">/pagina-para-firefox</code> o <code class="bg-light p-1 rounded">/pagina-para-chrome</code>.</li>
        </ul>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import SmartRedirector from '../components/SmartRedirector.vue'; 

export default defineComponent({
  name: 'SmartRedirectorTestView',
  components: {
    SmartRedirector, // El componente guardián
  },
  setup() {
    const isRedirectorMounted = ref(false);
    const currentProtocol = ref('');
    const currentUserAgent = ref('');
    
    // Propiedad calculada para la detección de HTTP
    const isHttp = computed(() => currentProtocol.value === 'http:');

    onMounted(() => {
        // Capturamos el estado real del navegador al cargar la página de prueba
        currentProtocol.value = window.location.protocol;
        currentUserAgent.value = navigator.userAgent;
    });

    const mountRedirector = () => {
        // Al hacer clic, establecemos la bandera en true para renderizar el componente
        isRedirectorMounted.value = true;
    };

    return {
      isRedirectorMounted,
      mountRedirector,
      currentProtocol,
      currentUserAgent,
      isHttp,
    };
  },
});
</script>