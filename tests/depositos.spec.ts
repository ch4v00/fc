import { test, expect } from '@playwright/test';

// Use the stored authentication from auth.setup.ts
test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Informar Depósito', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('debería completar un depósito con transferencia bancaria en ARS exitosamente', async ({ page }) => {
    // Click en "Informar Depósito"
    await page.locator('div').filter({ hasText: /^Informar Depósito$/ }).click();

    // Esperar a que navegue a la URL correcta
    await page.waitForURL('**/alta-deposito', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que estamos en el paso 1
    await expect(page.getByText('Paso 1 de 4')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Seleccioná una de las opciones:')).toBeVisible();

    // ============================================
    // PASO 1: Seleccionar tipo de depósito
    // ============================================
    await page.locator('div').filter({ hasText: /^Transferencia bancaria$/ }).click();

    // Esperar a que cargue el paso 2
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 4')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 2: Completar datos del depósito ARS
    // ============================================
    // Verificar que ARS está seleccionado por defecto
    await expect(page.getByText('ARS')).toBeVisible();

    // Generar monto random inferior a 100000000
    const montoRandom = Math.floor(Math.random() * 99999999) + 1;

    // Ingresar el monto
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill(montoRandom.toString());

    // Ingresar fecha de hoy
    const today = new Date();
    const fechaHoy = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    await page.locator('input[placeholder="dd/mm/aaaa"]').first().fill(fechaHoy);

    // Seleccionar cuenta origen
    await page.waitForTimeout(1000);
    await page.locator('.select-box').click();
    await page.waitForTimeout(500);
    await page.getByText('Banco de Galicia y Bs. As. SA').click();

    // Seleccionar cuenta destino fyo (primera opción)
    await page.locator('mat-radio-button').nth(3).click();
    await page.waitForTimeout(500);

    // Ingresar observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

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

    // Esperar a que cargue el paso 3
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 3 de 4')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 3: Confirmar solicitud
    // ============================================
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();

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

  test('debería completar un depósito con transferencia bancaria en USD exitosamente', async ({ page }) => {
    // Click en "Informar Depósito"
    await page.locator('div').filter({ hasText: /^Informar Depósito$/ }).click();

    await page.waitForURL('**/alta-deposito', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar Transferencia bancaria
    await page.locator('div').filter({ hasText: /^Transferencia bancaria$/ }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 4')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 2: Completar datos del depósito USD
    // ============================================
    // Seleccionar USD
    await page.locator('mat-radio-button').nth(1).click();
    await page.waitForTimeout(500);

    // Generar monto random
    const montoRandom = Math.floor(Math.random() * 99999999) + 1;
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill(montoRandom.toString());

    // Ingresar fecha de hoy
    const today = new Date();
    const fechaHoy = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    await page.locator('input[placeholder="dd/mm/aaaa"]').first().fill(fechaHoy);

    // Seleccionar cuenta origen
    await page.waitForTimeout(1000);
    await page.locator('.select-box').click();
    await page.waitForTimeout(500);
    await page.getByText('Banco de Galicia y Bs. As. SA').click();

    // Seleccionar cuenta destino fyo
    await page.locator('mat-radio-button').nth(3).click();
    await page.waitForTimeout(500);

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
    await expect(page.getByText('Paso 3 de 4')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 3: Confirmar y enviar
    // ============================================
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();
    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await page.waitForTimeout(3000);

    // Verificar éxito
    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Finalizar' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('debería completar un depósito con transferencia bancaria en Dólar Cable exitosamente', async ({ page }) => {
    // Click en "Informar Depósito"
    await page.locator('div').filter({ hasText: /^Informar Depósito$/ }).click();

    await page.waitForURL('**/alta-deposito', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar Transferencia bancaria
    await page.locator('div').filter({ hasText: /^Transferencia bancaria$/ }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 4')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 2: Completar datos del depósito Dólar Cable
    // ============================================
    // Seleccionar Dólar Cable (tercera opción de moneda)
    await page.locator('mat-radio-button').nth(2).click();
    await page.waitForTimeout(500);

    // Generar monto random
    const montoRandom = Math.floor(Math.random() * 99999999) + 1;
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill(montoRandom.toString());

    // Ingresar fecha de hoy
    const today = new Date();
    const fechaHoy = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    await page.locator('input[placeholder="dd/mm/aaaa"]').first().fill(fechaHoy);

    // Seleccionar cuenta origen
    await page.waitForTimeout(1000);
    await page.locator('.select-box').click();
    await page.waitForTimeout(500);
    await page.getByText('Amerant Bank').click();

    // Seleccionar cuenta destino fyo
    await page.locator('mat-radio-button').nth(3).click();
    await page.waitForTimeout(500);

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
    await expect(page.getByText('Paso 3 de 4')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 3: Confirmar y enviar
    // ============================================
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();
    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await page.waitForTimeout(3000);

    // Verificar éxito
    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Finalizar' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('debería completar un depósito con Echeq exitosamente', async ({ page }) => {
    // Click en "Informar Depósito"
    await page.locator('div').filter({ hasText: /^Informar Depósito$/ }).click();

    await page.waitForURL('**/alta-deposito', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que estamos en el paso 1
    await expect(page.getByText('Paso 1 de 4')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 1: Seleccionar Echeq
    // ============================================
    await page.locator('div').filter({ hasText: /^Echeq$/ }).click();

    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 4')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 2: Completar datos del Echeq
    // ============================================
    // Fecha de hoy
    const today = new Date();
    const fechaHoy = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    // Ingresar Fecha de Emisión
    await page.locator('input[placeholder="dd/mm/aaaa"]').first().fill(fechaHoy);

    // Ingresar Fecha de Pago
    await page.locator('input[placeholder="dd/mm/aaaa"]').nth(1).fill(fechaHoy);

    // Generar monto random
    const montoRandom = Math.floor(Math.random() * 99999999) + 1;
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill(montoRandom.toString());

    // Ingresar Nro de Echeq
    const nroEcheq = Math.floor(Math.random() * 999999999) + 100000000;
    await page.getByPlaceholder('Ingresá el numero').fill(nroEcheq.toString());

    // Seleccionar cuenta destino fyo
    await page.locator('mat-radio-button').first().click();
    await page.waitForTimeout(500);

    // Ingresar observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

    // Adjuntar comprobante
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByText('Adjuntar comprobante').click()
    ]);
    await fileChooser.setFiles('test.pdf');

    await page.waitForTimeout(500);

    // Verificar que el botón "Continuar" esté habilitado
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeEnabled();
    await botonContinuar.click();

    // Esperar a que cargue el paso 3
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 3 de 4')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 3: Confirmar solicitud
    // ============================================
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();

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

  test('debería validar que no se puede continuar sin completar campos requeridos en transferencia bancaria', async ({ page }) => {
    // Click en "Informar Depósito"
    await page.locator('div').filter({ hasText: /^Informar Depósito$/ }).click();

    await page.waitForURL('**/alta-deposito', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar Transferencia bancaria
    await page.locator('div').filter({ hasText: /^Transferencia bancaria$/ }).click();
    await page.waitForTimeout(1000);

    // Verificar que el botón "Continuar" está deshabilitado
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeDisabled();
  });

  test('debería validar que no se puede continuar sin completar campos requeridos en Echeq', async ({ page }) => {
    // Click en "Informar Depósito"
    await page.locator('div').filter({ hasText: /^Informar Depósito$/ }).click();

    await page.waitForURL('**/alta-deposito', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar Echeq
    await page.locator('div').filter({ hasText: /^Echeq$/ }).click();
    await page.waitForTimeout(1000);

    // Verificar que el botón "Continuar" está deshabilitado
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeDisabled();
  });

  test('debería permitir volver atrás usando el botón Anterior', async ({ page }) => {
    // Click en "Informar Depósito"
    await page.locator('div').filter({ hasText: /^Informar Depósito$/ }).click();

    await page.waitForURL('**/alta-deposito', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar Transferencia bancaria
    await page.locator('div').filter({ hasText: /^Transferencia bancaria$/ }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 4')).toBeVisible();

    // Click en "Anterior"
    await page.getByRole('button', { name: 'Anterior' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Paso 1 de 4')).toBeVisible();
  });

  test('debería permitir cancelar la operación usando el botón Salir', async ({ page }) => {
    // Click en "Informar Depósito"
    await page.locator('div').filter({ hasText: /^Informar Depósito$/ }).click();

    await page.waitForURL('**/alta-deposito', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar Transferencia bancaria
    await page.locator('div').filter({ hasText: /^Transferencia bancaria$/ }).click();
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

  test('debería permitir informar otro depósito después de completar uno', async ({ page }) => {
    // Click en "Informar Depósito"
    await page.locator('div').filter({ hasText: /^Informar Depósito$/ }).click();

    await page.waitForURL('**/alta-deposito', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar Transferencia bancaria
    await page.locator('div').filter({ hasText: /^Transferencia bancaria$/ }).click();
    await page.waitForTimeout(1000);

    // Completar el formulario rápidamente
    const montoRandom = Math.floor(Math.random() * 99999999) + 1;
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill(montoRandom.toString());

    const today = new Date();
    const fechaHoy = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    await page.locator('input[placeholder="dd/mm/aaaa"]').first().fill(fechaHoy);

    await page.waitForTimeout(1000);
    await page.locator('.select-box').click();
    await page.waitForTimeout(500);
    await page.getByText('Banco de Galicia y Bs. As. SA').click();

    await page.locator('mat-radio-button').nth(3).click();
    await page.waitForTimeout(500);

    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

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

    // Click en "Informar otro depósito"
    await page.getByRole('button', { name: 'Informar otro depósito' }).click();

    // Verificar que volvió al paso 1
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 1 de 4')).toBeVisible();
    await expect(page.getByText('Transferencia bancaria')).toBeVisible();
    await expect(page.getByText('Echeq')).toBeVisible();
  });

  test('debería mostrar las opciones de moneda correctas para transferencia bancaria', async ({ page }) => {
    // Click en "Informar Depósito"
    await page.locator('div').filter({ hasText: /^Informar Depósito$/ }).click();

    await page.waitForURL('**/alta-deposito', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar Transferencia bancaria
    await page.locator('div').filter({ hasText: /^Transferencia bancaria$/ }).click();
    await page.waitForTimeout(1000);

    // Verificar que se muestran las tres monedas
    await expect(page.getByText('ARS')).toBeVisible();
    await expect(page.getByText('USD')).toBeVisible();
    await expect(page.getByText('Dólar Cable')).toBeVisible();
  });

  test('debería cambiar las cuentas destino según la moneda seleccionada', async ({ page }) => {
    // Click en "Informar Depósito"
    await page.locator('div').filter({ hasText: /^Informar Depósito$/ }).click();

    await page.waitForURL('**/alta-deposito', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar Transferencia bancaria
    await page.locator('div').filter({ hasText: /^Transferencia bancaria$/ }).click();
    await page.waitForTimeout(1000);

    // Verificar cuenta en pesos
    await expect(page.getByText('Cuenta Corriente $').first()).toBeVisible();

    // Cambiar a USD
    await page.locator('mat-radio-button').nth(1).click();
    await page.waitForTimeout(500);

    // Verificar cuenta en dólares
    await expect(page.getByText('Cuenta Corriente u$s').first()).toBeVisible();
  });
});
