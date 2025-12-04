<script setup lang="ts">
import { computed } from 'vue';

const crearFormateadorDivisas = () => {
    
    const formatearDivisa = (monto: number, localizacion: string, codigoDivisa: string): string => {
        
        // Esta comprobación sigue siendo importante para manejar valores no numéricos
        if (typeof monto !== 'number' || isNaN(monto)) {
            return 'Monto no válido'; 
        }

        try {
            const formateador = new Intl.NumberFormat(localizacion, {
                style: 'currency',
                currency: codigoDivisa,
                minimumFractionDigits: 2, 
            });
            return formateador.format(monto);
        } catch (error) {
            console.error('Error al formatear divisa:', error);
            return `Error de formato para ${codigoDivisa}`;
        }
    };

    return {
        formatearDivisa,
    };
};

const props = withDefaults(defineProps<{
    price?: number;
    locale?: string;
    currencyCode?: string;
}>(), {
    price: 123.45,
    locale: 'es-ES',
    currencyCode: 'EUR',
});

const { formatearDivisa } = crearFormateadorDivisas();

const precioFormateado = computed(() => {
   
    return formatearDivisa(props.price, props.locale, props.currencyCode);
});
</script>

<template>
    <div class="product-price-demo-page">
        <h1>Demostración del Formateador de Precios</h1>
        
        <p class="intro-text">
            Este componente demuestra cómo usar la API <code class="bg-gray-100 p-0.5 rounded text-xs">Intl.NumberFormat</code> 
            para formatear precios según diferentes localizaciones y códigos de divisa.
        </p>
        
        <div class="examples-container">
            
            <div class="example-card">
                <p class="description">Precio del Producto (por defecto):</p>
                <div class="price-display">
                    <span class="price-value">{{ precioFormateado }}</span>
                </div>
                <div class="details">
                    <p>Precio: {{ props.price }}</p>
                    <p>Localización: {{ props.locale }}</p>
                    <p>Código de divisa: {{ props.currencyCode }}</p>
                </div>
            </div>
            
            <div class="example-card">
                <p class="description">Ejemplo: USD, en formato de EE. UU. (en el componente):</p>
                <div class="price-display">
                    <span class="price-value">{{ formatearDivisa(1500.50, 'en-US', 'USD') }}</span>
                </div>
                <div class="details">
                    <p>Precio: 1500.50</p>
                    <p>Localización: en-US</p>
                    <p>Código de divisa: USD</p>
                </div>
            </div>
            
            <div class="example-card">
                <p class="description">Ejemplo: EUR, en formato de Alemania:</p>
                <div class="price-display">
                    <span class="price-value">{{ formatearDivisa(1234.56, 'de-DE', 'EUR') }}</span>
                </div>
                <div class="details">
                    <p>Precio: 1234.56</p>
                    <p>Localización: de-DE</p>
                    <p>Código de divisa: EUR</p>
                </div>
            </div>
            
            <div class="example-card">
                <p class="description">Ejemplo: JPY (sin decimales), en formato de Japón:</p>
                <div class="price-display">
                    <span class="price-value">{{ formatearDivisa(999, 'ja-JP', 'JPY') }}</span>
                </div>
                <div class="details">
                    <p>Precio: 999</p>
                    <p>Localización: ja-JP</p>
                    <p>Código de divisa: JPY</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.product-price-demo-page {
    padding: 30px;
    max-width: 1000px;
    margin: 0 auto;
    background-color: #fafafa;
    border: 1px solid #eee;
    border-radius: 8px;
}

h1 {
    color: #007bff;
    border-bottom: 3px solid #007bff;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.intro-text {
    font-size: 1.1em;
    color: #555;
    margin-bottom: 40px;
}

.examples-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.example-card {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #ffffff;
}

.description {
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.price-display {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.price-value {
    color: #28a745; 
}

.details {
    font-size: 0.9em;
    color: #666;
    border-top: 1px dashed #eee;
    padding-top: 10px;
}
</style>