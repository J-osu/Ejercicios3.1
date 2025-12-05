<template>
  <div class="container py-5">
    
    <h1 class="text-center mb-4 fw-bold text-secondary">Prueba: Información del Navegador</h1>
    <p class="text-center lead text-muted mb-5">
      Los valores que ves son leídos directamente de los objetos <code class="bg-light p-1 rounded">navigator</code> 
      y <code class="bg-light p-1 rounded">window</code> de tu navegador actual.
    </p>

    <BrowserInfo />

    <div class="mt-5 pt-4 border-top">
        <h4 class="text-primary mb-3">Contexto de la Prueba</h4>
        <p class="small text-muted">
            Para verificar que la información es precisa, puedes:
        </p>
        <ul class="small">
            <li>Cambiar la configuración de idioma de tu navegador (si es posible) y recargar la página para ver el cambio en <strong>Idioma Preferido</strong>.</li>
            <li>Abrir esta URL en diferentes dispositivos (móvil, Mac, Windows) para ver cómo cambia el valor de <strong>Plataforma (SO)</strong>.</li>
            <li>Consultar las herramientas de desarrollo de tu navegador para verificar que el valor de <code>navigator.cookieEnabled</code> coincide con la configuración actual de cookies.</li>
        </ul>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BrowserInfo from '../components/BrowserInfo.vue'; 

export default defineComponent({
  name: 'BrowserInfoTestView',
  components: {
    BrowserInfo, // Importamos el componente a probar
  },
});
</script>