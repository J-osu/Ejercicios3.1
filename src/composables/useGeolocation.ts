import { ref, onMounted, onUnmounted } from 'vue';
import type { Coordinates } from '../types/index';
import type { Ref } from 'vue';

export interface GeolocationState {
    coords: Ref<Coordinates | null>;
    error: Ref<string | null>;
}

export function useGeolocation(): GeolocationState {
    const coords = ref<Coordinates | null>(null);
    const error = ref<string | null>(null);
    let watchId: number | null = null;

    const successCallback: PositionCallback = (position) => {
        error.value = null;
        coords.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };
    };

    const errorCallback: PositionErrorCallback = (err) => {
        error.value = `ERROR(${err.code}): ${err.message}`;
        coords.value = null;
    };

    onMounted(() => {
        if ('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(
                successCallback,
                errorCallback,
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            error.value = "La API de Geolocalización no está soportada por este navegador.";
        }
    });

    onUnmounted(() => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            console.log(`Geolocalización detenida (watchId: ${watchId})`);
        }
    });

    return { coords, error };
}