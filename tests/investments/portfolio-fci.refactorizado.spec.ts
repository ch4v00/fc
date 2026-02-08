import { test, expect } from '@playwright/test';
import { SuscribirFCIWizard } from '../../pages/investments/SuscribirFCIWizard';
import { RescatarFCIWizard } from '../../pages/investments/RescatarFCIWizard';

// Usar la autenticación almacenada desde auth.setup.ts
test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Portfolio FCI - Suscribir y Rescatar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });
  /*
  // ============================================
  // FONDOS EN DÓLARES - SUSCRIPCIÓN
  // ============================================

  test('suscribir fondo en Dólares desde portfolio', async ({ page }) => {
    const suscribirWizard = new SuscribirFCIWizard(page);

    await suscribirWizard.navegarAFondosEnPortfolio('Fondos En Dólar');
    await suscribirWizard.verificarFondoEnLista('IAM 44');
    await suscribirWizard.seleccionarAccionSuscribir();
    await suscribirWizard.verificarInfoFondo('IAM Liquidez en Dólares - Clase B', 'IAM 44');
    await suscribirWizard.ingresarMonto('1200');
    await suscribirWizard.confirmarSuscripcion();
    await suscribirWizard.completeSuccessFlow();
  });

  // ============================================
  // FONDOS EN DÓLARES - RESCATE
  // ============================================

  test('rescatar fondo en Dólares desde portfolio', async ({ page }) => {
    const rescatarWizard = new RescatarFCIWizard(page);

    await rescatarWizard.navegarAFondosEnPortfolio('Fondos En Dólar');
    await rescatarWizard.verificarFondoEnLista('IAM 44');
    await rescatarWizard.seleccionarAccionRescatar();
    await rescatarWizard.verificarInfoFondo('IAM Liquidez en Dólares - Clase B', 'IAM 44');
    await rescatarWizard.ingresarMonto('1200');
    await rescatarWizard.confirmarRescate();
    await rescatarWizard.completeSuccessFlow();
  });

  // ============================================
  // FONDOS EN PESOS - SUSCRIPCIÓN
  // ============================================

  test('suscribir fondo en Pesos desde portfolio', async ({ page }) => {
    const suscribirWizard = new SuscribirFCIWizard(page);

    await suscribirWizard.navegarAFondosEnPortfolio('Fondos En Pesos');
    await suscribirWizard.verificarFondoEnLista('GALILEO 24');
    await suscribirWizard.seleccionarAccionSuscribir();
    await suscribirWizard.verificarInfoFondo('Galileo Premium - Clase B', 'Galileo 24');
    await suscribirWizard.ingresarMonto('1200');
    await suscribirWizard.confirmarSuscripcion();
    await suscribirWizard.completeSuccessFlow();
  });

  // ============================================
  // FONDOS EN PESOS - RESCATE
  // ============================================

  test('rescatar fondo en Pesos desde portfolio', async ({ page }) => {
    const rescatarWizard = new RescatarFCIWizard(page);

    await rescatarWizard.navegarAFondosEnPortfolio('Fondos En Pesos');
    await rescatarWizard.verificarFondoEnLista('GALILEO 24');
    await rescatarWizard.seleccionarAccionRescatar();
    await rescatarWizard.verificarInfoFondo('Galileo Premium - Clase B', 'Galileo 24');
    await rescatarWizard.ingresarMonto('1200');
    await rescatarWizard.confirmarRescate();
    await rescatarWizard.completeSuccessFlow();
  });
  */
  // ============================================
  // MÉTODOS RÁPIDOS
  // ============================================

  test('suscribir rápidamente a fondo en Dólares', async ({ page }) => {
    const suscribirWizard = new SuscribirFCIWizard(page);
    await suscribirWizard.suscribirFondoDolar('1200');
  });

  test('suscribir rápidamente a fondo en Pesos', async ({ page }) => {
    const suscribirWizard = new SuscribirFCIWizard(page);
    await suscribirWizard.suscribirFondoPeso('1200');
  });

  test('rescatar rápidamente fondo en Dólares', async ({ page }) => {
    const rescatarWizard = new RescatarFCIWizard(page);
    await rescatarWizard.rescatarFondoDolar('1200');
  });

  test('rescatar rápidamente fondo en Pesos', async ({ page }) => {
    const rescatarWizard = new RescatarFCIWizard(page);
    await rescatarWizard.rescatarFondoPeso('1200');
  });

  // ============================================
  // VALIDACIONES
  // ============================================

  test('mostrar opciones de menú Suscribir y Rescatar para fondos en Dólares', async ({ page }) => {
    const suscribirWizard = new SuscribirFCIWizard(page);

    await suscribirWizard.navegarAFondosEnPortfolio('Fondos En Dólar');
    await suscribirWizard.verificarFondoEnLista('IAM 44');
    await suscribirWizard.verifyTextVisible('Iam Liquidez En Dólares - Clase B');

    await page.locator('button').filter({ hasText: 'more_vert' }).first().click();
    await suscribirWizard.wait(500);

    await expect(page.getByRole('menuitem', { name: 'Suscribir' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Rescatar' })).toBeVisible();
  });

  test('mostrar opciones de menú Suscribir y Rescatar para fondos en Pesos', async ({ page }) => {
    const suscribirWizard = new SuscribirFCIWizard(page);

    await suscribirWizard.navegarAFondosEnPortfolio('Fondos En Pesos');
    await suscribirWizard.verificarFondoEnLista('GALILEO 24');
    await suscribirWizard.verifyTextVisible('Galileo Premium - Clase B');

    await page.locator('button').filter({ hasText: 'more_vert' }).first().click();
    await suscribirWizard.wait(500);

    await expect(page.getByRole('menuitem', { name: 'Suscribir' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Rescatar' })).toBeVisible();
  });
});
