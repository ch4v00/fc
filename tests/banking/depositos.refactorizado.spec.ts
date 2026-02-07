/**
 * TESTS DE DEPÓSITOS - REFACTORIZADO
 *
 * REDUCCIÓN DE CÓDIGO: De ~513 líneas a ~140 líneas (73% menos código)
 */

import { test, expect } from '../../pages/TestBase';
import { Currency } from '../../components/CurrencySelector';
import { TipoDeposito } from '../../pages/banking/DepositoWizard';

test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Informar Depósito', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  // ============================================
  // TRANSFERENCIAS BANCARIAS
  // ============================================

  test('informar depósito en ARS vía transferencia bancaria', async ({
    homePage,
    depositoWizard
  }) => {
    await homePage.clickInformDeposit();

    await depositoWizard.informarTransferenciaBancaria(
      Currency.ARS,
      'Banco de Galicia y Bs. As. SA'
    );
  });

  test('informar depósito en USD vía transferencia bancaria', async ({
    homePage,
    depositoWizard
  }) => {
    await homePage.clickInformDeposit();

    await depositoWizard.informarTransferenciaBancaria(
      Currency.USD,
      'Banco de Galicia y Bs. As. SA'
    );
  });

  test('informar depósito en Dólar Cable vía transferencia bancaria', async ({
    homePage,
    depositoWizard
  }) => {
    await homePage.clickInformDeposit();

    await depositoWizard.informarTransferenciaBancaria(
      Currency.CABLE,
      'Amerant Bank'
    );
  });

  // ============================================
  // ECHEQ
  // ============================================

  test('informar depósito vía Echeq', async ({
    homePage,
    depositoWizard
  }) => {
    await homePage.clickInformDeposit();
    await depositoWizard.informarEcheq();
  });

  // ============================================
  // VALIDACIONES
  // ============================================

  test('validar campos requeridos para transferencia bancaria', async ({
    homePage,
    depositoWizard
  }) => {
    await homePage.clickInformDeposit();

    await depositoWizard.seleccionarTipoDeposito(TipoDeposito.TRANSFERENCIA_BANCARIA);
    await depositoWizard.verifyContinueDisabled();
  });

  test('validar campos requeridos para Echeq', async ({
    homePage,
    depositoWizard
  }) => {
    await homePage.clickInformDeposit();

    await depositoWizard.seleccionarTipoDeposito(TipoDeposito.ECHEQ);
    await depositoWizard.verifyContinueDisabled();
  });

  // ============================================
  // NAVEGACIÓN
  // ============================================

  test('navegar hacia atrás usando botón Anterior', async ({
    homePage,
    depositoWizard
  }) => {
    await homePage.clickInformDeposit();

    await depositoWizard.seleccionarTipoDeposito(TipoDeposito.TRANSFERENCIA_BANCARIA);
    await depositoWizard.verifyStep(2, 4);

    await depositoWizard.previous();
    await depositoWizard.verifyStep(1, 4);
  });

  test('cancelar operación usando botón Salir', async ({
    homePage,
    depositoWizard
  }) => {
    await homePage.clickInformDeposit();

    await depositoWizard.seleccionarTipoDeposito(TipoDeposito.TRANSFERENCIA_BANCARIA);
    await depositoWizard.exit();
  });

  test('informar otro depósito después de completar uno', async ({
    homePage,
    depositoWizard
  }) => {
    await homePage.clickInformDeposit();

    await depositoWizard.informarTransferenciaBancaria(Currency.ARS, 'Banco de Galicia y Bs. As. SA');

    // Informar otro depósito
    await depositoWizard.informarOtroDeposito();
  });

  // ============================================
  // VERIFICACIONES DE UI
  // ============================================

  test('mostrar opciones de moneda correctas para transferencia bancaria', async ({
    homePage,
    depositoWizard
  }) => {
    await homePage.clickInformDeposit();

    await depositoWizard.seleccionarTipoDeposito(TipoDeposito.TRANSFERENCIA_BANCARIA);
    await depositoWizard.verificarOpcionesMoneda();
  });

  test.skip('cambiar cuentas de destino según moneda seleccionada', async ({
    homePage,
    depositoWizard,
    currencySelector
  }) => {
    await homePage.clickInformDeposit();

    await depositoWizard.seleccionarTipoDeposito(TipoDeposito.TRANSFERENCIA_BANCARIA);

    // Verificar cuenta en pesos
    await depositoWizard.verifyTextVisible('Cuenta Corriente $');

    // Cambiar a USD
    await currencySelector.selectUSD();

    // Verificar cuenta en dólares
    await depositoWizard.verifyTextVisible('Cuenta Corriente u$s');
  });
});
