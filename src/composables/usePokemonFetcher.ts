import { ref } from 'vue'

export function usePokemonFetcher() {
  const pokemons = ref<any[]>([])
  const isLoading = ref(false)

  let offset = 0
  const limit = 20

  const loadMorePokemons = async () => {
    if (isLoading.value) return
    isLoading.value = true

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      )

      const data = await response.json()

      pokemons.value.push(...data.results)

      // Actualizamos el offset para la siguiente carga
      offset += limit

    } catch (error) {
      console.error('Error en loadMorePokemons:', error)
    } finally {
      isLoading.value = false
    }
  }
  return {
    pokemons,
    isLoading,
    loadMorePokemons,
  }
}
