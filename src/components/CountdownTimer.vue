<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, type Ref } from 'vue';

// ---------------------------------------------
// 1. PROPS
// ---------------------------------------------

const props = defineProps<{
    targetDate: Date; // Fecha límite del evento
}>();

// ---------------------------------------------
// 2. ESTADO REACTIVO
// ---------------------------------------------

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

const isFinished = ref(false);

// Requisito: Variable para el ID del intervalo
let timerId: number | null = null; 

// ---------------------------------------------
// 3. LÓGICA DE CÁLCULO Y ACTUALIZACIÓN
// ---------------------------------------------

/**
 * Función que detiene el temporizador.
 */
const stopTimer = () => {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
};

/**
 * Requisito: Implementa la lógica de cálculo y actualización (updateCountdown).
 */
const updateCountdown = () => {
    // 1. Obtiene la fecha actual
    const now = new Date().getTime();
    const targetTime = props.targetDate.getTime();
    
    // 2. Calcula la distancia en milisegundos
    let distance = targetTime - now;

    // 3. Manejo de finalización: Si la distancia es menor o igual a cero
    if (distance <= 0) {
        isFinished.value = true;
        stopTimer(); 
        
        // Asegurar que las unidades estén en cero al finalizar
        days.value = hours.value = minutes.value = seconds.value = 0;
        return;
    }

    // 4. Convierte la distancia a días, horas, minutos y segundos:
    
    // Constantes de tiempo
    const MS_IN_SECOND = 1000;
    const MS_IN_MINUTE = MS_IN_SECOND * 60;
    const MS_IN_HOUR = MS_IN_MINUTE * 60;
    const MS_IN_DAY = MS_IN_HOUR * 24;

    // a) Días
    days.value = Math.floor(distance / MS_IN_DAY);

    // b) Horas (usa el módulo del día)
    hours.value = Math.floor((distance % MS_IN_DAY) / MS_IN_HOUR);

    // c) Minutos (usa el módulo de la hora)
    minutes.value = Math.floor((distance % MS_IN_HOUR) / MS_IN_MINUTE);

    // d) Segundos (usa el módulo del minuto)
    seconds.value = Math.floor((distance % MS_IN_MINUTE) / MS_IN_SECOND);
};

// ---------------------------------------------
// 4. CICLO DE VIDA (LIFECYCLE)
// ---------------------------------------------

// Requisito: En onMounted, inicia el temporizador
onMounted(() => {
    // Llamar una vez para inicializar inmediatamente y evitar el "parpadeo" inicial.
    updateCountdown(); 
    
    // Inicia un setInterval que llama a updateCountdown cada 1000ms
    timerId = setInterval(updateCountdown, 1000);
});

// Requisito: En onUnmounted, limpia el intervalo
onUnmounted(() => {
    stopTimer();
});

// ---------------------------------------------
// 5. MEJORA DE FORMATO
// ---------------------------------------------

/**
 * Función computada para formatear una unidad con dos dígitos (ej: 9 -> 09).
 * Usa String.padStart(2, '0').
 */
const formatUnit = (unit: Ref<number>) => {
    return computed(() => String(unit.value).padStart(2, '0'));
}

const displayHours = formatUnit(hours);
const displayMinutes = formatUnit(minutes);
const displaySeconds = formatUnit(seconds);
</script>

<template>
    <div class="countdown-timer">
        <div v-if="isFinished" class="finished-message">
            🎉 ¡El evento ha comenzado! 🎉
        </div>

        <div v-else class="timer-display">
            
            <div class="time-unit">
                <span class="value">{{ days }}</span>
                <span class="label">Días</span>
            </div>
            <span class="separator">:</span>

            <div class="time-unit">
                <span class="value">{{ displayHours }}</span>
                <span class="label">Horas</span>
            </div>
            <span class="separator">:</span>
            
            <div class="time-unit">
                <span class="value">{{ displayMinutes }}</span>
                <span class="label">Minutos</span>
            </div>
            <span class="separator">:</span>
            
            <div class="time-unit">
                <span class="value">{{ displaySeconds }}</span>
                <span class="label">Segundos</span>
            </div>
        </div>
        
        <p class="target-info">
            Fecha objetivo: {{ targetDate.toLocaleString() }}
        </p>
    </div>
</template>

<style scoped>
/* Estilos proporcionados previamente para la visualización */
.countdown-timer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border: 2px solid #007bff;
    border-radius: 12px;
    background-color: #f0f8ff;
    max-width: 600px;
    margin: 20px auto;
    font-family: sans-serif;
}

.finished-message {
    font-size: 2em;
    color: #28a745;
    font-weight: bold;
    padding: 20px;
}

.timer-display {
    display: flex;
    gap: 10px;
    align-items: center;
}

.time-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 10px 15px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.value {
    font-size: 3em;
    font-weight: 700;
    color: #007bff;
    line-height: 1;
}

.label {
    font-size: 0.8em;
    color: #555;
    text-transform: uppercase;
    margin-top: 5px;
}

.separator {
    font-size: 3em;
    color: #007bff;
}

.target-info {
    margin-top: 20px;
    font-size: 0.9em;
    color: #888;
}
</style>