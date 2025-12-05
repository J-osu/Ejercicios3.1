<template>
  <div class="container py-5">
    
    <h1 class="text-center mb-4 fw-bold text-secondary">🧪 Prueba: Indicador de Estado de Conexión</h1>
    <p class="text-center lead text-muted mb-5">
      El componente monitorea el estado en tiempo real usando los eventos <code class="bg-light p-1 rounded">'online'</code> y <code class="bg-light p-1 rounded">'offline'</code> del navegador.
    </p>

    <!-- 1. El Componente a Probar -->
    <OnlineStatusIndicator />

    <!-- 2. Instrucciones de Prueba Manual (Crítico para este ejercicio) -->
    <div class="card p-4 shadow-lg mt-5 bg-white">
      <h4 class="mb-3 text-primary">Instrucciones para la Prueba en Vivo</h4>
      
      <p class="fw-bold">Para simular la desconexión y la reconexión:</p>
      <ol>
        <li>Mantén esta página abierta en tu navegador (usa <code class="bg-light p-1 rounded">npm run dev</code>).</li>
        <li>**Para Simular "Offline" (Desconexión):**
          <ul>
            <li>**Opción A (Fácil):** Desactiva la conexión Wi-Fi de tu computadora/dispositivo.</li>
            <li>**Opción B (Profesional):** Abre las Herramientas de Desarrollo (F12), ve a la pestaña "Network" (Red) y selecciona la opción "Offline".</li>
          </ul>
        </li>
        <li>Observa cómo el indicador cambia de 🟢 Conectado a 🔴 Sin conexión.</li>
        <li>**Para Simular "Online" (Reconexión):** Vuelve a activar tu Wi-Fi o deselecciona la opción "Offline" en las Herramientas de Desarrollo.</li>
        <li>El indicador debería volver a 🟢 Conectado inmediatamente.</li>
      </ol>
      <p class="small text-muted mt-3">Nota: El tiempo de respuesta es instantáneo, ya que los eventos son nativos del navegador.</p>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OnlineStatusIndicator from '../components/OnlineStatusIndicator.vue'; 

export default defineComponent({
  name: 'OnlineStatusTestView',
  components: {
    OnlineStatusIndicator, // Importamos el componente a probar
  },
});
</script>