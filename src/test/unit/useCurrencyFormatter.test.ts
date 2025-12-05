import { describe, it, expect } from 'vitest';
import { useCurrencyFormatter } from '../../composables/useCurrencyFormatter'; 

const cleanEuroSpace = (str: string): string => {
    return str.replace(/\u00a0/g, ' '); 
};

describe('useCurrencyFormatter (Pruebas de Lógica Pura)', () => {
    
    const { formatCurrency } = useCurrencyFormatter();

    it('debe devolver $12,345.67 para 12345.67 en en-US/USD', () => {
        const result = formatCurrency(12345.67, 'en-US', 'USD');
        expect(result).toBe('$12,345.67');
    });

    it('debe devolver 12.345,67 € para 12345.67 en de-DE/EUR', () => {
        const result = formatCurrency(12345.67, 'de-DE', 'EUR');
        
        expect(cleanEuroSpace(result)).toBe('12.345,67 €'); 
    });

    it('debe devolver ￥5,000 para 5000 en ja-JP/JPY (sin decimales)', () => {
        const result = formatCurrency(5000, 'ja-JP', 'JPY');
        expect(result).toBe('￥5,000');
    });

    it('debe manejar un valor con redondeo automático en EUR', () => {
        const result = formatCurrency(12345.675, 'de-DE', 'EUR');
        
        expect(cleanEuroSpace(result)).toBe('12.345,68 €');
    });

    it('debe devolver "Monto no válido" si se pasa NaN', () => {
        const result = formatCurrency(NaN, 'en-US', 'USD');
        expect(result).toBe('Monto no válido');
    });
});