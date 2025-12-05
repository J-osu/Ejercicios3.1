import { onMounted } from 'vue';

/**
 * Composable que lee el parámetro 'lang' de la URL y redirige a una página
 * específica basada en el idioma detectado.
 *  Si lang=en, redirige a lang-en.html.
 * Si lang=es, redirige a lang-es.html.
 * En cualquier otro caso, no realiza ninguna acción.
 */
export function useLanguageRedirect() {
  
  onMounted(() => {
    // 1. Obtener la cadena de búsqueda actual (ej: ?lang=es&theme=dark)
    const paramBusquedad = new URLSearchParams(window.location.search);
    
    // 2. Leer el valor del parámetro 'lang'
    const lang = paramBusquedad.get('lang');
    
    let targetUrl = '';

    if (lang === 'en') {
      targetUrl = '/lang-en.html';
    } else if (lang === 'es') {
      targetUrl = '/lang-es.html';
    }
    
    // 3. Ejecutar la redirección si se encontró una URL objetivo
    if (targetUrl) {
      console.info(`Parámetro lang='${lang}' detectado. Redirigiendo a ${targetUrl}`);
      // Usamos location.assign para cargar la nueva página
      window.location.assign(targetUrl);
    } else if (lang !== null) {
      console.warn(`Parámetro lang='${lang}' no válido o no soportado.`);
    } else {
      console.log('No se encontró el parámetro lang. No se realiza ninguna redirección.');
    }
  });
}