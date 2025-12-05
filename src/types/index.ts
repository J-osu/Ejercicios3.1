// src/types/index.ts
export interface CalendarEvent {
    date: Date;
    title: string;
    type: 'busy' | 'tentative' | 'holiday';
}

// Interfaz para la celda de la cuadrícula
export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    events: CalendarEvent[];
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Friend extends Coordinates {
    id: number;
    name: string;
}