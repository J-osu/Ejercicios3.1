import { ref } from 'vue'

export function usePokemonFetcher() {
  const pokemons = ref<any[]>([])
  const isLoading = ref(false)

  // offset inicial
  let offset = 0
  const limit = 20 // número estándar de la PokeAPI

  const loadMorePokemons = async () => {
    if (isLoading.value) return
    isLoading.value = true

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      )

      if (!response.ok) {
        throw new Error('Error al cargar pokemons')
      }

      const data = await response.json()

      // Añadimos los resultados al array reactivo
      pokemons.value.push(...data.results)

      // Actualizamos el offset para la siguiente carga
      offset += limit

    } catch (error) {
      console.error('Error en loadMorePokemons:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Lo que expone el composable
  return {
    pokemons,
    isLoading,
    loadMorePokemons,
  }
}
