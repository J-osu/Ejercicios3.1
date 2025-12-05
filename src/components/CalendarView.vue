<script setup lang="ts">
import { computed } from 'vue';
import { isSameDay } from '../utils/dateUtils';
import { type CalendarEvent, type CalendarDay } from '../types';

const props = defineProps<{
    year: number;
    month: number;
    events: CalendarEvent[];
}>();

const diasDeLaSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const cuadrillaCalendario = computed<CalendarDay[]>(() => {
    const cuadrilla: CalendarDay[] = [];
    const primerDiaDelMes = new Date(props.year, props.month, 1);
    const diasEnElMes = new Date(props.year, props.month + 1, 0).getDate();
    const indicePrimerDiaDeSemana = (primerDiaDelMes.getDay() + 6) % 7;

    const diasMesAnteriorARellenar = indicePrimerDiaDeSemana;

    const ultimoDiaMesAnterior = new Date(props.year, props.month, 0);
    const diaInicio = ultimoDiaMesAnterior.getDate() - diasMesAnteriorARellenar + 1;

    for (let i = 0; i < diasMesAnteriorARellenar; i++) {
        const fechaDia = new Date(props.year, props.month, diaInicio + i);
        cuadrilla.push({
            date: fechaDia,
            isCurrentMonth: false,
            events: [],
        });
    }
    for (let i = 1; i <= diasEnElMes; i++) {
        const fechaDia = new Date(props.year, props.month, i);
        
        const eventosDia = props.events.filter(evento => isSameDay(evento.date, fechaDia));

        cuadrilla.push({
            date: fechaDia,
            isCurrentMonth: true,
            events: eventosDia,
        });
    }
    const diasParaRellenarAlFinal = 7 - (cuadrilla.length % 7);
    const cuentaRellenoFinal = (diasParaRellenarAlFinal === 7) ? 0 : diasParaRellenarAlFinal;
    
    for (let i = 1; i <= cuentaRellenoFinal; i++) {
        const fechaDia = new Date(props.year, props.month + 1, i);
        cuadrilla.push({
            date: fechaDia,
            isCurrentMonth: false,
            events: [],
        });
    }

    return cuadrilla;
});

const tituloMes = computed(() => {
    const fecha = new Date(props.year, props.month);
    return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
});

</script>

<template>
    <div class="calendar-container">
        <h2>{{ tituloMes }}</h2>

        <div class="calendar-header">
            <div v-for="dia in diasDeLaSemana" :key="dia" class="day-label">{{ dia }}</div>
        </div>

        <div class="calendar-grid">
            <div 
                v-for="dia in cuadrillaCalendario" 
                :key="dia.date.toISOString()" 
                class="day-cell"
                :class="{
                    'is-not-current-month': !dia.isCurrentMonth,
                    'is-today': isSameDay(dia.date, new Date())
                }"
            >
                <div class="day-number">{{ dia.date.getDate() }}</div>

                <div class="events-list">
                    <div 
                        v-for="evento in dia.events" 
                        :key="evento.title"
                        class="event-item"
                        :class="`event-${evento.type}`"
                        :title="evento.title"
                    >
                        {{ evento.title }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.calendar-container {
    max-width: 900px;
    margin: 20px auto;
    font-family: sans-serif;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
    text-transform: capitalize;
}

.calendar-header, .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    width: 100%;
}

.day-label {
    text-align: center;
    font-weight: bold;
    padding: 8px 0;
    color: #007bff;
    border-bottom: 2px solid #007bff;
}

.day-cell {
    border: 1px solid #eee;
    min-height: 100px;
    padding: 5px;
    background-color: #fff;
    position: relative;
    overflow: hidden;
}

.day-number {
    font-weight: bold;
    font-size: 1.2em;
    color: #333;
    margin-bottom: 5px;
}

.is-not-current-month {
    background-color: #f7f7f7;
    color: #aaa;
}
.is-today {
    border: 2px solid #28aa28;
    background-color: #e6ffec;
}

.events-list {
    font-size: 0.75em;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.event-item {
    border-radius: 4px;
    padding: 2px 5px;
    color: white;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: help;
}

.event-busy {
    background-color: #dc3545;
}
.event-tentative {
    background-color: #ffc107;
}
.event-holiday {
    background-color: #17a2b8;
}
</style>