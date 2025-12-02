<template>
  <div
    ref="scrollContainer"
    class="scroll-container"
    style="height: 500px; overflow-y: scroll; border: 1px solid #ccc; padding: 12px;"
  >
    <!-- Lista de pokemons -->
    <div
      v-for="(pokemon, index) in pokemons"
      :key="index"
      class="pokemon-item"
      style="padding: 8px; border-bottom: 1px solid #eee;"
    >
      {{ pokemon.name }}
    </div>

    <!-- Indicador de carga -->
    <div
      v-if="isLoading"
      class="loading"
      style="text-align: center; padding: 10px; font-size: 14px; color: #666;"
    >
      Cargando más Pokémon...
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePokemonFetcher } from '../composables/usePokemonFetcher'
import { useScrollDetector } from '../composables/useScrollDetector'

// 1. Usar el composable del fetcher
const { pokemons, isLoading, loadMorePokemons } = usePokemonFetcher()

// 2. Página actual (ref)
const currentPage = ref(1)

// 3. Template ref del contenedor con scroll
const scrollContainer = ref<HTMLElement | null>(null)

// 4. Callback del scroll detector
const handleScrollEnd = async () => {

  // 1. Comprobar si ya está cargando
  if (isLoading.value) return

  // 2. Incrementar la página
  currentPage.value++

  // 3. Cargar más pokemons
  await loadMorePokemons()

  // 4. Actualizar la URL
  history.replaceState(
    { page: currentPage.value },
    '',
    `?page=${currentPage.value}`
  )
}

// 5. Activar el detector de scroll
useScrollDetector(scrollContainer, handleScrollEnd)

// 6. Cargar la primera página al montar
onMounted(() => {
  loadMorePokemons()
})
</script>

<style scoped>
.pokemon-item {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.loading {
  text-align: center;
  padding: 10px;
  color: #666;
}
</style>
