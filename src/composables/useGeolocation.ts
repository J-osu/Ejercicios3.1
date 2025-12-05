import { ref, onMounted, onUnmounted } from 'vue';
import type { Coordinates } from '../types/index';
import type { Ref } from 'vue';

// Exportamos el tipo de retorno para una mejor tipificación
export interface GeolocationState {
    coords: Ref<Coordinates | null>;
    error: Ref<string | null>;
}

export function useGeolocation(): GeolocationState {
    const coords = ref<Coordinates | null>(null);
    const error = ref<string | null>(null);
    let watchId: number | null = null;

    // Callback de éxito: actualiza las coordenadas reactivamente
    const successCallback: PositionCallback = (position) => {
        error.value = null; // Limpiamos cualquier error previo
        coords.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };
    };

    // Callback de error: registra el error en el ref
    const errorCallback: PositionErrorCallback = (err) => {
        error.value = `ERROR(${err.code}): ${err.message}`;
        coords.value = null; // Limpiamos coordenadas si hay error
    };

    onMounted(() => {
        if ('geolocation' in navigator) {
            // 🚨 Crucial: Iniciar el seguimiento continuo
            watchId = navigator.geolocation.watchPosition(
                successCallback,
                errorCallback,
                // Opciones de configuración (ej: alta precisión)
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            error.value = "La API de Geolocalización no está soportada por este navegador.";
        }
    });

    onUnmounted(() => {
        // 🚨 Crucial: Limpiar el seguimiento para detener el consumo de batería
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            console.log(`Geolocalización detenida (watchId: ${watchId})`);
        }
    });

    return { coords, error };
}