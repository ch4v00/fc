import { test, expect } from '@playwright/test';

// Use the stored authentication from auth.setup.ts
test.use({ storageState: 'authentication/.auth/user.json' });

// Helper: genera monto random menor a 10000
function randomMonto(): number {
  return Math.floor(Math.random() * 9999) + 1;
}

// Helper: fecha de hoy en formato DD/MM/YYYY
function fechaHoy(): string {
  const today = new Date();
  return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
}

test.describe('Solicitar Fondos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('debería solicitar fondos por transferencia bancaria en ARS exitosamente', async ({ page }) => {
    // Click en "Solicitar Fondos"
    await page.locator('div').filter({ hasText: /^Solicitar Fondos$/ }).click();

    // Esperar a que navegue a la URL correcta
    await page.waitForURL('**/alta-retiro', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que estamos en el paso 1
    await expect(page.getByText('Paso 1 de 4')).toBeVisible({ timeout: 15000 });
    //await expect(page.getByText('Seleccioná una de las opciones:')).toBeVisible();

    // ============================================
    // PASO 1: Seleccionar Transferencia bancaria
    // ============================================
    await page.locator('div').filter({ hasText: /^Transferencia bancaria$/ }).click();

    // Esperar a que cargue el paso 2
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 4')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 2: Completar datos - ARS
    // ============================================
    // ARS está seleccionado por defecto
    await expect(page.getByText('ARS')).toBeVisible();

    // Generar monto random menor a 10000
    const monto = randomMonto();
    await page.getByRole('textbox', { name: 'Ingresa el monto' }).fill(monto.toString());

    // La fecha de pago ya viene pre-cargada con la fecha del día

    // Seleccionar cuenta destino (último mat-radio-button en la página)
    await page.waitForTimeout(1000);
    await page.locator('mat-radio-button').last().click({ force: true });
    await page.waitForTimeout(500);

    // Ingresar observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

    // Aceptar términos y condiciones
    await page.locator('.mat-checkbox-inner-container').click();
    await page.waitForTimeout(1500);

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
    await expect(page.getByText('Agro In SRL')).toBeVisible();

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

  test('debería solicitar fondos por transferencia bancaria en USD exitosamente', async ({ page }) => {
    // Click en "Solicitar Fondos"
    await page.locator('div').filter({ hasText: /^Solicitar Fondos$/ }).click();

    await page.waitForURL('**/alta-retiro', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar Transferencia bancaria
    await page.locator('div').filter({ hasText: /^Transferencia bancaria$/ }).click();
    await page.waitForTimeout(1000);

    // ============================================
    // PASO 2: Completar datos - USD
    // ============================================
    // Seleccionar USD (segunda opción de moneda)
    await page.locator('mat-radio-button').nth(1).click();
    await page.waitForTimeout(1000);

    // Generar monto random menor a 10000
    const monto = randomMonto();
    await page.getByRole('textbox', { name: 'Ingresa el monto' }).fill(monto.toString());

    // Seleccionar cuenta destino
    await page.locator('mat-radio-button').last().click({ force: true });
    await page.waitForTimeout(500);

    // Ingresar observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

    // Aceptar términos y condiciones
    await page.locator('.mat-checkbox-inner-container').click();
    await page.waitForTimeout(500);

    // Continuar
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeEnabled();
    await botonContinuar.click();

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
    await expect(page.getByText('Tu solicitud fue enviada con éxito')).toBeVisible();

    await page.getByRole('button', { name: 'Finalizar' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('debería solicitar fondos por transferencia bancaria en Dólar Cable exitosamente', async ({ page }) => {
    // Click en "Solicitar Fondos"
    await page.locator('div').filter({ hasText: /^Solicitar Fondos$/ }).click();

    await page.waitForURL('**/alta-retiro', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar Transferencia bancaria
    await page.locator('div').filter({ hasText: /^Transferencia bancaria$/ }).click();
    await page.waitForTimeout(1000);

    // ============================================
    // PASO 2: Completar datos - Dólar Cable
    // ============================================
    // Seleccionar Dólar Cable (tercera opción de moneda)
    await page.locator('mat-radio-button').nth(2).click({ force: true });
    await page.waitForTimeout(1000);

    // Generar monto random menor a 10000
    const monto = randomMonto();
    await page.getByRole('textbox', { name: 'Ingresa el monto' }).fill(monto.toString());

    // Seleccionar cuenta destino
    await page.locator('mat-radio-button').last().click({ force: true });
    await page.waitForTimeout(500);

    // Ingresar observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

    // Aceptar términos y condiciones
    await page.locator('.mat-checkbox-inner-container').click();
    await page.waitForTimeout(500);

    // Continuar
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeEnabled();
    await botonContinuar.click();

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
    await expect(page.getByText('Tu solicitud fue enviada con éxito')).toBeVisible();

    await page.getByRole('button', { name: 'Finalizar' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('debería solicitar fondos por Echeq exitosamente', async ({ page }) => {
    // Click en "Solicitar Fondos"
    await page.locator('div').filter({ hasText: /^Solicitar Fondos$/ }).click();

    await page.waitForURL('**/alta-retiro', { timeout: 10000 });
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
    const fecha = fechaHoy();

    // Ingresar Fecha de Emisión
    await page.locator('input[placeholder="dd/mm/aaaa"]').first().fill(fecha);

    // Ingresar Fecha de Pago (misma fecha para cheque al día)
    await page.locator('input[placeholder="dd/mm/aaaa"]').nth(1).fill(fecha);

    // Generar monto random menor a 10000
    const monto = randomMonto();
    await page.getByRole('textbox', { name: 'Ingresa el número' }).fill(monto.toString());

    // Click "Agregar echeq" para registrar el echeq ingresado
    await page.getByRole('button', { name: /Agregar echeq/ }).click();
    await page.waitForTimeout(500);

    // Se crea una segunda fila vacía automáticamente - eliminarla
    // El botón de eliminar está dentro del mat-form-field del monto de la fila vacía
    await page.locator('button-fyo button.large.primary').nth(1).click();
    await page.waitForTimeout(500);

    // Ingresar observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

    // Aceptar términos y condiciones
    await page.locator('.mat-checkbox-inner-container').click();
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

  test('debería validar que no se puede continuar sin completar campos requeridos en transferencia bancaria', async ({ page }) => {
    // Click en "Solicitar Fondos"
    await page.locator('div').filter({ hasText: /^Solicitar Fondos$/ }).click();

    await page.waitForURL('**/alta-retiro', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar Transferencia bancaria
    await page.locator('div').filter({ hasText: /^Transferencia bancaria$/ }).click();
    await page.waitForTimeout(1000);

    // Verificar que el botón "Continuar" está deshabilitado sin completar campos
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeDisabled();
  });

  test('debería validar que no se puede continuar sin completar campos requeridos en Echeq', async ({ page }) => {
    // Click en "Solicitar Fondos"
    await page.locator('div').filter({ hasText: /^Solicitar Fondos$/ }).click();

    await page.waitForURL('**/alta-retiro', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar Echeq
    await page.locator('div').filter({ hasText: /^Echeq$/ }).click();
    await page.waitForTimeout(1000);

    // Verificar que el botón "Continuar" está deshabilitado sin completar campos
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeDisabled();
  });

  test('debería mostrar las opciones de moneda correctas para transferencia bancaria', async ({ page }) => {
    // Click en "Solicitar Fondos"
    await page.locator('div').filter({ hasText: /^Solicitar Fondos$/ }).click();

    await page.waitForURL('**/alta-retiro', { timeout: 10000 });
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

  test('debería permitir volver atrás usando el botón Anterior', async ({ page }) => {
    // Click en "Solicitar Fondos"
    await page.locator('div').filter({ hasText: /^Solicitar Fondos$/ }).click();

    await page.waitForURL('**/alta-retiro', { timeout: 10000 });
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
    // Click en "Solicitar Fondos"
    await page.locator('div').filter({ hasText: /^Solicitar Fondos$/ }).click();

    await page.waitForURL('**/alta-retiro', { timeout: 10000 });
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

  test('debería permitir solicitar más fondos después de completar una solicitud', async ({ page }) => {
    // Click en "Solicitar Fondos"
    await page.locator('div').filter({ hasText: /^Solicitar Fondos$/ }).click();

    await page.waitForURL('**/alta-retiro', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seleccionar Transferencia bancaria
    await page.locator('div').filter({ hasText: /^Transferencia bancaria$/ }).click();
    await page.waitForTimeout(1000);

    // Completar el formulario rápidamente
    const monto = randomMonto();
    await page.getByRole('textbox', { name: 'Ingresa el monto' }).fill(monto.toString());

    await page.locator('mat-radio-button').last().click({ force: true });
    await page.waitForTimeout(2000);

    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

    await page.locator('.mat-checkbox-inner-container').click();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await page.waitForTimeout(3000);

    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });

    // Click en "Solicitar más fondos"
    await page.getByRole('button', { name: 'Solicitar más fondos' }).click();

    // Verificar que volvió al paso 1
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 1 de 4')).toBeVisible();
    await expect(page.getByText('Transferencia bancaria')).toBeVisible();
    await expect(page.getByText('Echeq')).toBeVisible();
  });
});
