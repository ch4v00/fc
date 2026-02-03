import { test, expect } from '@playwright/test';

// Helpers para generar datos random
function randomCBU(): string {
  let cbu = '';
  for (let i = 0; i < 22; i++) cbu += Math.floor(Math.random() * 10).toString();
  return cbu;
}

function randomNroCuenta(): string {
  let nro = '';
  const length = Math.floor(Math.random() * 5) + 8; // entre 8 y 12 dígitos
  for (let i = 0; i < length; i++) nro += Math.floor(Math.random() * 10).toString();
  return nro;
}

function randomSWIFT(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let swift = '';
  for (let i = 0; i < 8; i++) swift += letters[Math.floor(Math.random() * letters.length)];
  return swift;
}

function randomABA(): string {
  let aba = '';
  for (let i = 0; i < 9; i++) aba += Math.floor(Math.random() * 10).toString();
  return aba;
}

// Use the stored authentication from auth.setup.ts
test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Añadir Cuenta Bancaria', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('debería añadir una cuenta bancaria en ARS exitosamente', async ({ page }) => {
    // Click en "Añadir Cuenta"
    await page.locator('div').filter({ hasText: /^Añadir Cuenta$/ }).click();

    // Esperar a que navegue a la URL correcta
    await page.waitForURL('**/crear-cuenta-bancaria', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que estamos en el paso 1
    await expect(page.getByText('Paso 1 de 2')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Completa los datos')).toBeVisible();

    // ============================================
    // PASO 1: Completar datos de la cuenta ARS
    // ============================================
    // Verificar que ARS está seleccionado por defecto
    await expect(page.getByText('ARS')).toBeVisible();

    // Seleccionar comitente
    await page.locator('.select-box').first().click();
    await page.waitForTimeout(500);
    await page.getByText('AGRO IN SRL -').click();

    // Seleccionar banco
    await page.waitForTimeout(500);
    await page.locator('.select-container.default > .select-box').first().click();
    await page.waitForTimeout(500);
    await page.getByText('Banco Credicoop').click();

    // Ingresar CBU random
    await page.getByRole('textbox', { name: 'Ingresá el CBU' }).fill(randomCBU());

    // Ingresar número de cuenta random
    await page.getByRole('textbox', { name: 'Ingresá el número' }).fill(randomNroCuenta());

    // Ingresar observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

    // Seleccionar tipo de cuenta
    await page.locator('.select-container.default > .select-box').click();
    await page.waitForTimeout(500);
    await page.getByText('Cuenta Corriente $').click();

    // Adjuntar comprobante
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByText('Adjuntar comprobante').click()
    ]);
    await fileChooser.setFiles('test.pdf');

    await page.waitForTimeout(500);

    // Verificar que el botón "Continuar" esté habilitado y hacer click
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeEnabled();
    await botonContinuar.click();

    // Esperar a que cargue el paso 2
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 2')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 2: Confirmar solicitud
    // ============================================
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();
    await expect(page.getByText('Banco Credicoop')).toBeVisible();
    await expect(page.getByText('Pesos')).toBeVisible();

    // Click en "Enviar solicitud"
    await page.getByRole('button', { name: 'Enviar solicitud' }).click();

    // Esperar respuesta del servidor
    await page.waitForTimeout(3000);

    // ============================================
    // Verificar mensaje de éxito
    // ============================================
    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Tu solicitud fue enviada con éxito')).toBeVisible();

    // Click en "Finalizar"
    await page.getByRole('button', { name: 'Finalizar' }).click();

    // Verificar que volvió a la página principal
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('debería añadir una cuenta bancaria en USD exitosamente', async ({ page }) => {
    // Click en "Añadir Cuenta"
    await page.locator('div').filter({ hasText: /^Añadir Cuenta$/ }).click();

    await page.waitForURL('**/crear-cuenta-bancaria', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // ============================================
    // PASO 1: Completar datos de la cuenta USD
    // ============================================
    // Seleccionar comitente
    await page.locator('.select-box').first().click();
    await page.waitForTimeout(500);
    await page.getByText('AGRO IN SRL -').click();

    // Seleccionar USD
    await page.locator('mat-radio-button').nth(1).click();
    await page.waitForTimeout(500);

    // Seleccionar banco
    await page.locator('.select-container.default > .select-box').first().click();
    await page.waitForTimeout(500);
    await page.getByText('Banco Ciudad de Buenos Aires').click();

    // Ingresar CBU
    await page.getByRole('textbox', { name: 'Ingresá el CBU' }).fill(randomCBU());

    // Ingresar número de cuenta
    await page.getByRole('textbox', { name: 'Ingresá el número' }).fill(randomNroCuenta());

    // Ingresar observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

    // Seleccionar tipo de cuenta
    await page.locator('.select-container.default > .select-box').click();
    await page.waitForTimeout(500);
    await page.getByText('Cuenta Corriente u$s').click();

    // Adjuntar comprobante
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByText('Adjuntar comprobante').click()
    ]);
    await fileChooser.setFiles('test.pdf');

    await page.waitForTimeout(500);

    // Continuar
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 2')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 2: Confirmar y enviar
    // ============================================
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();
    await expect(page.getByText('Dólar')).toBeVisible();

    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await page.waitForTimeout(3000);

    // Verificar éxito
    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Finalizar' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('debería añadir una cuenta bancaria en Dólar Cable exitosamente', async ({ page }) => {
    // Click en "Añadir Cuenta"
    await page.locator('div').filter({ hasText: /^Añadir Cuenta$/ }).click();

    await page.waitForURL('**/crear-cuenta-bancaria', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // ============================================
    // PASO 1: Completar datos de la cuenta Dólar Cable
    // ============================================
    // Seleccionar comitente
    await page.locator('.select-box').first().click();
    await page.waitForTimeout(500);
    await page.getByText('AGRO IN SRL -').click();

    // Seleccionar Dólar Cable
    await page.waitForTimeout(1500);
    await page.locator('mat-radio-button').nth(2).click();
    await page.waitForTimeout(1500);

    // Seleccionar banco
    await page.locator('.select-container.default > .select-box').first().click();
    await page.waitForTimeout(500);
    await page.getByText('Amerant Bank').click();

    // Ingresar SWIFT
    await page.getByRole('textbox', { name: 'Ingresá el SWIFT' }).fill(randomSWIFT());

    // Ingresar ABA
    await page.getByRole('textbox', { name: 'Ingresá el ABA' }).fill(randomABA());

    // Ingresar número de cuenta
    await page.getByRole('textbox', { name: 'Ingresá el número' }).fill(randomNroCuenta());

    // Ingresar observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

    // Adjuntar comprobante
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByText('Adjuntar comprobante').click()
    ]);
    await fileChooser.setFiles('test.pdf');

    await page.waitForTimeout(500);

    // Continuar
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 2')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 2: Confirmar y enviar
    // ============================================
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();
    await expect(page.getByText('Dólar Cable')).toBeVisible();
    await expect(page.getByText('Amerant Bank')).toBeVisible();

    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await page.waitForTimeout(3000);

    // Verificar éxito
    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Finalizar' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('debería validar que no se puede continuar sin completar campos requeridos', async ({ page }) => {
    // Click en "Añadir Cuenta"
    await page.locator('div').filter({ hasText: /^Añadir Cuenta$/ }).click();

    await page.waitForURL('**/crear-cuenta-bancaria', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que el botón "Continuar" está deshabilitado
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeDisabled();
  });

  test('debería mostrar campos diferentes para Dólar Cable (SWIFT y ABA)', async ({ page }) => {
    // Click en "Añadir Cuenta"
    await page.locator('div').filter({ hasText: /^Añadir Cuenta$/ }).click();

    await page.waitForURL('**/crear-cuenta-bancaria', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar campos iniciales para ARS
    await expect(page.getByText('*CBU')).toBeVisible();
    await expect(page.getByText('*Tipo de Cuenta')).toBeVisible();

    // Seleccionar Dólar Cable
    await page.waitForTimeout(1500);
    await page.locator('mat-radio-button').nth(2).click();
    await page.waitForTimeout(1500);

    // Seleccionar comitente
    await page.locator('.select-box').first().click();
    await page.waitForTimeout(500);
    await page.getByText('AGRO IN SRL -').click();

    // Seleccionar un banco para ver los campos
    await page.locator('.select-container.default > .select-box').first().click();
    await page.waitForTimeout(500);
    await page.getByText('Amerant Bank').click();
    await page.waitForTimeout(500);

    // Verificar que aparecen campos SWIFT y ABA en lugar de CBU
    await expect(page.getByText('*SWIFT')).toBeVisible();
    await expect(page.getByText('*ABA')).toBeVisible();
  });

  test('debería permitir cancelar la operación usando el botón Salir', async ({ page }) => {
    // Click en "Añadir Cuenta"
    await page.locator('div').filter({ hasText: /^Añadir Cuenta$/ }).click();

    await page.waitForURL('**/crear-cuenta-bancaria', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Click en Salir
    await page.locator('.back').filter({ hasText: 'Salir' }).click();

    // Confirmar cancelación si aparece modal
    const cancelButton = page.getByRole('button', { name: 'Si, cancelar' });
    if (await cancelButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cancelButton.click();
    }

    // Verificar que volvió a la página principal
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await expect(page).toHaveURL('/');
  });

  test('debería permitir añadir otra cuenta después de completar una', async ({ page }) => {
    // Click en "Añadir Cuenta"
    await page.locator('div').filter({ hasText: /^Añadir Cuenta$/ }).click();

    await page.waitForURL('**/crear-cuenta-bancaria', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Completar formulario
    await page.locator('.select-box').first().click();
    await page.waitForTimeout(500);
    await page.getByText('AGRO IN SRL -').click();

    await page.locator('.select-container.default > .select-box').first().click();
    await page.waitForTimeout(500);
    await page.getByText('Banco Bica').click();

    await page.getByRole('textbox', { name: 'Ingresá el CBU' }).fill(randomCBU());
    await page.getByRole('textbox', { name: 'Ingresá el número' }).fill(randomNroCuenta());
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

    await page.locator('.select-container.default > .select-box').click();
    await page.waitForTimeout(500);
    await page.getByText('Cuenta Corriente $').click();

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByText('Adjuntar comprobante').click()
    ]);
    await fileChooser.setFiles('test.pdf');

    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await page.waitForTimeout(3000);

    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });

    // Click en "Añadir otra cuenta"
    await page.getByRole('button', { name: 'Añadir otra cuenta' }).click();

    // Verificar que volvió al paso 1
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 1 de 2')).toBeVisible();
    await expect(page.getByText('Completa los datos')).toBeVisible();
  });

  test('debería mostrar las opciones de moneda correctas', async ({ page }) => {
    // Click en "Añadir Cuenta"
    await page.locator('div').filter({ hasText: /^Añadir Cuenta$/ }).click();

    await page.waitForURL('**/crear-cuenta-bancaria', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que se muestran las tres monedas
    await expect(page.getByText('ARS')).toBeVisible();
    await expect(page.getByText('USD')).toBeVisible();
    await expect(page.getByText('Dólar Cable')).toBeVisible();
  });

  test('debería cambiar tipos de cuenta según la moneda seleccionada', async ({ page }) => {
    // Click en "Añadir Cuenta"
    await page.locator('div').filter({ hasText: /^Añadir Cuenta$/ }).click();

    await page.waitForURL('**/crear-cuenta-bancaria', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar comitente primero
    await page.locator('.select-box').first().click();
    await page.waitForTimeout(500);
    await page.getByText('AGRO IN SRL -').click();

    // Seleccionar banco
    await page.locator('.select-container.default > .select-box').first().click();
    await page.waitForTimeout(500);
    await page.getByText('Banco Credicoop').click();

    // Verificar tipos de cuenta para ARS
    await page.locator('.select-container.default > .select-box').click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Cuenta Corriente $')).toBeVisible();
    await expect(page.getByText('Caja de Ahorro $')).toBeVisible();
    await page.keyboard.press('Escape');

    // Cambiar a USD
    await page.locator('mat-radio-button').nth(1).click();
    await page.waitForTimeout(500);

    // Verificar tipos de cuenta para USD
    await page.locator('.select-container.default > .select-box').click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Cuenta Corriente u$s')).toBeVisible();
    await expect(page.getByText('Caja de Ahorro u$s')).toBeVisible();
  });

  test('debería mostrar mensaje de demora de 24hs para habilitación', async ({ page }) => {
    // Click en "Añadir Cuenta"
    await page.locator('div').filter({ hasText: /^Añadir Cuenta$/ }).click();

    await page.waitForURL('**/crear-cuenta-bancaria', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar mensaje informativo
    await expect(page.getByText('Las nuevas cuentas tendrán una demora de 24 hs para su habilitación.')).toBeVisible();
  });
});
