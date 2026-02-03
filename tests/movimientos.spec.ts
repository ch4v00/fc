import { test, expect } from '@playwright/test';

// Use the stored authentication from auth.setup.ts
test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Mover Fondos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('debería completar un movimiento de fondos de Mis inversiones a Granos exitosamente', async ({ page }) => {
    // Click en "Mover Fondos"
    await page.locator('div').filter({ hasText: /^Mover Fondos$/ }).click();

    // Esperar a que navegue a la URL correcta
    await page.waitForURL('**/mover-fondos', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que estamos en el paso 1
    await expect(page.getByText('Paso 1 de 3')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Mover fondos')).toBeVisible();

    // ============================================
    // PASO 1: Configurar movimiento de fondos
    // ============================================

    // Verificar origen y destino inicial
    await expect(page.getByText('Origen')).toBeVisible();
    await expect(page.getByText('Destino')).toBeVisible();

    // Intercambiar origen y destino (click en el botón de swap)
    await page.locator('button').filter({ hasText: '' }).first().click();
    await page.waitForTimeout(500);

    // Verificar que se intercambiaron (ahora debería ser "De mis inversiones a mis negocios")
    await expect(page.getByText('De mis inversiones a mis negocios')).toBeVisible();

    // Generar monto random inferior a 20000
    const montoRandom = Math.floor(Math.random() * 19999) + 1;

    // Ingresar el monto
    await page.getByRole('textbox', { name: 'Ingresa el monto' }).fill(montoRandom.toString());

    // Ingresar observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

    // Esperar un momento
    await page.waitForTimeout(500);

    // Aceptar términos y condiciones
    await page.locator('.mat-checkbox-inner-container').click();
    await page.waitForTimeout(500);

    // Verificar que el botón "Continuar" esté habilitado
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeEnabled();

    // Click en "Continuar"
    await botonContinuar.click();

    // Esperar a que cargue el paso 2
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 3')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 2: Confirmar solicitud
    // ============================================
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();

    // Verificar que se muestran los datos correctos
    await expect(page.getByText('Origen')).toBeVisible();
    await expect(page.getByText('Monto')).toBeVisible();

    // Verificar que el botón "Enviar solicitud" esté habilitado
    const botonEnviar = page.getByRole('button', { name: 'Enviar solicitud' });
    await expect(botonEnviar).toBeEnabled();

    // Click en "Enviar solicitud"
    await botonEnviar.click();

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

  test.skip('debería completar un movimiento de fondos de Granos a Mis inversiones exitosamente', async ({ page }) => {
    // Click en "Mover Fondos"
    await page.locator('div').filter({ hasText: /^Mover Fondos$/ }).click();

    // Esperar a que navegue a la URL correcta
    await page.waitForURL('**/mover-fondos', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que estamos en el paso 1
    await expect(page.getByText('Paso 1 de 3')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 1: Configurar movimiento de fondos (sin intercambiar)
    // ============================================

    // Verificar que el origen inicial es Granos
    await expect(page.getByText('De granos a mis inversiones')).toBeVisible();

    // Generar monto random inferior a 20000
    const montoRandom = Math.floor(Math.random() * 19999) + 1;

    // Ingresar el monto
    await page.getByRole('textbox', { name: 'Ingresa el monto' }).fill(montoRandom.toString());

    // Ingresar observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

    // Esperar un momento
    await page.waitForTimeout(500);

    // Aceptar términos y condiciones
    await page.locator('.mat-checkbox-inner-container').click();
    await page.waitForTimeout(500);

    // Verificar que el botón "Continuar" esté habilitado
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeEnabled();

    // Click en "Continuar"
    await botonContinuar.click();

    // Esperar a que cargue el paso 2
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 3')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 2: Confirmar solicitud
    // ============================================
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();

    // Verificar que se muestran los datos correctos
    await expect(page.getByText('Origen')).toBeVisible();
    await expect(page.getByText('Granos').first()).toBeVisible();
    await expect(page.getByText('Destino')).toBeVisible();
    await expect(page.getByText('Mis inversiones')).toBeVisible();

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

  test('debería permitir usar el botón MAX para el monto', async ({ page }) => {
    // Click en "Mover Fondos"
    await page.locator('div').filter({ hasText: /^Mover Fondos$/ }).click();

    await page.waitForURL('**/mover-fondos', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Intercambiar para tener saldo disponible (Mis inversiones tiene saldo)
    await page.locator('button').filter({ hasText: '' }).first().click();
    await page.waitForTimeout(3000);

    // Click en el botón MAX
    await page.getByText('MAX').click();
    await page.waitForTimeout(500);

    // Verificar que el monto se llenó automáticamente
    const inputMonto = page.getByRole('textbox', { name: 'Ingresa el monto' });
    const montoValue = await inputMonto.inputValue();
    expect(montoValue).not.toBe('');
    expect(parseFloat(montoValue.replace(/\./g, '').replace(',', '.'))).toBeGreaterThan(0);
  });

  test('debería validar que no se puede continuar sin ingresar monto', async ({ page }) => {
    // Click en "Mover Fondos"
    await page.locator('div').filter({ hasText: /^Mover Fondos$/ }).click();

    await page.waitForURL('**/mover-fondos', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que el botón "Continuar" está deshabilitado sin monto
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeDisabled();
  });

  test('debería validar que no se puede continuar sin aceptar términos y condiciones', async ({ page }) => {
    // Click en "Mover Fondos"
    await page.locator('div').filter({ hasText: /^Mover Fondos$/ }).click();

    await page.waitForURL('**/mover-fondos', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Ingresar monto
    await page.getByRole('textbox', { name: 'Ingresa el monto' }).fill('5000');

    // Ingresar observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');

    await page.waitForTimeout(500);

    // Verificar que el botón "Continuar" está deshabilitado sin aceptar términos
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeDisabled();
  });

  test('debería permitir volver atrás usando el botón Anterior', async ({ page }) => {
    // Click en "Mover Fondos"
    await page.locator('div').filter({ hasText: /^Mover Fondos$/ }).click();

    await page.waitForURL('**/mover-fondos', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Completar paso 1
    await page.getByRole('textbox', { name: 'Ingresa el monto' }).fill('5000');
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');
    await page.locator('.mat-checkbox-inner-container').click();
    await page.waitForTimeout(500);

    // Continuar al paso 2
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 3')).toBeVisible();

    // Click en "Anterior" para volver al paso 1
    await page.getByRole('button', { name: 'Anterior' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Paso 1 de 3')).toBeVisible();
  });

  test('debería permitir cancelar la operación usando el botón Salir', async ({ page }) => {
    // Click en "Mover Fondos"
    await page.locator('div').filter({ hasText: /^Mover Fondos$/ }).click();

    await page.waitForURL('**/mover-fondos', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Buscar y hacer click en el botón de salir
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

  test('debería permitir realizar otro movimiento después de completar uno', async ({ page }) => {
    // Click en "Mover Fondos"
    await page.locator('div').filter({ hasText: /^Mover Fondos$/ }).click();

    await page.waitForURL('**/mover-fondos', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Intercambiar origen y destino (click en el botón de swap)
    await page.locator('button').filter({ hasText: '' }).first().click();
    await page.waitForTimeout(500);

    // Completar el flujo
    const montoRandom = Math.floor(Math.random() * 19999) + 1;
    await page.getByRole('textbox', { name: 'Ingresa el monto' }).fill(montoRandom.toString());
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test Automatizado');
    await page.locator('.mat-checkbox-inner-container').click();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await page.waitForTimeout(3000);

    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });

    // Click en "Realizar otro movimiento"
    await page.getByRole('button', { name: 'Realizar otro movimiento' }).click();

    // Verificar que volvió al paso 1
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 1 de 3')).toBeVisible();
    await expect(page.getByText('Mover fondos')).toBeVisible();
  });

  test('debería mostrar el saldo disponible al intercambiar a Mis inversiones como origen', async ({ page }) => {
    // Click en "Mover Fondos"
    await page.locator('div').filter({ hasText: /^Mover Fondos$/ }).click();

    await page.waitForURL('**/mover-fondos', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Intercambiar origen y destino
    await page.locator('button').filter({ hasText: '' }).first().click();
    await page.waitForTimeout(500);

    // Verificar que se muestra el Total Disponible
    await expect(page.getByText('Total Disponible')).toBeVisible();
  });
});
