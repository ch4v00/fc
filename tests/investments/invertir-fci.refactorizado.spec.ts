/**
 * TESTS DE INVERSIÓN EN FCI - REFACTORIZADO
 *
 * Reducción: De ~454 líneas a ~130 líneas (71% menos código)
 */

import { test, expect } from '../../pages/TestBase';
import { TipoFondo, AccionFCI } from '../../pages/investments/InvertirFCIWizard';

test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Invertir en FCI', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  // ============================================
  // FLUJOS COMPLETOS - SUSCRIPCIONES
  // ============================================

  test('completar suscripción FCI en pesos exitosamente', async ({
    homePage,
    invertirFCIWizard
  }) => {
    await homePage.clickInvestFCI();

    await invertirFCIWizard.suscribirIAMAhorroPesos('25000000');
  });

  test('completar suscripción FCI en dólares exitosamente', async ({
    homePage,
    invertirFCIWizard
  }) => {
    await homePage.clickInvestFCI();

    await invertirFCIWizard.suscribirIAMRentaDolares('25000');
  });

  // ============================================
  // FUNCIONALIDADES
  // ============================================

  test('usar botón MAX para el monto', async ({
    homePage,
    invertirFCIWizard
  }) => {
    await homePage.clickInvestFCI();

    await invertirFCIWizard.seleccionarTipoFondo(TipoFondo.PESOS);
    await invertirFCIWizard.seleccionarFondo('IAM Ahorro Pesos - Clase BIAM 37 CI $');
    await invertirFCIWizard.seleccionarAccion(AccionFCI.SUSCRIBIR);

    // Hacer clic en botón MAX
    await invertirFCIWizard.clickearMontoMaximo();
    await invertirFCIWizard.wait(500);

    // Verificar que el monto fue completado
    const inputMonto = invertirFCIWizard.getPage().getByRole('textbox', { name: 'Ingresá el monto' });
    const montoValue = await inputMonto.inputValue();
    expect(montoValue).not.toBe('');
    expect(parseFloat(montoValue.replace(/\./g, ''))).toBeGreaterThan(0);

    // Verificar que el botón Siguiente está habilitado
    await expect(invertirFCIWizard.getPage().getByRole('button', { name: 'Siguiente' })).toBeEnabled();
  });

  // ============================================
  // VALIDACIONES
  // ============================================

  test('prevenir continuar sin seleccionar tipo de fondo', async ({
    homePage,
    invertirFCIWizard
  }) => {
    await homePage.clickInvestFCI();

    await invertirFCIWizard.verifyStep(1, 5);
    await invertirFCIWizard.verificarOpcionesTipoFondo();
  });

  test('prevenir envío sin ingresar monto', async ({
    homePage,
    invertirFCIWizard
  }) => {
    await homePage.clickInvestFCI();

    // Avanzar al paso 4 (ingresar monto)
    await invertirFCIWizard.seleccionarTipoFondo(TipoFondo.PESOS);
    await invertirFCIWizard.seleccionarFondo('IAM Ahorro Pesos - Clase BIAM 37 CI $');
    await invertirFCIWizard.seleccionarAccion(AccionFCI.SUSCRIBIR);

    // Verificar que el botón Siguiente está deshabilitado
    await invertirFCIWizard.verifyNextDisabled();
  });

  test('prevenir envío sin aceptar reglamentos', async ({
    homePage,
    invertirFCIWizard
  }) => {
    await homePage.clickInvestFCI();

    // Avanzar al paso 5 (confirmación)
    await invertirFCIWizard.seleccionarTipoFondo(TipoFondo.PESOS);
    await invertirFCIWizard.seleccionarFondo('IAM Ahorro Pesos - Clase BIAM 37 CI $');
    await invertirFCIWizard.seleccionarAccion(AccionFCI.SUSCRIBIR);
    await invertirFCIWizard.ingresarMonto('1000000');

    // Verificar que el botón Enviar está deshabilitado
    await invertirFCIWizard.verifySendRequestDisabled();
  });

  // ============================================
  // NAVEGACIÓN
  // ============================================

  test('navegar hacia atrás usando botón Anterior', async ({
    homePage,
    invertirFCIWizard
  }) => {
    await homePage.clickInvestFCI();

    // Avanzar al paso 2
    await invertirFCIWizard.seleccionarTipoFondo(TipoFondo.PESOS);
    await invertirFCIWizard.verifyStep(2, 5);

    // Seleccionar fondo -> paso 3
    await invertirFCIWizard.seleccionarFondo('IAM Ahorro Pesos - Clase BIAM 37 CI $');
    await invertirFCIWizard.verifyStep(3, 5);

    // Suscribir -> paso 4
    await invertirFCIWizard.seleccionarAccion(AccionFCI.SUSCRIBIR);
    await invertirFCIWizard.verifyStep(4, 5);

    // Volver al paso 3
    await invertirFCIWizard.getPage().getByText('Anterior').click();
    await invertirFCIWizard.wait(500);
    await invertirFCIWizard.verifyStep(3, 5);
  });

  test('cancelar operación usando botón Salir', async ({
    homePage,
    invertirFCIWizard
  }) => {
    await homePage.clickInvestFCI();

    await invertirFCIWizard.exit();
  });

  test('realizar otra inversión después de completar una', async ({
    homePage,
    invertirFCIWizard
  }) => {
    await homePage.clickInvestFCI();

    await invertirFCIWizard.suscribirIAMAhorroPesos('1000000');

    // Realizar otra inversión
    await invertirFCIWizard.realizarOtraInversion();
  });

  // ============================================
  // VERIFICACIONES DE UI
  // ============================================

  test('mostrar información del fondo correctamente en paso 3', async ({
    homePage,
    invertirFCIWizard
  }) => {
    await homePage.clickInvestFCI();

    await invertirFCIWizard.seleccionarTipoFondo(TipoFondo.PESOS);
    await invertirFCIWizard.seleccionarFondo('IAM Ahorro Pesos - Clase BIAM 37 CI $');

    // Verificar detalles del fondo
    await invertirFCIWizard.verificarDetallesFondo('IAM Ahorro Pesos - Clase B', 'IAM 37');

    // Verificar campos adicionales
    await invertirFCIWizard.verifyTextVisible('Precio');
    await invertirFCIWizard.verifyTextVisible('Riesgo');
    await invertirFCIWizard.verifyTextVisible('Liquidacion');

    // Verificar botones de acción
    await invertirFCIWizard.verificarBotonesAccion();
  });
});
