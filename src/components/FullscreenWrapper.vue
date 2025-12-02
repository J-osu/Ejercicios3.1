<template>
  <div ref="wrapperRef" style="position: relative; display: inline-block; width: 100%;">
    <!-- Slot para cualquier contenido -->
    <slot></slot>
    
    <!-- Botón de pantalla completa -->
    <button
      @click="toggleFullscreen"
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
      {{ isFullscreen ? 'Salir de Pantalla Completa' : 'Entrar a Pantalla Completa' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineExpose, type Ref } from 'vue'

// Refs internos
const wrapperRef = ref<HTMLElement | null>(null)
const isFullscreen: Ref<boolean> = ref(false)

// Exponer los refs para tests
defineExpose<{ wrapperRef: Ref<HTMLElement | null>, isFullscreen: Ref<boolean> }>({
  wrapperRef,
  isFullscreen
})

// Función para alternar fullscreen
const toggleFullscreen = async () => {
  if (!wrapperRef.value) return
  try {
    if (document.fullscreenElement === wrapperRef.value) {
      await document.exitFullscreen()
    } else {
      await wrapperRef.value.requestFullscreen()
    }
  } catch (err) {
    console.error(err)
  }
}

// Actualizar estado al cambiar fullscreen
const handleFullscreenChange = () => {
  isFullscreen.value = document.fullscreenElement === wrapperRef.value
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>
