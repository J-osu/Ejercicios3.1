import { ref } from 'vue'

export function usePokemonFetcher() {
  const pokemons = ref<any[]>([])
  const isLoading = ref(false)

  let desplazamiento = 0
  const limite = 20

  const cargarMasPokemones = async () => {
    if (isLoading.value) return
    isLoading.value = true

    try {
      const respuesta = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${desplazamiento}&limit=${limite}`
      )

      const datos = await respuesta.json()

      pokemons.value.push(...datos.results)

      desplazamiento += limite

    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  return {
    pokemons,
    isLoading,
    cargarMasPokemones,
  }
}