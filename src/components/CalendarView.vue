<script setup lang="ts">
import { computed } from 'vue';
import { isSameDay } from '../utils/dateUtils'; // Importar el helper
import { type CalendarEvent, type CalendarDay } from '../types'; // Importar las interfaces

// ---------------------------------------------
// 1. PROPS
// ---------------------------------------------
const props = defineProps<{
    year: number;
    month: number; // 0-11
    events: CalendarEvent[];
}>();

// Días de la semana para la cabecera
const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// ---------------------------------------------
// 2. LÓGICA PRINCIPAL: calendarGrid (Propiedad computed)
// ---------------------------------------------

const calendarGrid = computed<CalendarDay[]>(() => {
    const grid: CalendarDay[] = [];

    // --- 2.1 Determinar inicio y fin del mes ---
    
    // El primer día del mes dado (ej: 1 de octubre de 2025)
    const firstDayOfMonth = new Date(props.year, props.month, 1); 
    // El último día del mes dado (Día 0 del mes siguiente es el último día del mes actual)
    const daysInMonth = new Date(props.year, props.month + 1, 0).getDate();

    // --- 2.2 Días de Relleno al Inicio (Mes Anterior) ---
    
    // Obtiene el índice del día de la semana (0=Domingo, 6=Sábado).
    // Usamos el módulo 7 para que Lunes sea 0 y Domingo sea 6.
    // En JS, getDay() devuelve 0 (Dom) a 6 (Sáb). La fórmula (d+6)%7 mapea Lunes a 0.
    const firstDayOfWeekIndex = (firstDayOfMonth.getDay() + 6) % 7; 

    // Calcula cuántos días de relleno del mes anterior necesitamos
    const previousMonthDaysToFill = firstDayOfWeekIndex;

    // Obtener el día de inicio para el relleno
    const previousMonthLastDay = new Date(props.year, props.month, 0);
    const startDay = previousMonthLastDay.getDate() - previousMonthDaysToFill + 1;

    for (let i = 0; i < previousMonthDaysToFill; i++) {
        const dayDate = new Date(props.year, props.month, startDay + i);
        grid.push({
            date: dayDate,
            isCurrentMonth: false,
            events: [], // Los eventos se asignarán más tarde si se desea mostrar días anteriores
        });
    }

    // --- 2.3 Generar Días del Mes Actual y Asignar Eventos ---
    
    // Primero, pre-procesamos los eventos para que la búsqueda sea más rápida (Opcional, pero bueno)
    
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDate = new Date(props.year, props.month, i);
        
        // 🚨 Asignar Eventos: Encontrar eventos que coincidan con este día
        const dayEvents = props.events.filter(event => isSameDay(event.date, dayDate));

        grid.push({
            date: dayDate,
            isCurrentMonth: true,
            events: dayEvents,
        });
    }

    // --- 2.4 Días de Relleno al Final (Mes Siguiente) ---
    
    // La cuadrícula debe tener 6 semanas (42 celdas) o 5 semanas (35 celdas).
    const daysToFillAtEnd = 7 - (grid.length % 7);
    
    // Si la cuadrícula ya es múltiplo de 7 (ej: 35 o 42) y no queremos añadir más,
    // o si el módulo es 0 pero solo tiene 5 semanas, podría necesitar 7 más para 6 semanas.
    const finalFillCount = (daysToFillAtEnd === 7) ? 0 : daysToFillAtEnd;
    
    for (let i = 1; i <= finalFillCount; i++) {
        const dayDate = new Date(props.year, props.month + 1, i);
        grid.push({
            date: dayDate,
            isCurrentMonth: false,
            events: [],
        });
    }

    return grid;
});

// ---------------------------------------------
// 3. MEJORA: Título del Mes
// ---------------------------------------------
const monthTitle = computed(() => {
    const date = new Date(props.year, props.month);
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
});

</script>

<template>
    <div class="calendar-container">
        <h2>{{ monthTitle }}</h2>

        <div class="calendar-header">
            <div v-for="day in daysOfWeek" :key="day" class="day-label">{{ day }}</div>
        </div>

        <div class="calendar-grid">
            <div 
                v-for="day in calendarGrid" 
                :key="day.date.toISOString()" 
                class="day-cell"
                :class="{
                    'is-not-current-month': !day.isCurrentMonth,
                    'is-today': isSameDay(day.date, new Date())
                }"
            >
                <div class="day-number">{{ day.date.getDate() }}</div>

                <div class="events-list">
                    <div 
                        v-for="event in day.events" 
                        :key="event.title"
                        class="event-item"
                        :class="`event-${event.type}`"
                        :title="event.title"
                    >
                        {{ event.title }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos para el Calendario */
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

/* 7 Columnas para la Cabecera y la Cuadrícula */
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

/* Celda de Día */
.day-cell {
    border: 1px solid #eee;
    min-height: 100px; /* Suficiente espacio para eventos */
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

/* Estilos Condicionales */
.is-not-current-month {
    background-color: #f7f7f7;
    color: #aaa;
}
.is-today {
    border: 2px solid #28aa28;
    background-color: #e6ffec;
}

/* Eventos */
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

/* Estilos por Tipo de Evento */
.event-busy {
    background-color: #dc3545; /* Rojo */
}
.event-tentative {
    background-color: #ffc107; /* Amarillo/Naranja */
}
.event-holiday {
    background-color: #17a2b8; /* Azul Claro */
}
</style>