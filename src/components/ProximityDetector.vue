<template>
  <div class="container my-5">
    <h1 class="text-center mb-4 text-primary">📍 Radar de Amigos Cercanos</h1>

    <div class="card p-4 mb-4 shadow-sm">
      <h4 class="text-secondary mb-3">Tu Estado Actual</h4>
      
      <div v-if="error" class="alert alert-danger fw-bold">
        🔴 ERROR: {{ error }}
      </div>

      <div v-else-if="coords">
        <p class="mb-1 fw-bold text-success">🟢 Rastreo Activo</p>
        <p class="small mb-1">Latitud: {{ coords.latitude.toFixed(4) }}</p>
        <p class="small mb-0">Longitud: {{ coords.longitude.toFixed(4) }}</p>
        <p class="small text-muted mt-2">Radio de Proximidad: {{ radioProxKm }} km</p>
      </div>
      
      <div v-else class="alert alert-info">
        <i class="bi bi-geo-alt-fill me-2"></i> Obteniendo ubicación...
      </div>
    </div>

    <div class="card p-4 shadow-lg">
        <h4 class="mb-3 text-secondary">Amigos en el Radar ({{ amigosCerca.length }})</h4>

        <ul v-if="amigosCerca.length > 0" class="list-group">
            <li v-for="friend in amigosCerca" :key="friend.id" class="list-group-item d-flex justify-content-between align-items-center">
                <span class="fw-bold">{{ friend.name }}</span>
                <span class="badge bg-success rounded-pill">
                    {{ friend.distance.toFixed(3) }} km (¡Cerca!)
                </span>
            </li>
        </ul>

        <div v-else-if="coords" class="alert alert-warning text-center mt-3">
            Nadie cerca por ahora. ¡Sigue moviéndote!
        </div>
        <div v-else class="alert alert-info text-center mt-3">
            Esperando tu ubicación para iniciar el radar...
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGeolocation } from '../composables/useGeolocation';
import { calculateDistance } from '../utils/distanceCalculator';
import type { Friend } from '../types/index';
import { friends as mockFriends, TEST_USER_LAT, TEST_USER_LON } from '../data/mockFriends';

// Constante para el radio de proximidad (1 kilómetro)
const radioProxKm = 1;

// 1. Usar el composable de Geolocalización
const { coords, error } = useGeolocation();

// 2. Propiedad Computed para determinar la proximidad
const amigosCerca = computed(() => {
    // Si no tenemos coordenadas del usuario, no podemos calcular distancias
    if (!coords.value) {
        return [];
    }

    const usarCordenadas = coords.value;
    
    // Filtramos la lista de amigos
    const cerca = mockFriends.map(friend => {
        // Calcular la distancia entre el usuario y el amigo
        const lejos = calculateDistance(usarCordenadas, friend);
        
        // Devolvemos el amigo con la distancia añadida
        return {
            ...friend,
            distance: lejos,
            isNear: lejos <= radioProxKm,
        };
    }).filter(friend => friend.isNear); // Solo mantenemos los que están cerca

    return cerca;
});
</script>