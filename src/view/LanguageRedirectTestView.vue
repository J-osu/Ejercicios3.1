<template>
  <div class="container py-5">
    
    <h1 class="text-center mb-4 fw-bold text-secondary">🧪 Prueba: Redirección por Idioma</h1>
    <p class="text-center lead text-muted mb-4">
      Esta página monta el componente de guardia. Haz clic en los enlaces para cambiar el parámetro <code class="bg-light p-1 rounded">?lang=</code> en la URL.
    </p>

    <div class="card p-4 shadow-lg mb-5 bg-warning-subtle">
      <h3 class="text-center text-dark">Componente LanguageGuard Montado</h3>
      <LanguageGuard /> 
      <p class="small text-muted text-center mt-2 mb-0">Revisa la consola para ver qué acción toma el componente.</p>
    </div>

    <div class="card p-4 shadow-sm bg-white">
      <h4 class="mb-3 text-primary">Simulación de Parámetros de URL</h4>
      
      <div class="d-flex flex-wrap gap-3">
        
        <router-link :to="{ path: '/lang-test', query: { lang: 'en' } }" 
                     class="btn btn-success fw-bold">
          Probar: lang=en (Redirige a /lang-en.html)
        </router-link>

        <router-link :to="{ path: '/lang-test', query: { lang: 'es' } }" 
                     class="btn btn-success fw-bold">
          Probar: lang=es (Redirige a /lang-es.html)
        </router-link>

        <router-link :to="{ path: '/lang-test', query: { lang: 'fr' } }" 
                     class="btn btn-outline-secondary">
          Probar: lang=fr (No Redirige)
        </router-link>

        <router-link :to="{ path: '/lang-test' }" 
                     class="btn btn-outline-secondary">
          Probar: Sin lang (No Redirige)
        </router-link>
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// Debes crear este componente, que usa useLanguageRedirect en su setup
import LanguageGuard from '../components/LanguageGuard.vue'; 

export default defineComponent({
  name: 'LanguageRedirectTestView',
  components: {
    LanguageGuard,
  },
});
</script>