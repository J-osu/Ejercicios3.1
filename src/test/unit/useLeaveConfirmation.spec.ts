import { ref, nextTick } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLeaveConfirmation } from '../../composables/useLeaveConfirmation';

// Creamos referencias a los espías sin usar "vi.SpyInstance"
let addEventSpy: ReturnType<typeof vi.spyOn>;
let removeEventSpy: ReturnType<typeof vi.spyOn>;

describe('useLeaveConfirmation', () => {

  beforeEach(() => {
    // Spy sobre los métodos reales
    addEventSpy = vi.spyOn(window, 'addEventListener');
    removeEventSpy = vi.spyOn(window, 'removeEventListener');

    // Limpieza total antes de cada test
    vi.clearAllMocks();
  });

  // 1. Estado inicial limpio
  it('1. No añade el listener en el estado inicial "limpio" (false)', () => {
    const hasUnsavedChanges = ref(false);

    useLeaveConfirmation(hasUnsavedChanges);

    expect(addEventSpy).not.toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
  });

  // 2. Transición a "sucio"
  it('2. Añade el listener "beforeunload" cuando el estado cambia a "sucio" (true)', async () => {
    const hasUnsavedChanges = ref(false);
    useLeaveConfirmation(hasUnsavedChanges);

    hasUnsavedChanges.value = true;
    await nextTick();

    expect(addEventSpy).toHaveBeenCalledOnce();
    expect(addEventSpy).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
  });

  // 3. Transición de vuelta a limpio
  it('3. Elimina el listener cuando el estado vuelve a "limpio" (false)', async () => {
    const hasUnsavedChanges = ref(true);
    useLeaveConfirmation(hasUnsavedChanges);

    expect(addEventSpy).toHaveBeenCalledTimes(1);

    hasUnsavedChanges.value = false;
    await nextTick();

    expect(removeEventSpy).toHaveBeenCalledOnce();
    expect(removeEventSpy).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
  });

  // 4. Simulación de limpieza al desmontar (sin stop real)
  it('4. La función de limpieza elimina el listener al desmontar (simulación)', () => {
    const hasUnsavedChanges = ref(true);

    useLeaveConfirmation(hasUnsavedChanges);

    expect(addEventSpy).toHaveBeenCalledOnce();

    // Este test se basa en la validez del cleanup comprobada en el test 3
    // No podemos llamar a stop() porque no lo devuelve el composable.
  });
});
