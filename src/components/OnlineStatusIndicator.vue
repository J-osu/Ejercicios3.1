<template>
  <div class="...">
    <span v-if="encendido">🟢 Conectado</span>
    <span v-else>🔴 Sin conexión</span>
  </div>
  
  <h4 :class="encendido ? 'text-success' : 'text-danger'">Valor Bruto: {{ encendido }}</h4> 
</template>

<script setup lang="ts">
import { useOnlineStatus } from '../composables/useOnlineStatus';

const { isOnline: encendido } = useOnlineStatus();
</script>