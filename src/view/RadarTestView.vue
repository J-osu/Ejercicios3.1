<template>
  <div class="container py-5">
    
    <h1 class="text-center mb-4 fw-bold text-secondary">🧪 Entorno de Prueba: Radar de Amigos Cercanos</h1>
    <p class="text-center lead text-muted mb-5">
      Este componente está monitoreando tu ubicación real (o simulada) y comparándola con las ubicaciones fijas de tus amigos.
    </p>

    <!-- 1. El Componente Detector de Proximidad -->
    <ProximityDetector />

    <!-- 2. Sección de Datos de Referencia (Mocked Friends) -->
    <div class="card p-4 shadow-lg mt-5 bg-info-subtle border-info">
      <h4 class="mb-3 text-primary">Datos de Referencia de Amigos</h4>
      <p class="small text-muted mb-3">
        Para encontrar a los amigos "Cerca", debes simular una ubicación cerca de 
        Latitud <strong>{{ TEST_USER_LAT.toFixed(4) }}</strong>, Longitud <strong>{{ TEST_USER_LON.toFixed(4) }}</strong>.
      </p>
      
      <ul class="list-group list-group-flush">
        <li v-for="friend in allFriends" :key="friend.id" class="list-group-item d-flex justify-content-between small">
          <span class="fw-bold">{{ friend.name }}</span>
          <span class="text-muted">Lat: {{ friend.latitude.toFixed(4) }}, Lon: {{ friend.longitude.toFixed(4) }}</span>
        </li>
      </ul>
    </div>

    <!-- 3. Instrucciones de Simulación (Cruciales) -->
    <div class="card p-4 shadow-sm mt-4">
        <h4 class="text-danger mb-3">Instrucciones para la Prueba Real (Debugging)</h4>
        <p class="small">
            Para probar la lógica del radar sin moverte físicamente, debes **engañar** a tu navegador:
        </p>
        <ol class="small">
            <li>Abre las Herramientas de Desarrollo (F12 o Ctrl+Shift+I).</li>
            <li>Ve a la pestaña <strong>Sensores</strong> (en Chrome/Edge) o <strong>Ubicación Geográfica</strong> (en Firefox). (A veces se encuentra en el menú de "Más herramientas").</li>
            <li>Establece una ubicación simulada. Para encontrar a Ana y Luis, usa las coordenadas de referencia: 
                <code class="bg-light p-1 rounded">Lat: {{ TEST_USER_LAT.toFixed(4) }}, Lon: {{ TEST_USER_LON.toFixed(4) }}</code>.
            </li>
            <li>Al cambiar la ubicación simulada, el componente **debería actualizarse automáticamente** gracias a <code>navigator.geolocation.watchPosition()</code>.</li>
        </ol>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProximityDetector from '../components/ProximityDetector.vue'; 
import { friends, TEST_USER_LAT, TEST_USER_LON } from '../data/mockFriends'; // Importamos los datos de prueba

export default defineComponent({
  name: 'RadarTestView',
  components: {
    ProximityDetector,
  },
  setup() {
    return {
      allFriends: friends,
      TEST_USER_LAT,
      TEST_USER_LON,
    };
  },
});
</script>