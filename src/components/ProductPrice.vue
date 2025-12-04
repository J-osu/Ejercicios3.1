<script setup lang="ts">
import { computed } from 'vue';

// --- LÓGICA DEL COMPOSABLE MOVIDA AL INTERIOR ---

/**
 * Función que crea y devuelve el formateador de divisas.
 * Nota: En un proyecto real, esto estaría en 'useCurrencyFormatter.ts'.
 */
const createCurrencyFormatter = () => {
    
    const formatCurrency = (amount: number, locale: string, currencyCode: string): string => {
        
        if (typeof amount !== 'number' || isNaN(amount)) {
            return 'Monto no válido'; 
        }

        try {
            // Usa Intl.NumberFormat para el formateo internacional
            const formatter = new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currencyCode,
                minimumFractionDigits: 2, 
            });
            return formatter.format(amount);
        } catch (error) {
            console.error('Error al formatear divisa:', error);
            return `Error de formato para ${currencyCode}`;
        }
    };

    return {
        formatCurrency,
    };
};
// ----------------------------------------------------

// 1. Define las props (Ahora son las props del subcomponente de demostración)
const props = defineProps<{
    price: number;
    locale: string;
    currencyCode: string;
}>();

// 2. Llama a la función de formateo interna
const { formatCurrency } = createCurrencyFormatter();

// 3. Crea una propiedad computed para el precio formateado
const formattedPrice = computed(() => {
    return formatCurrency(props.price, props.locale, props.currencyCode);
});

const currencyExamples = [
    { price: 1999.5, locale: 'en-US', currencyCode: 'USD', description: 'Dólar Americano (Separador de miles: coma)' },
    { price: 1999.5, locale: 'es-ES', currencyCode: 'EUR', description: 'Euro Español (Separador de miles: punto)' },
    { price: 1999.5, locale: 'ja-JP', currencyCode: 'JPY', description: 'Yen Japonés (Redondea, sin decimales)' },
    { price: 1999.5, locale: 'de-DE', currencyCode: 'EUR', description: 'Euro Alemán (Símbolo al final)' },
    { price: 123456.78, locale: 'pt-BR', currencyCode: 'BRL', description: 'Real Brasileño' },
];

</script>

<template>
    <div class="product-price-demo-page">
        <h1>Demostración Autocontenida del Formateador de Divisas</h1>
        <p class="intro-text">
            Este componente demuestra el uso de `Intl.NumberFormat` para formatear el mismo precio base (<strong>1999.50</strong>) según diferentes configuraciones regionales (`locale`) y divisas (`currencyCode`).
        </p>
        
        <div class="examples-container">
            <div v-for="(item, index) in currencyExamples" :key="index" class="example-card">
                
                <p class="description">{{ item.description }}</p>

                <div class="product-price">
                    <p class="label">Precio Formateado:</p>
                    <span class="price-display">{{ createCurrencyFormatter().formatCurrency(item.price, item.locale, item.currencyCode) }}</span>
                    
                    <p class="details">
                        (Datos de entrada: {{ item.price }} | Región: {{ item.locale }} | Divisa: {{ item.currencyCode }})
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos principales de la página de demostración */
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

/* Estilos del componente PRODUCTPRICE (TUS ESTILOS ORIGINALES) */
.product-price {
    padding: 15px; /* Ajustado ligeramente */
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f4f4f4;
    max-width: 100%; /* Ajustado para el grid */
    margin: 0;
}

.label {
    font-size: 0.9em;
    color: #555;
    margin-bottom: 5px;
}

.price-display {
    font-size: 1.8em;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 10px;
}

.details {
    font-size: 0.8em;
    color: #888;
    border-top: 1px dashed #ccc;
    padding-top: 10px;
    margin-top: 10px;
}
</style>