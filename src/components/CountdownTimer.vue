<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, type Ref } from 'vue';

// 1. CORRECCIÓN PRINCIPAL: Cambiamos 'fechaObjetivo' a 'targetDate'
// para que coincida con el atributo 'target-date' enviado desde el componente padre.
// También la hacemos explícitamente requerida (lo que ayuda con el tipado si no usamos <T>).
const props = defineProps({
    targetDate: {
        type: Date,
        required: true, 
    },
});

const dias = ref(0);
const horas = ref(0);
const minutos = ref(0);
const segundos = ref(0);

const estaFinalizado = ref(false);

// El tipo es `number` en el entorno de navegador para el ID de setInterval.
let idTemporizador: number | null = null; 

const detenerTemporizador = () => {
    if (idTemporizador !== null) {
        clearInterval(idTemporizador);
        idTemporizador = null;
    }
};

const actualizarCuentaAtras = () => {
    // 2. CORRECCIÓN DE TypeError (Cannot read properties of undefined):
    // Chequeamos si la prop es válida antes de intentar llamar a getTime().
    // Esto previene el crash si la prop llega tarde o es inválida.
    if (!props.targetDate || isNaN(props.targetDate.getTime())) {
        detenerTemporizador();
        dias.value = horas.value = minutos.value = segundos.value = 0;
        estaFinalizado.value = true;
        return; 
    }
    
    const ahora = new Date().getTime();
    // 3. Referencia a la prop corregida a 'targetDate'
    const tiempoObjetivo = props.targetDate.getTime();
    let distancia = tiempoObjetivo - ahora;

    if (distancia <= 0) {
        estaFinalizado.value = true;
        detenerTemporizador(); 
        
        dias.value = horas.value = minutos.value = segundos.value = 0;
        return;
    }
    const MS_EN_SEGUNDO = 1000;
    const MS_EN_MINUTO = MS_EN_SEGUNDO * 60;
    const MS_EN_HORA = MS_EN_MINUTO * 60;
    const MS_EN_DIA = MS_EN_HORA * 24;

    dias.value = Math.floor(distancia / MS_EN_DIA);

    horas.value = Math.floor((distancia % MS_EN_DIA) / MS_EN_HORA);

    minutos.value = Math.floor((distancia % MS_EN_HORA) / MS_EN_MINUTO);

    segundos.value = Math.floor((distancia % MS_EN_MINUTO) / MS_EN_SEGUNDO);
};

onMounted(() => {
    actualizarCuentaAtras(); 
    
    // Solo iniciamos el temporizador si la fecha es válida inicialmente
    if (!estaFinalizado.value) {
        idTemporizador = setInterval(actualizarCuentaAtras, 1000);
    }
});

onUnmounted(() => {
    detenerTemporizador();
});

const formatearUnidad = (unidad: Ref<number>) => {
    return computed(() => String(unidad.value).padStart(2, '0'));
}

const mostrarHoras = formatearUnidad(horas);
const mostrarMinutos = formatearUnidad(minutos);
const mostrarSegundos = formatearUnidad(segundos);
</script>

<template>
    <div class="countdown-timer">
        <div v-if="estaFinalizado" class="finished-message">
            🎉 ¡El evento ha comenzado! 🎉
        </div>

        <div v-else class="timer-display">
            
            <div class="time-unit">
                <span class="value">{{ dias }}</span>
                <span class="label">Días</span>
            </div>
            <span class="separator">:</span>

            <div class="time-unit">
                <span class="value">{{ mostrarHoras }}</span>
                <span class="label">Horas</span>
            </div>
            <span class="separator">:</span>
            
            <div class="time-unit">
                <span class="value">{{ mostrarMinutos }}</span>
                <span class="label">Minutos</span>
            </div>
            <span class="separator">:</span>
            
            <div class="time-unit">
                <span class="value">{{ mostrarSegundos }}</span>
                <span class="label">Segundos</span>
            </div>
        </div>
        
        <p class="target-info">
            Fecha objetivo: {{ targetDate?.toLocaleString() }} 
            </p>
    </div>
</template>

<style scoped>
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