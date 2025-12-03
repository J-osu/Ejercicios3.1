// src/composables/useCurrencyFormatter.ts

/**
 * Crea una función para formatear un número como divisa usando Intl.NumberFormat.
 * @returns { formatCurrency } La función de formateo.
 */
export function useCurrencyFormatter() {
    
    const formatCurrency = (amount: number, locale: string, currencyCode: string): string => {
        
        if (typeof amount !== 'number' || isNaN(amount)) {
            return 'Monto no válido'; 
        }

        try {
            const options: Intl.NumberFormatOptions = {
                style: 'currency',
                currency: currencyCode,
                // Por defecto, usamos 2 decimales para la mayoría de divisas
                minimumFractionDigits: 2, 
            };

            // Ajuste específico para divisas que no usan decimales (JPY, KRW, etc.)
            if (currencyCode === 'JPY') {
                options.minimumFractionDigits = 0;
                options.maximumFractionDigits = 0; // Importante para la coincidencia exacta
            }
            
            const formatter = new Intl.NumberFormat(locale, options);
            return formatter.format(amount);
        } catch (error) {
            console.error('Error al formatear divisa:', error);
            return `Error de formato para ${currencyCode}`;
        }
    };

    return {
        formatCurrency,
    };
}