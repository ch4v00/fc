import { test, expect, Page } from '@playwright/test';

// Use the stored authentication from auth.setup.ts
test.use({ storageState: 'authentication/.auth/user.json' });

/**
 * Helper: navega al Portfolio y expande la sección de Activos Valuados
 * y luego expande la categoría de fondos indicada.
 */
async function navegarAFondosEnPortfolio(page: Page, tipoFondo: 'Fondos En Dólar' | 'Fondos En Pesos') {
  // Click en portfolio desde la navegación lateral
  await page.getByRole('button', { name: 'portfolio' }).click();

  // Esperar a que cargue el portfolio
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Expandir Activos Valuados
  await page.getByRole('button', { name: 'Activos Valuados' }).click();
  await page.waitForTimeout(1000);

  // Expandir la categoría de fondos
  if (tipoFondo === 'Fondos En Dólar') {
    await page.getByRole('button', { name: /Fondos En Dólar U\$S/ }).click();
  } else {
    await page.getByRole('button', { name: /Fondos En Pesos \$/ }).click();
  }
  await page.waitForTimeout(1000);
}

/**
 * Helper: abre el menú de acciones (more_vert) del primer instrumento
 * y selecciona la acción indicada.
 */
async function seleccionarAccionFondo(page: Page, accion: 'Suscribir' | 'Rescatar') {
  // Click en el botón de acciones (more_vert) del primer instrumento
  await page.locator('button').filter({ hasText: 'more_vert' }).first().click();
  await page.waitForTimeout(500);

  // Seleccionar la acción del menú
  await page.getByRole('menuitem', { name: accion }).click();

  // Esperar a que cargue la página de la acción
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
}

