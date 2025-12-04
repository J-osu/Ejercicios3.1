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

    // --- 2.1 Determinar el primer día de la grilla ---
    
    // Objeto Date que representa el primer día del mes actual (ej: 1 de octubre de 2025).
    const firstDayOfMonth = new Date(props.year, props.month, 1); 
    // Obtenemos el número de días del mes actual.
    const daysInMonth = new Date(props.year, props.month + 1, 0).getDate();

    // JS getDay() -> 0 (Dom), 1 (Lun), ..., 6 (Sáb). 
    // Fórmula (d+6)%7 mapea Lun a 0 para que la semana empiece en Lunes.
    const firstDayOfWeekIndex = (firstDayOfMonth.getDay() + 6) % 7; 
    
    // --- 2.2 Días de Relleno al Inicio (Mes Anterior) ---
    
    // Calcula cuántos días del mes anterior son necesarios para que el Lunes sea la primera celda.
    const previousMonthDaysToFill = firstDayOfWeekIndex;

    if (previousMonthDaysToFill > 0) {
        // Encontramos el último día del mes anterior (Día 0 del mes actual).
        const previousMonthLastDay = new Date(props.year, props.month, 0);
        const lastDayNumber = previousMonthLastDay.getDate();

        // Iteramos desde el día que inicia el relleno hasta el final del mes anterior.
        for (let i = previousMonthDaysToFill; i > 0; i--) {
            // Creamos la fecha del mes anterior. La fecha de la celda es: (Último Día - i + 1).
            const dayNumber = lastDayNumber - i + 1;
            const dayDate = new Date(props.year, props.month - 1, dayNumber); // 💡 CORRECCIÓN CLAVE: Usar props.month - 1
            
            grid.push({
                date: dayDate,
                isCurrentMonth: false,
                events: [],
            });
        }
    }

    // --- 2.3 Generar Días del Mes Actual y Asignar Eventos ---
    
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDate = new Date(props.year, props.month, i);
        
        // Asignar Eventos: Encontrar eventos que coincidan con este día (Optimización: Podríamos usar un mapa para eventos).
        const dayEvents = props.events.filter(event => isSameDay(event.date, dayDate));

        grid.push({
            date: dayDate,
            isCurrentMonth: true,
            events: dayEvents,
        });
    }

    // --- 2.4 Días de Relleno al Final (Mes Siguiente) ---
    
    // Calculamos los días restantes para llenar la última fila (o llegar a 6 semanas).
    let daysToFillAtEnd = 7 - (grid.length % 7);
    if (daysToFillAtEnd === 7 && grid.length > 0) {
        daysToFillAtEnd = 0; // Si ya está completo (ej. 35 o 42 días), no rellenamos 7 más.
    }
    
    for (let i = 1; i <= daysToFillAtEnd; i++) {
        // 💡 CORRECCIÓN CLAVE: Crear la fecha del mes siguiente usando props.month + 1.
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
// 3. MEJORA: Título del Mes (Aprovecha la propiedad computed)
// ---------------------------------------------
const monthTitle = computed(() => {
    // La fecha debe ser el primer día del mes para obtener el nombre correcto.
    const date = new Date(props.year, props.month); 
    // toLocaleDateString es la forma más robusta de formatear fechas para la UX.
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
                    'is-today': isSameDay(day.date, new Date()) // Comprobación de día actual
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