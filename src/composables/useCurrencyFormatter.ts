
export function useCurrencyFormatter() {
    
    const formatCurrency = (amount: number, locale: string, currencyCode: string): string => {
        
        if (typeof amount !== 'number' || isNaN(amount)) {
            return 'Monto no válido'; 
        }

        try {
            const options: Intl.NumberFormatOptions = {
                style: 'currency',
                currency: currencyCode,
                minimumFractionDigits: 2, 
            };

            if (currencyCode === 'JPY') {
                options.minimumFractionDigits = 0;
                options.maximumFractionDigits = 0;
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