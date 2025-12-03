<script setup lang="ts">
import CountdownTimer from '../components/CountdownTimer.vue';

// 🎯 1. Definir la Fecha Objetivo
// Creamos una fecha que esté CLARAMENTE en el futuro (ej: 1 de enero de 2026).
// Si usas una fecha pasada, solo verás el mensaje de finalización.
const targetDateFutura = new Date(2026, 0, 1, 10, 0, 0); // 1 de Enero de 2026 a las 10:00 AM
</script>

<template>
    <div class="test-container">
        <h1>Prueba del Componente CountdownTimer</h1>
        
        <CountdownTimer :target-date="targetDateFutura" />

        <p>Esta es una vista de prueba que garantiza que el componente reciba la fecha que necesita para comenzar la cuenta atrás.</p>
    </div>
</template>

<style scoped>
.test-container {
    padding: 40px;
    text-align: center;
    font-family: sans-serif;
}
h1 {
    color: #007bff;
    margin-bottom: 30px;
}
</style>