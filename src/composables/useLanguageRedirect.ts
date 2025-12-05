import { onMounted } from 'vue';


export function useLanguageRedirect() {
  
  onMounted(() => {
    const paramBusquedad = new URLSearchParams(window.location.search);

    const lang = paramBusquedad.get('lang');
    
    let targetUrl = '';

    if (lang === 'en') {
      targetUrl = '/lang-en.html';
    } else if (lang === 'es') {
      targetUrl = '/lang-es.html';
    }
    
    if (targetUrl) {
      console.info(`Parámetro lang='${lang}' detectado. Redirigiendo a ${targetUrl}`);
      window.location.assign(targetUrl);
    } else if (lang !== null) {
      console.warn(`Parámetro lang='${lang}' no válido o no soportado.`);
    } else {
      console.log('No se encontró el parámetro lang. No se realiza ninguna redirección.');
    }
  });
}