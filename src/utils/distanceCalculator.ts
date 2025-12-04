import type { Coordinates } from '../types/index';

// Función para convertir grados a radianes
const toRad = (value: number): number => (value * Math.PI) / 180;

/**
 * Calcula la distancia entre dos coordenadas usando la fórmula de Haversine.
 * @param coords1 Coordenadas del primer punto (ej: la ubicación del usuario)
 * @param coords2 Coordenadas del segundo punto (ej: la ubicación del amigo)
 * @returns Distancia en kilómetros.
 */
export function calculateDistance(coords1: Coordinates, coords2: Coordinates): number {
    const R = 6371; // Radio de la Tierra en kilómetros

    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1Rad = toRad(coords1.latitude);
    const lat2Rad = toRad(coords2.longitude);

    // Fórmula de Haversine
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) *
              Math.cos(lat1Rad) * Math.cos(lat2Rad);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Distancia en km
}