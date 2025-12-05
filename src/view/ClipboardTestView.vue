<template>
  <div class="container py-5">
    
    <h1 class="text-center mb-4 fw-bold text-secondary">Copiar al Portapapeles</h1>
    <p class="text-center lead text-muted mb-5">
      Haz clic en cualquier botón de "Copiar" para usar la API <code class="bg-light p-1 rounded">navigator.clipboard.writeText()</code>.
    </p>

    <div class="row g-4">
      
      <div class="col-lg-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title text-primary">Código de Descuento</h5>
            <p class="small text-muted mb-3">Útil para copiar información larga.</p>
            <CopyToClipboard :textToCopy="longCode" />
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title text-primary">URL de API</h5>
            <p class="small text-muted mb-3">Para copiar URLs de forma rápida.</p>
            <CopyToClipboard :textToCopy="apiUrl" />
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title text-primary">Comando de Terminal</h5>
            <p class="small text-muted mb-3">Para copiar comandos de consola.</p>
            <CopyToClipboard :textToCopy="terminalCommand" />
          </div>
        </div>
      </div>
      
      <!-- Sección de Validación Manual -->
      <div class="col-lg-6">
        <div class="card shadow-sm bg-warning-subtle">
          <div class="card-body">
            <h5 class="card-title text-danger">Validación Manual</h5>
            <p class="small text-dark mb-2">
              Después de hacer clic en "Copiar", pega el contenido en el campo de abajo (Ctrl+V o Cmd+V) para confirmar el éxito de la operación.
            </p>
            <textarea class="form-control" rows="3" placeholder="Pega el contenido copiado aquí..."></textarea>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import CopyToClipboard from '../components/CopyToClipboard.vue'; 

export default defineComponent({
  name: 'ClipboardTestView',
  components: {
    CopyToClipboard, // Importamos el componente a probar
  },
  setup() {
    // Definición de los textos de prueba
    const longCode = 'ZEUS-2024-FULLSTACK-QAPVUE-412356890ABCDEFGH';
    const apiUrl = 'https://api.ferreteriazeus.com/v1/products/394';
    const terminalCommand = 'git checkout -b feature/clipboard-fix';

    return {
      longCode,
      apiUrl,
      terminalCommand,
    };
  },
});
</script>