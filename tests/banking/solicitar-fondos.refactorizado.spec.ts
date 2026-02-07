import { test, expect } from '@playwright/test';
import { SolicitarFondosWizard, MetodoRetiro, Moneda } from '../../pages/banking/SolicitarFondosWizard';
import { DataGenerator } from '../../utils/generators/DataGenerator';
import { DateHelper } from '../../utils/generators/DateHelper';

// Usar la autenticación almacenada desde auth.setup.ts
test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Solicitar Fondos', () => {
  let solicitarFondosWizard: SolicitarFondosWizard;

  test.beforeEach(async ({ page }) => {
    solicitarFondosWizard = new SolicitarFondosWizard(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navegar a solicitar fondos
    await page.locator('div').filter({ hasText: /^Solicitar Fondos$/ }).click();
    await page.waitForURL('**/alta-retiro', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await solicitarFondosWizard.wait(1000);
  });

  // ============================================
  // TESTS DE TRANSFERENCIA BANCARIA
  // ============================================

  test('retirar ARS vía transferencia bancaria', async () => {
    const amount = DataGenerator.randomAmount();
    await solicitarFondosWizard.retirarPorTransferenciaBancaria(amount.toString(), Moneda.ARS);
  });

  test('retirar USD vía transferencia bancaria', async ({ page }) => {
    await solicitarFondosWizard.seleccionarMetodoRetiro(MetodoRetiro.TRANSFERENCIA_BANCARIA);
    await solicitarFondosWizard.wait(10000);

    const amount = DataGenerator.randomAmount();
    await solicitarFondosWizard.seleccionarMoneda(Moneda.USD);
    await solicitarFondosWizard.wait(10000);

    await solicitarFondosWizard.fillInput('Ingresa el monto', amount.toString());
    await page.locator('mat-radio-button').last().click({ force: true });
    await solicitarFondosWizard.wait(500);

    await solicitarFondosWizard.fillInput('Ingresá una observación', 'Test Automatizado');
    await solicitarFondosWizard.wait(1000);
    await solicitarFondosWizard.clickCheckbox();
    await solicitarFondosWizard.wait(500);

    await solicitarFondosWizard.verifyButtonEnabled('Continuar');
    await solicitarFondosWizard.clickButton('Continuar');
    await solicitarFondosWizard.wait(1000);

    await solicitarFondosWizard.confirmarSolicitudRetiro();
    await solicitarFondosWizard.completeSuccessFlow();
  });

  test('retirar Dólar Cable vía transferencia bancaria', async ({ page }) => {
    await solicitarFondosWizard.seleccionarMetodoRetiro(MetodoRetiro.TRANSFERENCIA_BANCARIA);
    await solicitarFondosWizard.wait(5000);

    const amount = DataGenerator.randomAmount();
    await solicitarFondosWizard.seleccionarMoneda(Moneda.CABLE);
    await solicitarFondosWizard.wait(1000);

    await solicitarFondosWizard.fillInput('Ingresa el monto', amount.toString());
    await solicitarFondosWizard.wait(3000);

    await page.locator('mat-radio-button').last().click({ force: true });
    await solicitarFondosWizard.wait(500);

    await solicitarFondosWizard.fillInput('Ingresá una observación', 'Test Automatizado');
    await solicitarFondosWizard.clickCheckbox();
    await solicitarFondosWizard.wait(500);

    await solicitarFondosWizard.verifyButtonEnabled('Continuar');
    await solicitarFondosWizard.clickButton('Continuar');
    await solicitarFondosWizard.wait(1000);

    await solicitarFondosWizard.confirmarSolicitudRetiro();
    await solicitarFondosWizard.completeSuccessFlow();
  });

  // ============================================
  // TESTS DE ECHEQ
  // ============================================

  test('retirar vía Echeq', async () => {
    const today = DateHelper.today();
    const amount = DataGenerator.randomAmount();

    await solicitarFondosWizard.retirarPorEcheq(today, amount.toString());
  });

  // ============================================
  // TESTS DE VALIDACIÓN
  // ============================================

  test('validar campos requeridos para transferencia bancaria', async () => {
    await solicitarFondosWizard.seleccionarMetodoRetiro(MetodoRetiro.TRANSFERENCIA_BANCARIA);
    await solicitarFondosWizard.wait(1000);

    await solicitarFondosWizard.verificarBotonContinuarDeshabilitado();
  });

  test('validar campos requeridos para Echeq', async () => {
    await solicitarFondosWizard.seleccionarMetodoRetiro(MetodoRetiro.ECHEQ);
    await solicitarFondosWizard.wait(1000);

    await solicitarFondosWizard.verificarBotonContinuarDeshabilitado();
  });

  test('mostrar opciones de moneda para transferencia bancaria', async () => {
    await solicitarFondosWizard.seleccionarMetodoRetiro(MetodoRetiro.TRANSFERENCIA_BANCARIA);
    await solicitarFondosWizard.wait(1000);

    await solicitarFondosWizard.verificarOpcionesMoneda();
  });

  // ============================================
  // TESTS DE NAVEGACIÓN
  // ============================================

  test('navegar hacia atrás usando botón Anterior', async () => {
    await solicitarFondosWizard.seleccionarMetodoRetiro(MetodoRetiro.TRANSFERENCIA_BANCARIA);
    await solicitarFondosWizard.wait(1000);
    await solicitarFondosWizard.verifyStep(2, 4);

    await solicitarFondosWizard.previous();
    await solicitarFondosWizard.wait(500);
    await solicitarFondosWizard.verifyStep(1, 4);
  });

  test('cancelar operación usando botón Salir', async ({ page }) => {
    await solicitarFondosWizard.seleccionarMetodoRetiro(MetodoRetiro.TRANSFERENCIA_BANCARIA);
    await solicitarFondosWizard.wait(1000);

    await page.locator('.back').filter({ hasText: 'Salir' }).click();

    const cancelButton = page.getByRole('button', { name: 'Si, cancelar' });
    if (await cancelButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cancelButton.click();
    }

    await page.waitForLoadState('networkidle');
    await solicitarFondosWizard.wait(500);
    await expect(page).toHaveURL('/');
  });

  test.skip('solicitar más fondos después de completar una solicitud', async ({ page }) => {
    const amount = DataGenerator.randomAmount();

    await solicitarFondosWizard.seleccionarMetodoRetiro(MetodoRetiro.TRANSFERENCIA_BANCARIA);
    await solicitarFondosWizard.wait(15000);

    await solicitarFondosWizard.fillInput('Ingresa el monto', amount.toString());
    await solicitarFondosWizard.wait(1000);

    await page.locator('mat-radio-button').last().click({ force: true });
    await solicitarFondosWizard.wait(2000);

    await solicitarFondosWizard.fillInput('Ingresá una observación', 'Test Automatizado');
    await solicitarFondosWizard.clickCheckbox();
    await solicitarFondosWizard.wait(500);

    await solicitarFondosWizard.clickButton('Continuar');
    await solicitarFondosWizard.wait(1000);

    await solicitarFondosWizard.clickButton('Enviar solicitud');
    await solicitarFondosWizard.wait(3000);

    await solicitarFondosWizard.verifyTextVisible('¡Felicitaciones!');

    await solicitarFondosWizard.solicitarMasFondos();
  });
});