test.describe('Fondos desde Portfolio - Suscripciones y Rescates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // ============================================
  // FONDOS EN DÓLAR
  // ============================================

  test('debería completar una suscripción de Fondos en Dólar desde Portfolio', async ({ page }) => {
    // Navegar al portfolio y expandir Fondos En Dólar
    await navegarAFondosEnPortfolio(page, 'Fondos En Dólar');

    // Verificar que se muestran los instrumentos
    await expect(page.getByText('IAM 44')).toBeVisible({ timeout: 10000 });

    // Abrir menú de acciones y seleccionar Suscribir
    await seleccionarAccionFondo(page, 'Suscribir');

    // Esperar a que cargue la página de suscripción
    await page.waitForURL('**/suscribir-fci', { timeout: 15000 });
    await page.waitForTimeout(3000);

    // ============================================
    // PASO 1: Ingresar monto
    // ============================================
    await expect(page.getByText('Suscribir fondo')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Paso 1 de 2')).toBeVisible();
    await expect(page.getByText('IAM Liquidez en Dólares - Clase B')).toBeVisible();
    await expect(page.getByText('IAM 44')).toBeVisible();

    // Ingresar monto
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill('1200');
    await page.waitForTimeout(500);

    // Verificar que el botón Siguiente está habilitado y hacer click
    const botonSiguiente = page.getByRole('button', { name: 'Siguiente' });
    await expect(botonSiguiente).toBeEnabled();
    await botonSiguiente.click();

    // ============================================
    // PASO 2: Confirmar solicitud
    // ============================================
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 2')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();
    await expect(page.getByText('Agro In SRL')).toBeVisible();
    await expect(page.getByText('IAM Liquidez en Dólares - Clase B')).toBeVisible();

    // Aceptar el reglamento
    await page.locator('.mat-checkbox-inner-container').click();
    await page.waitForTimeout(500);

    // Enviar solicitud
    const botonEnviar = page.getByRole('button', { name: 'Enviar solicitud' });
    await expect(botonEnviar).toBeEnabled();
    await botonEnviar.click();

    // Esperar respuesta del servidor
    await page.waitForTimeout(3000);

    // Verificar mensaje de éxito
    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Tu solicitud fue enviada con éxito')).toBeVisible();

    // Finalizar
    await page.getByRole('button', { name: 'Finalizar' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('debería completar un rescate de Fondos en Dólar desde Portfolio', async ({ page }) => {
    // Navegar al portfolio y expandir Fondos En Dólar
    await navegarAFondosEnPortfolio(page, 'Fondos En Dólar');

    // Verificar que se muestran los instrumentos
    await expect(page.getByText('IAM 44')).toBeVisible({ timeout: 10000 });

    // Abrir menú de acciones y seleccionar Rescatar
    await seleccionarAccionFondo(page, 'Rescatar');

    // Esperar a que cargue la página de rescate
    await page.waitForURL('**/rescatar-fci', { timeout: 15000 });
    await page.waitForTimeout(3000);

    // ============================================
    // PASO 1: Ingresar monto
    // ============================================
    await expect(page.getByText('Paso 1 de 2')).toBeVisible();
    await expect(page.getByText('IAM Liquidez en Dólares - Clase B')).toBeVisible();
    await expect(page.getByText('IAM 44')).toBeVisible();

    // Ingresar monto
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill('1200');
    await page.waitForTimeout(500);

    // Verificar que el botón Siguiente está habilitado y hacer click
    const botonSiguiente = page.getByRole('button', { name: 'Siguiente' });
    await expect(botonSiguiente).toBeEnabled();
    await botonSiguiente.click();

    // ============================================
    // PASO 2: Confirmar solicitud
    // ============================================
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 2')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();
    await expect(page.getByText('Agro In SRL')).toBeVisible();
    await expect(page.getByText('IAM Liquidez en Dólares - Clase B')).toBeVisible();
    await expect(page.getByText('Monto a Rescatar')).toBeVisible();

    // Enviar solicitud (no requiere aceptar reglamento en rescate)
    const botonEnviar = page.getByRole('button', { name: 'Enviar solicitud' });
    await expect(botonEnviar).toBeEnabled();
    await botonEnviar.click();

    // Esperar respuesta del servidor
    await page.waitForTimeout(3000);

    // Verificar mensaje de éxito
    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Tu solicitud fue enviada con éxito')).toBeVisible();

    // Finalizar
    await page.getByRole('button', { name: 'Finalizar' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  // ============================================
  // FONDOS EN PESOS
  // ============================================

  test('debería completar una suscripción de Fondos en Pesos desde Portfolio', async ({ page }) => {
    // Navegar al portfolio y expandir Fondos En Pesos
    await navegarAFondosEnPortfolio(page, 'Fondos En Pesos');

    // Verificar que se muestran los instrumentos
    await expect(page.getByText('GALILEO 24')).toBeVisible({ timeout: 10000 });

    // Abrir menú de acciones y seleccionar Suscribir
    await seleccionarAccionFondo(page, 'Suscribir');

    // Esperar a que cargue la página de suscripción
    await page.waitForURL('**/suscribir-fci', { timeout: 15000 });
    await page.waitForTimeout(3000);

    // ============================================
    // PASO 1: Ingresar monto
    // ============================================
    await expect(page.getByText('Paso 1 de 2')).toBeVisible();
    await expect(page.getByText('Galileo Premium - Clase B')).toBeVisible();
    await expect(page.getByText('Galileo 24')).toBeVisible();

    // Ingresar monto
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill('1200');
    await page.waitForTimeout(500);

    // Verificar que el botón Siguiente está habilitado y hacer click
    const botonSiguiente = page.getByRole('button', { name: 'Siguiente' });
    await expect(botonSiguiente).toBeEnabled();
    await botonSiguiente.click();

    // ============================================
    // PASO 2: Confirmar solicitud
    // ============================================
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 2')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();
    await expect(page.getByText('Agro In SRL')).toBeVisible();
    await expect(page.getByText('Galileo Premium - Clase B')).toBeVisible();

    // Aceptar el reglamento
    await page.locator('.mat-checkbox-inner-container').click();
    await page.waitForTimeout(500);

    // Enviar solicitud
    const botonEnviar = page.getByRole('button', { name: 'Enviar solicitud' });
    await expect(botonEnviar).toBeEnabled();
    await botonEnviar.click();

    // Esperar respuesta del servidor
    await page.waitForTimeout(3000);

    // Verificar mensaje de éxito
    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Tu solicitud fue enviada con éxito')).toBeVisible();

    // Finalizar
    await page.getByRole('button', { name: 'Finalizar' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('debería completar un rescate de Fondos en Pesos desde Portfolio', async ({ page }) => {
    // Navegar al portfolio y expandir Fondos En Pesos
    await navegarAFondosEnPortfolio(page, 'Fondos En Pesos');

    // Verificar que se muestran los instrumentos
    await expect(page.getByText('GALILEO 24')).toBeVisible({ timeout: 10000 });

    // Abrir menú de acciones y seleccionar Rescatar
    await seleccionarAccionFondo(page, 'Rescatar');

    // Esperar a que cargue la página de rescate
    await page.waitForURL('**/rescatar-fci', { timeout: 15000 });
    await page.waitForTimeout(3000);

    // ============================================
    // PASO 1: Ingresar monto
    // ============================================
    await expect(page.getByText('Paso 1 de 2')).toBeVisible();
    await expect(page.getByText('Galileo Premium - Clase B')).toBeVisible();
    await expect(page.getByText('Galileo 24')).toBeVisible();

    // Ingresar monto
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill('1200');
    await page.waitForTimeout(500);

    // Verificar que el botón Siguiente está habilitado y hacer click
    const botonSiguiente = page.getByRole('button', { name: 'Siguiente' });
    await expect(botonSiguiente).toBeEnabled();
    await botonSiguiente.click();

    // ============================================
    // PASO 2: Confirmar solicitud
    // ============================================
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 2 de 2')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();
    await expect(page.getByText('Agro In SRL')).toBeVisible();
    await expect(page.getByText('Galileo Premium - Clase B')).toBeVisible();
    await expect(page.getByText('Monto a Rescatar')).toBeVisible();

    // Enviar solicitud (no requiere aceptar reglamento en rescate)
    const botonEnviar = page.getByRole('button', { name: 'Enviar solicitud' });
    await expect(botonEnviar).toBeEnabled();
    await botonEnviar.click();

    // Esperar respuesta del servidor
    await page.waitForTimeout(3000);

    // Verificar mensaje de éxito
    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Tu solicitud fue enviada con éxito')).toBeVisible();

    // Finalizar
    await page.getByRole('button', { name: 'Finalizar' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  // ============================================
  // VALIDACIONES
  // ============================================

  test('debería mostrar el menú con opciones Suscribir y Rescatar en Fondos en Dólar', async ({ page }) => {
    // Navegar al portfolio y expandir Fondos En Dólar
    await navegarAFondosEnPortfolio(page, 'Fondos En Dólar');

    // Verificar que se muestran los instrumentos
    await expect(page.getByText('IAM 44')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Iam Liquidez En Dólares - Clase B')).toBeVisible();

    // Click en el botón de acciones del primer instrumento
    await page.locator('button').filter({ hasText: 'more_vert' }).first().click();
    await page.waitForTimeout(500);

    // Verificar que se muestran las dos opciones
    await expect(page.getByRole('menuitem', { name: 'Suscribir' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Rescatar' })).toBeVisible();
  });

  test('debería mostrar el menú con opciones Suscribir y Rescatar en Fondos en Pesos', async ({ page }) => {
    // Navegar al portfolio y expandir Fondos En Pesos
    await navegarAFondosEnPortfolio(page, 'Fondos En Pesos');

    // Verificar que se muestran los instrumentos
    await expect(page.getByText('GALILEO 24')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Galileo Premium - Clase B')).toBeVisible();

    // Click en el botón de acciones del primer instrumento
    await page.locator('button').filter({ hasText: 'more_vert' }).first().click();
    await page.waitForTimeout(500);

    // Verificar que se muestran las dos opciones
    await expect(page.getByRole('menuitem', { name: 'Suscribir' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Rescatar' })).toBeVisible();
  });

});
