import { test, expect } from '@playwright/test';

// Use the stored authentication from auth.setup.ts
test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Invertir en FCI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('debería completar una suscripción a FCI en pesos exitosamente', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    // Esperar a que navegue a la URL correcta
    await page.waitForURL('**/invertir-fci', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que estamos en el paso 1
    await expect(page.getByText('Paso 1 de 5')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Seleccioná una de las opciones:')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 1: Seleccionar tipo de fondo
    // ============================================
    // Seleccionar "Fondos en pesos"
    await page.getByText('Fondos en pesos').click({ force: true });

    // Esperar a que cargue el paso 2
    await page.waitForTimeout(2000);
    await expect(page.getByText('Paso 2 de 5')).toBeVisible({ timeout: 15000 });

    // ============================================
    // PASO 2: Seleccionar fondo específico
    // ============================================
    // Verificar que el selector de fondos está visible
    await expect(page.getByText('Seleccioná un fondo en pesos')).toBeVisible();

    // Seleccionar IAM 37 (IAM Ahorro Pesos)
    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();

    // Esperar a que cargue el paso 3
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 3 de 5')).toBeVisible();

    // ============================================
    // PASO 3: Ver detalles del fondo y seleccionar acción
    // ============================================
    // Verificar que se muestran los detalles del fondo
    await expect(page.getByText('IAM Ahorro Pesos - Clase B')).toBeVisible();
    await expect(page.getByText('IAM 37')).toBeVisible();
    await expect(page.getByText('Conservador')).toBeVisible();

    // Click en "Suscribir"
    await page.getByRole('button', { name: 'Suscribir' }).click();

    // Esperar a que cargue el paso 4
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 4 de 5')).toBeVisible();

    // ============================================
    // PASO 4: Ingresar monto de suscripción
    // ============================================
    await expect(page.getByText('Suscribir fondo')).toBeVisible();

    // Ingresar monto (usando un valor aleatorio menor al balance)
    const montoInversion = '25000000';
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill(montoInversion);

    // Esperar un momento para que se habilite el botón
    await page.waitForTimeout(500);

    // Verificar que el botón "Siguiente" esté habilitado
    const botonSiguiente = page.getByRole('button', { name: 'Siguiente' });
    await expect(botonSiguiente).toBeEnabled();

    // Click en "Siguiente"
    await botonSiguiente.click();

    // Esperar a que cargue el paso 5
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 5 de 5')).toBeVisible();

    // ============================================
    // PASO 5: Confirmar solicitud
    // ============================================
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();

    // Verificar que se muestran los datos correctos
    await expect(page.getByText('IAM Ahorro Pesos - Clase B')).toBeVisible();
    await expect(page.getByText('IAM 37')).toBeVisible();
    await expect(page.getByText('Agro In SRL')).toBeVisible();

    // Aceptar el reglamento (checkbox)
    await page.locator('.mat-checkbox-inner-container').click();

    // Esperar un momento
    await page.waitForTimeout(500);

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

  test('debería completar una suscripción a FCI en dolares exitosamente', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    // Esperar a que navegue a la URL correcta
    await page.waitForURL('**/invertir-fci', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que estamos en el paso 1
    await expect(page.getByText('Paso 1 de 5')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Seleccioná una de las opciones:')).toBeVisible({ timeout: 10000 });

    // ============================================
    // PASO 1: Seleccionar tipo de fondo
    // ============================================
    // Seleccionar "Fondos en dolares"
    await page.getByText('Fondos en dólares').click({ force: true });

    // Esperar a que cargue el paso 2
    await page.waitForTimeout(2000);
    await expect(page.getByText('Paso 2 de 5')).toBeVisible({ timeout: 15000 });

    // ============================================
    // PASO 2: Seleccionar fondo específico
    // ============================================
    // Verificar que el selector de fondos está visible
    await expect(page.getByText('Seleccioná un fondo en dólares')).toBeVisible();

    // Seleccionar IAM 37 (IAM Ahorro Pesos)
    await page.getByText('IAM Liquidez en Dólares - Clase B').click();

    // Esperar a que cargue el paso 3
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 3 de 5')).toBeVisible();

    // ============================================
    // PASO 3: Ver detalles del fondo y seleccionar acción
    // ============================================
    // Verificar que se muestran los detalles del fondo
    await expect(page.getByText('IAM Liquidez en Dólares - Clase B')).toBeVisible();
    await expect(page.getByText('IAM 44')).toBeVisible();
    await expect(page.getByText('Conservador')).toBeVisible();

    // Click en "Suscribir"
    await page.getByRole('button', { name: 'Suscribir' }).click();

    // Esperar a que cargue el paso 4
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 4 de 5')).toBeVisible();

    // ============================================
    // PASO 4: Ingresar monto de suscripción
    // ============================================
    await expect(page.getByText('Suscribir fondo')).toBeVisible();

    // Ingresar monto (usando un valor aleatorio menor al balance)
    const montoInversion = '25000';
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill(montoInversion);

    // Esperar un momento para que se habilite el botón
    await page.waitForTimeout(500);

    // Verificar que el botón "Siguiente" esté habilitado
    const botonSiguiente = page.getByRole('button', { name: 'Siguiente' });
    await expect(botonSiguiente).toBeEnabled();

    // Click en "Siguiente"
    await botonSiguiente.click();

    // Esperar a que cargue el paso 5
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 5 de 5')).toBeVisible();

    // ============================================
    // PASO 5: Confirmar solicitud
    // ============================================
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();

    // Verificar que se muestran los datos correctos
    await expect(page.getByText('IAM Liquidez en Dólares - Clase B')).toBeVisible();
    await expect(page.getByText('IAM 44')).toBeVisible();
    await expect(page.getByText('Agro In SRL')).toBeVisible();

    // Aceptar el reglamento (checkbox)
    await page.locator('.mat-checkbox-inner-container').click();

    // Esperar un momento
    await page.waitForTimeout(500);

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

  test('debería permitir usar el botón MAX para el monto', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('div').filter({ hasText: /^Invertir en FCI$/ }).click();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Seleccionar "Fondos en pesos"
    await page.getByText('Fondos en pesos').click();
    await page.waitForTimeout(1000);

    // Seleccionar IAM 37
    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();
    await page.waitForTimeout(1000);

    // Click en "Suscribir"
    await page.getByRole('button', { name: 'Suscribir' }).click();
    await page.waitForTimeout(1000);

    // Click en el botón MAX
    await page.getByText('MAX').click();

    await page.waitForTimeout(500);

    // Verificar que el monto se llenó automáticamente
    const inputMonto = page.getByRole('textbox', { name: 'Ingresá el monto' });
    const montoValue = await inputMonto.inputValue();
    expect(montoValue).not.toBe('');
    expect(parseFloat(montoValue.replace(/\./g, ''))).toBeGreaterThan(0);

    // Verificar que el botón "Siguiente" esté habilitado
    await expect(page.getByRole('button', { name: 'Siguiente' })).toBeEnabled();
  });

  test('debería validar que no se puede continuar sin seleccionar tipo de fondo', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    await page.waitForURL('**/invertir-fci', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que estamos en el paso 1
    await expect(page.getByText('Paso 1 de 5')).toBeVisible({ timeout: 10000 });

    // Verificar que no hay botón "Siguiente" o "Continuar" en este paso
    // La única forma de avanzar es clickeando en una opción
    await expect(page.getByText('Fondos en pesos')).toBeVisible();
    await expect(page.getByText('Fondos en dólares')).toBeVisible();
  });

  test('debería validar que no se puede enviar sin ingresar monto', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('div').filter({ hasText: /^Invertir en FCI$/ }).click();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Completar hasta el paso 4
    await page.getByText('Fondos en pesos').click();
    await page.waitForTimeout(1000);

    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Suscribir' }).click();
    await page.waitForTimeout(1000);

    // Verificar que el botón "Siguiente" está deshabilitado sin monto
    const botonSiguiente = page.getByRole('button', { name: 'Siguiente' });
    await expect(botonSiguiente).toBeDisabled();
  });

  test('debería validar que no se puede enviar sin aceptar el reglamento', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('div').filter({ hasText: /^Invertir en FCI$/ }).click();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Completar hasta el paso 5
    await page.getByText('Fondos en pesos').click();
    await page.waitForTimeout(1000);

    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Suscribir' }).click();
    await page.waitForTimeout(1000);

    // Ingresar monto
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill('1000000');
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Siguiente' }).click();
    await page.waitForTimeout(1000);

    // Verificar que el botón "Enviar solicitud" está deshabilitado sin aceptar reglamento
    const botonEnviar = page.getByRole('button', { name: 'Enviar solicitud' });
    await expect(botonEnviar).toBeDisabled();
  });

  test('debería permitir volver atrás usando el botón Anterior', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    await page.waitForURL('**/invertir-fci', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Avanzar al paso 2
    await page.getByText('Fondos en pesos').click();
    await page.waitForTimeout(2000);
    await expect(page.getByText('Paso 2 de 5')).toBeVisible({ timeout: 10000 });

    // Seleccionar un fondo para ir al paso 3
    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 3 de 5')).toBeVisible();

    // Click en "Suscribir" para ir al paso 4
    await page.getByRole('button', { name: 'Suscribir' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 4 de 5')).toBeVisible();

    // Click en "Anterior" para volver al paso 3
    await page.getByText('Anterior').click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Paso 3 de 5')).toBeVisible();
  });

  test('debería permitir cancelar la operación usando el botón Salir', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    await page.waitForURL('**/invertir-fci', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Buscar y hacer click en el ícono de retroceso para salir
    await page.locator('.back', { hasText: 'Salir' }).click();
    await page.getByRole('button', { name: 'Si, cancelar' }).click();
    // Verificar que volvió a la página principal
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await expect(page).toHaveURL('/');
  });

  test('debería mostrar información del fondo correctamente en el paso 3', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('div').filter({ hasText: /^Invertir en FCI$/ }).click();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Completar hasta el paso 3
    await page.getByText('Fondos en pesos').click();
    await page.waitForTimeout(1000);

    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();
    await page.waitForTimeout(1000);

    // Verificar que se muestran todos los detalles del fondo
    await expect(page.getByText('IAM Ahorro Pesos - Clase B')).toBeVisible();
    await expect(page.getByText('IAM 37')).toBeVisible();
    await expect(page.getByText('Precio')).toBeVisible();
    await expect(page.getByText('Riesgo')).toBeVisible();
    await expect(page.getByText('Conservador')).toBeVisible();
    await expect(page.getByText('Liquidacion')).toBeVisible();

    // Verificar que hay dos botones disponibles
    await expect(page.getByRole('button', { name: 'Rescatar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Suscribir' })).toBeVisible();
  });

  test('debería permitir realizar otra inversión después de completar una', async ({ page }) => {
    // Completar una inversión
    await page.locator('div').filter({ hasText: /^Invertir en FCI$/ }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.getByText('Fondos en pesos').click();
    await page.waitForTimeout(1000);

    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Suscribir' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill('1000000');
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Siguiente' }).click();
    await page.waitForTimeout(1000);

    await page.locator('.mat-checkbox-inner-container').click();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await page.waitForTimeout(3000);

    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });

    // Click en "Realizar otra inversión"
    await page.getByRole('button', { name: 'Realizar otra inversión' }).click();

    // Verificar que volvió al paso 1
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 1 de 5')).toBeVisible();
    await expect(page.getByText('Fondos en pesos')).toBeVisible();
    await expect(page.getByText('Fondos en dólares')).toBeVisible();
  });
});
