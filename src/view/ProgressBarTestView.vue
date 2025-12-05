<template>
  <div class="container py-5">
    
    <ScrollProgressBar />

    <h1 class="text-center mb-5 fw-bold text-secondary">Barra de Progreso de Lectura</h1>
    <p class="text-center lead text-muted mb-5">
      Desplázate hacia abajo y observa la barra verde en la parte superior. 
      Se llenará a medida que avanzas en el contenido.
    </p>

    <div class="article-content">
      <div v-for="i in 15" :key="i" class="card mb-4 shadow-sm">
        <div class="card-body">
          <h2 class="card-title text-primary mb-3">Capítulo {{ i }}: Fundamentos de Reactividad</h2>
          <p>
            **{{ i % 3 === 0 ? '¡Párrafo Clave!' : 'Párrafo de Relleno' }}** Lorem ipsum dolor sit amet, 
            consectetur adipiscing elit. Curabitur vel tellus eu lectus bibendum auctor. 
            Fusce euismod quam at sapien egestas, non vestibulum odio ultricies. Proin 
            efficitur, purus ac vestibulum eleifend, velit metus efficitur tellus, 
            vel fringilla elit justo vel odio.
          </p>
          <p v-if="i % 2 !== 0">
            Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac 
            consectetur ac, vestibulum at eros. Cum sociis natoque penatibus et magnis 
            dis parturient montes, nascetur ridiculus mus. Fusce dapibus, tellus ac 
            cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo 
            sit amet risus.
          </p>
          <p>
            Aliquam euismod erat vel ante elementum, a congue urna eleifend. Sed 
            tincidunt sapien vel justo interdum, ac dapibus ipsum auctor. Integer 
            nec odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
        </div>
      </div>
    </div>
    
    <div class="text-center mt-5 mb-5">
        <p class="lead">¡Has llegado al final del artículo! Progreso: 100%</p>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ScrollProgressBar from '../components/ScrollProgressBar.vue';

export default defineComponent({
  name: 'ProgressBarTestView',
  components: {
    ScrollProgressBar,
  },
});
</script>