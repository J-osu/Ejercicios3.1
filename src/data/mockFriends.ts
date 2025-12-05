import type { Friend } from '../types/index';

// Coordenadas de prueba (simulando una ubicación central del usuario)
export const TEST_USER_LAT = 40.4175;
export const TEST_USER_LON = -3.7038;

export const friends: Friend[] = [
    // 1. Amigo Cercano (A 100 metros del usuario de prueba)
    { id: 1, name: 'Ana (Cerca)', latitude: 40.4168, longitude: -3.7042 }, 
    
    // 2. Amigo También Cercano
    { id: 2, name: 'Luis (Cerca)', latitude: 40.4180, longitude: -3.7040 }, 
    
    // 3. Amigo Lejano (A más de 1 km)
    { id: 3, name: 'Pedro (Lejos)', latitude: 40.4280, longitude: -3.7200 }, 
    
    // 4. Amigo Muy Lejano (Sídney)
    { id: 4, name: 'Carlos (Muy Lejos)', latitude: -33.8688, longitude: 151.2093 } 
];