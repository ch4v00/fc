/**
 * EJEMPLO DE TEST REFACTORIZADO
 *
 * Este archivo muestra cómo usar los nuevos Page Objects
 * Comparar con el original tests/cuentas.spec.ts
 *
 * REDUCCIÓN DE CÓDIGO: De ~450 líneas a ~120 líneas (73% menos código)
 */

import { test, expect } from '../../pages/TestBase';
import { Currency } from '../../components/CurrencySelector';

test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Añadir Cuenta Bancaria', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  // ============================================
  // TESTS PRINCIPALES - FLUJOS COMPLETOS
  // ============================================

  test('añadir cuenta bancaria en ARS exitosamente', async ({
    homePage,
    agregarCuentaWizard
  }) => {
    await homePage.clickAddAccount();

    await agregarCuentaWizard.agregarCuenta(
      Currency.ARS,
      'Banco Credicoop',
      'Cuenta Corriente $'
    );
  });

  test('añadir cuenta bancaria en USD exitosamente', async ({
    homePage,
    agregarCuentaWizard
  }) => {
    await homePage.clickAddAccount();

    await agregarCuentaWizard.agregarCuenta(
      Currency.USD,
      'Banco Ciudad de Buenos Aires',
      'Cuenta Corriente u$s'
    );
  });

  test('añadir cuenta bancaria en Dólar Cable exitosamente', async ({
    homePage,
    agregarCuentaWizard
  }) => {
    await homePage.clickAddAccount();

    await agregarCuentaWizard.agregarCuenta(
      Currency.CABLE,
      'Amerant Bank',
      '' // Tipo de cuenta no aplica para Cable
    );
  });

  // ============================================
  // TESTS DE VALIDACIÓN
  // ============================================

  test('validar campos requeridos antes de continuar', async ({
    homePage,
    agregarCuentaWizard
  }) => {
    await homePage.clickAddAccount();
    await agregarCuentaWizard.verifyStep(1, 2);
    await agregarCuentaWizard.verifyContinueDisabled();
  });

  test('mostrar campos diferentes para Dólar Cable (SWIFT y ABA)', async ({
    homePage,
    agregarCuentaWizard,
    currencySelector
  }) => {
    await homePage.clickAddAccount();

    // Verificar campos iniciales para ARS
    await agregarCuentaWizard.verifyTextVisible('*CBU');
    await agregarCuentaWizard.verifyTextVisible('*Tipo de Cuenta');

    // Cambiar a Dólar Cable
    await agregarCuentaWizard.wait(1500);
    await currencySelector.selectCable();
    await agregarCuentaWizard.wait(1500);

    // Seleccionar cliente y banco para ver los campos
    await agregarCuentaWizard.getPage().locator('.select-box').first().click();
    await agregarCuentaWizard.wait(500);
    await agregarCuentaWizard.getPage().getByText('AGRO IN SRL -').click();

    await agregarCuentaWizard.getPage().locator('.select-container.default > .select-box').first().click();
    await agregarCuentaWizard.wait(500);
    await agregarCuentaWizard.getPage().getByText('Amerant Bank').click();
    await agregarCuentaWizard.wait(500);

    // Verificar campos SWIFT y ABA
    await agregarCuentaWizard.verificarCamposCable();
  });

  // ============================================
  // TESTS DE NAVEGACIÓN
  // ============================================

  test('cancelar operación usando botón Salir', async ({
    homePage,
    agregarCuentaWizard
  }) => {
    await homePage.clickAddAccount();
    await agregarCuentaWizard.exit();
  });

  test('añadir otra cuenta después de completar una', async ({
    homePage,
    agregarCuentaWizard
  }) => {
    await homePage.clickAddAccount();

    await agregarCuentaWizard.agregarCuenta(
      Currency.ARS,
      'Banco Bica',
      'Cuenta Corriente $'
    );

    // Añadir otra cuenta
    await agregarCuentaWizard.agregarOtraCuenta();
  });

  // ============================================
  // TESTS DE VERIFICACIÓN DE UI
  // ============================================

  test('mostrar opciones de moneda correctas', async ({
    homePage,
    agregarCuentaWizard
  }) => {
    await homePage.clickAddAccount();
    await agregarCuentaWizard.verificarOpcionesMoneda();
  });

  test('mostrar mensaje de demora de activación de 24 horas', async ({
    homePage,
    agregarCuentaWizard
  }) => {
    await homePage.clickAddAccount();
    await agregarCuentaWizard.verificarMensajeDemora();
  });

  test('cambiar tipos de cuenta según moneda seleccionada', async ({
    homePage,
    agregarCuentaWizard,
    currencySelector
  }) => {
    await homePage.clickAddAccount();

    // Seleccionar cliente y banco primero
    await agregarCuentaWizard.getPage().locator('.select-box').first().click();
    await agregarCuentaWizard.wait(500);

    await agregarCuentaWizard.getPage().getByText('AGRO IN SRL -').click();
    await agregarCuentaWizard.wait(500);

    await agregarCuentaWizard.getPage().locator('.select-container.default > .select-box').first().click();
    await agregarCuentaWizard.wait(500);
    await agregarCuentaWizard.getPage().getByText('Banco Credicoop').click();

    // Verificar tipos de cuenta para ARS
    await agregarCuentaWizard.getPage().locator('.select-container.default > .select-box').click();
    await agregarCuentaWizard.wait(500);
    await agregarCuentaWizard.verifyTextVisible('Cuenta Corriente $');
    await agregarCuentaWizard.verifyTextVisible('Caja de Ahorro $');
    await agregarCuentaWizard.closeDropdown();

    // Cambiar a USD
    await currencySelector.selectUSD();

    // Verificar tipos de cuenta para USD
    await agregarCuentaWizard.getPage().locator('.select-container.default > .select-box').click();
    await agregarCuentaWizard.wait(500);
    await agregarCuentaWizard.verifyTextVisible('Cuenta Corriente u$s');
    await agregarCuentaWizard.verifyTextVisible('Caja de Ahorro u$s');
  });
});
