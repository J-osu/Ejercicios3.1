<template>
  <div style="position: relative; display: inline-block;">
    <button
      ref="referenciaBoton"
      @click.stop="estaAbierto = !estaAbierto"
      style="padding: 6px 12px; cursor: pointer; background: #1e90ff; color: white; border: none; border-radius: 4px;"
    >
      Abrir menú
    </button>

    <div
      v-if="estaAbierto"
      ref="referenciaMenu"
      data-testid="menu"
      @click.stop
      style="
        position: absolute;
        top: 100%;
        left: 0;
        padding: 10px;
        width: 180px;
        background-color: #000;
        color: #fff;
        z-index: 10;
      "
    >
      <p>Opción 1</p>
      <p>Opción 2</p>
      <p>Opción 3</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useClickOutside } from '../composables/useClickOutside'

const estaAbierto = ref(false)
const referenciaMenu = ref<HTMLElement | null>(null)
const referenciaBoton = ref<HTMLElement | null>(null)

useClickOutside(referenciaMenu, (evento) => {
  if (referenciaBoton.value?.contains(evento.target as Node)) return
  estaAbierto.value = false
})
</script>