<script setup lang="ts">
import CalendarView from '../components/CalendarView.vue';
import { type CalendarEvent } from '../types';

// Mes: Octubre (índice 9), Año: 2025
const currentYear = 2025; 
const currentMonth = 9; 

// Crear eventos de prueba
const mockEvents: CalendarEvent[] = [
    { date: new Date(2025, 9, 28), title: 'Reunión Proyecto', type: 'busy' },
    { date: new Date(2025, 9, 28), title: 'Almuerzo con Cliente', type: 'tentative' },
    { date: new Date(2025, 9, 15), title: 'Feriado Nacional', type: 'holiday' },
    { date: new Date(2025, 9, 1), title: 'Inicio del Mes', type: 'tentative' },
    { date: new Date(2025, 9, 31), title: 'Cierre Fiscal', type: 'busy' },
];
</script>

<template>
    <CalendarView 
        :year="currentYear" 
        :month="currentMonth" 
        :events="mockEvents" 
    />
</template>