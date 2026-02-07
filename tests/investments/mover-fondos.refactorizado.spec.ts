/**
 * TESTS DE MOVER FONDOS - REFACTORIZADO
 *
 * Reducción: De ~334 líneas a ~110 líneas (67% menos código)
 */

import { test, expect } from '../../pages/TestBase';

test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Mover Fondos', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  // ============================================
  // FLUJOS PRINCIPALES
  // ============================================

  test('completar movimiento de fondos desde Mis Inversiones a Granos exitosamente', async ({
    homePage,
    moverFondosWizard
  }) => {
    await homePage.clickMoveFunds();

    await moverFondosWizard.moverDeInversionesAGranos();
  });

  test.skip('completar movimiento de fondos desde Granos a Mis Inversiones exitosamente', async ({
    homePage,
    moverFondosWizard
  }) => {
    await homePage.clickMoveFunds();

    await moverFondosWizard.moverDeGranosAInversiones();
  });

  // ============================================
  // FUNCIONALIDADES
  // ============================================

  test('usar botón MAX para el monto', async ({
    homePage,
    moverFondosWizard
  }) => {
    await homePage.clickMoveFunds();

    await moverFondosWizard.verifyStep(1, 3);

    // Intercambiar para tener saldo disponible
    await moverFondosWizard.intercambiarOrigenDestino();
    await moverFondosWizard.wait(3000);

    // Usar botón MAX
    await moverFondosWizard.clickearMontoMaximo();
    await moverFondosWizard.wait(500);

    // Verificar que el monto fue completado
    const inputMonto = moverFondosWizard.getPage().getByRole('textbox', { name: 'Ingresa el monto' });
    const montoValue = await inputMonto.inputValue();
    expect(montoValue).not.toBe('');
    expect(parseFloat(montoValue.replace(/\./g, '').replace(',', '.'))).toBeGreaterThan(0);
  });

  // ============================================
  // VALIDACIONES
  // ============================================

  test('prevenir continuar sin ingresar monto', async ({
    homePage,
    moverFondosWizard
  }) => {
    await homePage.clickMoveFunds();

    await moverFondosWizard.verifyStep(1, 3);
    await moverFondosWizard.verifyContinueDisabled();
  });

  test('prevenir continuar sin aceptar términos y condiciones', async ({
    homePage,
    moverFondosWizard
  }) => {
    await homePage.clickMoveFunds();

    await moverFondosWizard.verifyStep(1, 3);

    // Ingresar monto y observación pero NO aceptar términos
    await moverFondosWizard.ingresarMonto(5000);
    await moverFondosWizard.ingresarObservacion('Test');
    await moverFondosWizard.wait(500);

    await moverFondosWizard.verifyContinueDisabled();
  });

  // ============================================
  // NAVEGACIÓN
  // ============================================

  test('navegar hacia atrás usando botón Anterior', async ({
    homePage,
    moverFondosWizard
  }) => {
    await homePage.clickMoveFunds();

    // Completar paso 1
    await moverFondosWizard.ingresarMonto(5000);
    await moverFondosWizard.ingresarObservacion('Test');
    await moverFondosWizard.aceptarTerminos();

    // Ir al paso 2
    await moverFondosWizard.continue();
    await moverFondosWizard.verifyStep(2, 3);

    // Volver al paso 1
    await moverFondosWizard.previous();
    await moverFondosWizard.verifyStep(1, 3);
  });

  test('cancelar operación usando botón Salir', async ({
    homePage,
    moverFondosWizard
  }) => {
    await homePage.clickMoveFunds();
    await moverFondosWizard.exit();
  });

  test('realizar otro movimiento después de completar uno', async ({
    homePage,
    moverFondosWizard
  }) => {
    await homePage.clickMoveFunds();

    await moverFondosWizard.moverDeInversionesAGranos();

    // Realizar otro movimiento
    await moverFondosWizard.realizarOtroMovimiento();
  });

  // ============================================
  // VERIFICACIONES DE UI
  // ============================================

  test('mostrar saldo disponible al intercambiar a Mis Inversiones como origen', async ({
    homePage,
    moverFondosWizard
  }) => {
    await homePage.clickMoveFunds();

    // Intercambiar origen y destino
    await moverFondosWizard.intercambiarOrigenDestino();
    await moverFondosWizard.wait(500);

    // Verificar que el saldo disponible es visible
    await moverFondosWizard.verificarSaldoDisponibleVisible();
  });
});
