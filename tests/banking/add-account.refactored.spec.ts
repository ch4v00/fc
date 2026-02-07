/**
 * EJEMPLO DE TEST REFACTORIZADO
 *
 * Este archivo muestra cómo usar los nuevos Page Objects
 * Compara con el archivo original tests/cuentas.spec.ts
 *
 * REDUCCIÓN: De ~450 líneas a ~120 líneas (73% menos código)
 */

import { test, expect } from '../../pages/TestBase';
import { Currency } from '../../components/CurrencySelector';

test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Añadir Cuenta Bancaria - Refactorizado', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  // ============================================
  // TESTS PRINCIPALES - FLUJOS COMPLETOS
  // ============================================

  test('debería añadir una cuenta bancaria en ARS exitosamente', async ({
    homePage,
    addAccountWizard
  }) => {
    await homePage.clickAddAccount();

    await addAccountWizard.addAccount(
      Currency.ARS,
      'Banco Credicoop',
      'Cuenta Corriente $'
    );
  });

  test('debería añadir una cuenta bancaria en USD exitosamente', async ({
    homePage,
    addAccountWizard
  }) => {
    await homePage.clickAddAccount();

    await addAccountWizard.addAccount(
      Currency.USD,
      'Banco Ciudad de Buenos Aires',
      'Cuenta Corriente u$s'
    );
  });

  test('debería añadir una cuenta bancaria en Dólar Cable exitosamente', async ({
    homePage,
    addAccountWizard
  }) => {
    await homePage.clickAddAccount();

    await addAccountWizard.addAccount(
      Currency.CABLE,
      'Amerant Bank',
      '' // No aplica tipo de cuenta para Cable
    );
  });

  // ============================================
  // TESTS DE VALIDACIÓN
  // ============================================

  test('debería validar que no se puede continuar sin completar campos requeridos', async ({
    homePage,
    addAccountWizard
  }) => {
    await homePage.clickAddAccount();
    await addAccountWizard.verifyStep(1, 2);
    await addAccountWizard.verifyContinueDisabled();
  });

  test('debería mostrar campos diferentes para Dólar Cable (SWIFT y ABA)', async ({
    homePage,
    addAccountWizard,
    currencySelector
  }) => {
    await homePage.clickAddAccount();

    // Verificar campos iniciales para ARS
    await addAccountWizard.verifyTextVisible('*CBU');
    await addAccountWizard.verifyTextVisible('*Tipo de Cuenta');

    // Cambiar a Dólar Cable
    await addAccountWizard.wait(1500);
    await currencySelector.selectCable();
    await addAccountWizard.wait(1500);

    // Seleccionar comitente y banco para ver los campos
    await addAccountWizard.getPage().locator('.select-box').first().click();
    await addAccountWizard.wait(500);
    await addAccountWizard.getPage().getByText('AGRO IN SRL -').click();

    await addAccountWizard.getPage().locator('.select-container.default > .select-box').first().click();
    await addAccountWizard.wait(500);
    await addAccountWizard.getPage().getByText('Amerant Bank').click();
    await addAccountWizard.wait(500);

    // Verificar campos SWIFT y ABA
    await addAccountWizard.verifyCableFields();
  });

  // ============================================
  // TESTS DE NAVEGACIÓN
  // ============================================

  test('debería permitir cancelar la operación usando el botón Salir', async ({
    homePage,
    addAccountWizard
  }) => {
    await homePage.clickAddAccount();
    await addAccountWizard.exit();
  });

  test('debería permitir añadir otra cuenta después de completar una', async ({
    homePage,
    addAccountWizard
  }) => {
    await homePage.clickAddAccount();

    await addAccountWizard.addAccount(
      Currency.ARS,
      'Banco Bica',
      'Cuenta Corriente $'
    );

    // Añadir otra cuenta
    await addAccountWizard.addAnotherAccount();
  });

  // ============================================
  // TESTS DE VERIFICACIÓN DE UI
  // ============================================

  test('debería mostrar las opciones de moneda correctas', async ({
    homePage,
    addAccountWizard
  }) => {
    await homePage.clickAddAccount();
    await addAccountWizard.verifyCurrencyOptions();
  });

  test('debería mostrar mensaje de demora de 24hs para habilitación', async ({
    homePage,
    addAccountWizard
  }) => {
    await homePage.clickAddAccount();
    await addAccountWizard.verifyDelayMessage();
  });

  test('debería cambiar tipos de cuenta según la moneda seleccionada', async ({
    homePage,
    addAccountWizard,
    currencySelector
  }) => {
    await homePage.clickAddAccount();

    // Seleccionar comitente y banco primero
    await addAccountWizard.getPage().locator('.select-box').first().click();
    await addAccountWizard.wait(500);
    await addAccountWizard.getPage().getByText('AGRO IN SRL -').click();

    await addAccountWizard.getPage().locator('.select-container.default > .select-box').first().click();
    await addAccountWizard.wait(500);
    await addAccountWizard.getPage().getByText('Banco Credicoop').click();

    // Verificar tipos de cuenta para ARS
    await addAccountWizard.getPage().locator('.select-container.default > .select-box').click();
    await addAccountWizard.wait(500);
    await addAccountWizard.verifyTextVisible('Cuenta Corriente $');
    await addAccountWizard.verifyTextVisible('Caja de Ahorro $');
    await addAccountWizard.closeDropdown();

    // Cambiar a USD
    await currencySelector.selectUSD();

    // Verificar tipos de cuenta para USD
    await addAccountWizard.getPage().locator('.select-container.default > .select-box').click();
    await addAccountWizard.wait(500);
    await addAccountWizard.verifyTextVisible('Cuenta Corriente u$s');
    await addAccountWizard.verifyTextVisible('Caja de Ahorro u$s');
  });
});
