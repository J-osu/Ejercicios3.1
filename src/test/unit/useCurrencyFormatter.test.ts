// src/test/unit/useCurrencyFormatter.test.ts

import { describe, it, expect } from 'vitest';
import { useCurrencyFormatter } from '../../composables/useCurrencyFormatter'; 
// NOTA: Asegúrate de que la ruta 'useCurrencyFormatter' sea correcta.

// Función auxiliar para reemplazar el espacio duro (\u00a0) por un espacio normal.
// Esto es necesario porque Intl.NumberFormat a menudo usa el espacio inobservable.
const cleanEuroSpace = (str: string): string => {
    // Reemplaza todos los espacios duros (\u00a0) con un espacio normal (' ')
    return str.replace(/\u00a0/g, ' '); 
};

describe('useCurrencyFormatter (Pruebas de Lógica Pura)', () => {
    
    const { formatCurrency } = useCurrencyFormatter();

    // 1. Dólar Americano (Pasa sin cambios)
    it('debe devolver $12,345.67 para 12345.67 en en-US/USD', () => {
        const result = formatCurrency(12345.67, 'en-US', 'USD');
        expect(result).toBe('$12,345.67');
    });

    // 2. Euro Alemán (CORREGIDO)
    it('debe devolver 12.345,67 € para 12345.67 en de-DE/EUR', () => {
        const result = formatCurrency(12345.67, 'de-DE', 'EUR');
        
        // Aplicamos la limpieza antes de la comparación
        expect(cleanEuroSpace(result)).toBe('12.345,67 €'); 
    });

    // 3. Yen Japonés (Pasa sin cambios)
    it('debe devolver ￥5,000 para 5000 en ja-JP/JPY (sin decimales)', () => {
        const result = formatCurrency(5000, 'ja-JP', 'JPY');
        expect(result).toBe('￥5,000');
    });

    // 4. Redondeo en Euro (CORREGIDO)
    it('debe manejar un valor con redondeo automático en EUR', () => {
        const result = formatCurrency(12345.675, 'de-DE', 'EUR');
        
        // Aplicamos la limpieza antes de la comparación
        expect(cleanEuroSpace(result)).toBe('12.345,68 €');
    });

    // 5. NaN (Pasa sin cambios)
    it('debe devolver "Monto no válido" si se pasa NaN', () => {
        const result = formatCurrency(NaN, 'en-US', 'USD');
        expect(result).toBe('Monto no válido');
    });
});