<template>
  <div ref="referenciaContenedor" style="position: relative; display: inline-block; width: 100%;">
    <slot></slot>
    
    <button
      @click="alternarPantallaCompleta"
      style="
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 6px 12px;
        background-color: #1e90ff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        z-index: 1000;
      "
    >
      {{ esPantallaCompleta ? 'Salir de Pantalla Completa' : 'Entrar a Pantalla Completa' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineExpose, type Ref } from 'vue'

const referenciaContenedor = ref<HTMLElement | null>(null)
const esPantallaCompleta: Ref<boolean> = ref(false)

defineExpose<{ referenciaContenedor: Ref<HTMLElement | null>, esPantallaCompleta: Ref<boolean> }>({
  referenciaContenedor,
  esPantallaCompleta
})

const alternarPantallaCompleta = async () => {
  if (!referenciaContenedor.value) return
  try {
    if (document.fullscreenElement === referenciaContenedor.value) {
      await document.exitFullscreen()
    } else {
      await referenciaContenedor.value.requestFullscreen()
    }
  } catch (err) {
    console.error(err)
  }
}

const manejarCambioPantallaCompleta = () => {
  esPantallaCompleta.value = document.fullscreenElement === referenciaContenedor.value
}

onMounted(() => {
  document.addEventListener('fullscreenchange', manejarCambioPantallaCompleta)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', manejarCambioPantallaCompleta)
})
</script>