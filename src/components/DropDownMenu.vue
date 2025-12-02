<template>
  <div style="position: relative; display: inline-block;">
    <button
      ref="buttonRef"
      @click.stop="isOpen = !isOpen"
      style="padding: 6px 12px; cursor: pointer; background: #1e90ff; color: white; border: none; border-radius: 4px;"
    >
      Abrir menú
    </button>

    <div
      v-if="isOpen"
      ref="menuRef"
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

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLElement | null>(null)

useClickOutside(menuRef, (event) => {
  if (buttonRef.value?.contains(event.target as Node)) return
  isOpen.value = false
})
</script>
