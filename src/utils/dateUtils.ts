// src/utils/dateUtils.ts

/**
 * Comprueba si dos objetos Date representan el mismo día (mismo año, mes y día).
 */
export const isSameDay = (dateA: Date, dateB: Date): boolean => {
    return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()
    );
};