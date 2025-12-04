<template>
  <div
    ref="contenedorScroll"
    class="scroll-container"
    style="height: 500px; overflow-y: scroll; border: 1px solid #ccc; padding: 12px;"
  >
    
    <div
      v-for="(pokemon, index) in pokemons"
      :key="index"
      class="pokemon-item"
      style="padding: 8px; border-bottom: 1px solid #eee;"
    >
      {{ pokemon.name }}
    </div>

    
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

const { pokemons, isLoading, cargarMasPokemones } = usePokemonFetcher()
const paginaActual = ref(1)
const contenedorScroll = ref<HTMLElement | null>(null)

const manejarFinScroll = async () => {
  if (isLoading.value) return

  await cargarMasPokemones()
  paginaActual.value++

  history.replaceState(
    { page: paginaActual.value },
    '',
    `?page=${paginaActual.value}`
  )
}

useScrollDetector(contenedorScroll, manejarFinScroll)

onMounted(async () => {

  const urlParams = new URLSearchParams(window.location.search)
  const paramPagina = urlParams.get('page')
  let paginaObjetivo = 1

  if (paramPagina) {
    const numPagina = parseInt(paramPagina)
    if (!isNaN(numPagina) && numPagina >= 1) {
      paginaObjetivo = numPagina
      paginaActual.value = numPagina
    }
  }

  for (let i = 1; i <= paginaObjetivo; i++) {
    await cargarMasPokemones()
  }

  setTimeout(async () => {
    const el = contenedorScroll.value
    if (el && el.scrollHeight <= el.clientHeight + 100) {
      await manejarFinScroll()
    }
  }, 0)
})
</script>
