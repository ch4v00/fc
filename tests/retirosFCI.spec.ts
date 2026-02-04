import { test, expect } from '@playwright/test';

// Use the stored authentication from auth.setup.ts
test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Rescates de FCI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('debería completar un rescate de FCI en pesos sin retiro de fondos', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    // Esperar a que navegue a la URL correcta
    await page.waitForURL('**/invertir-fci', { timeout: 20000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que estamos en el paso 1
    await expect(page.getByText('Paso 1 de 5')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Seleccioná una de las opciones:')).toBeVisible({ timeout: 15000 });

    // ============================================
    // PASO 1: Seleccionar tipo de fondo
    // ============================================
    await page.getByText('Fondos en pesos').click({ force: true });

    // Esperar a que cargue el paso 2
    await page.waitForTimeout(2000);
    await expect(page.getByText('Paso 2 de 5')).toBeVisible({ timeout: 15000 });

    // ============================================
    // PASO 2: Seleccionar fondo específico
    // ============================================
    await expect(page.getByText('Seleccioná un fondo en pesos')).toBeVisible();

    // Seleccionar IAM 37 (IAM Ahorro Pesos)
    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();

    // Esperar a que cargue el paso 3
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 3 de 5')).toBeVisible();

    // ============================================
    // PASO 3: Ver detalles del fondo y seleccionar acción
    // ============================================
    await expect(page.getByText('IAM Ahorro Pesos - Clase B')).toBeVisible();
    await expect(page.getByText('IAM 37')).toBeVisible();
    await expect(page.getByText('Conservador')).toBeVisible();

    // Click en "Rescatar"
    await page.getByRole('button', { name: 'Rescatar' }).click();

    // Esperar a que cargue el paso 4
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 4 de 5')).toBeVisible();

    // ============================================
    // PASO 4: Ingresar monto de rescate
    // ============================================
    await expect(page.getByText('Rescatar fondo')).toBeVisible();

    // Ingresar monto de rescate
    const montoRescate = '1000';
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill(montoRescate);

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

    // Click en "Enviar solicitud"
    const botonEnviar = page.getByRole('button', { name: 'Enviar solicitud' });
    await expect(botonEnviar).toBeEnabled();
    await botonEnviar.click();

    // Esperar respuesta del servidor
    await page.waitForTimeout(3000);

    // ============================================
    // Verificar mensaje de éxito
    // ============================================
    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Tu solicitud fue enviada con éxito')).toBeVisible();

    // Click en "Finalizar"
    await page.getByRole('button', { name: 'Finalizar' }).click();

    // Verificar que volvió a la página principal
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('debería completar un rescate con retiro vía Transferencia Bancaria normal', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    await page.waitForURL('**/invertir-fci', { timeout: 20000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // PASO 1: Seleccionar tipo de fondo
    await expect(page.getByText('Paso 1 de 5')).toBeVisible({ timeout: 10000 });
    await page.getByText('Fondos en pesos').click({ force: true });

    await page.waitForTimeout(2000);
    await expect(page.getByText('Paso 2 de 5')).toBeVisible({ timeout: 15000 });

    // PASO 2: Seleccionar fondo específico
    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();

    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 3 de 5')).toBeVisible();

    // PASO 3: Click en "Rescatar"
    await page.getByRole('button', { name: 'Rescatar' }).click();

    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 4 de 5')).toBeVisible();

    // PASO 4: Ingresar monto y seleccionar retiro
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill('1000');
    await page.waitForTimeout(500);

    // Marcar checkbox de retiro de fondos
    await page.locator('label').filter({ hasText: 'Quiero retirar los fondos vía' }).click();
    await page.waitForTimeout(500);

    // Verificar que "Transferencia Bancaria" está seleccionado por defecto
    await expect(page.getByRole('radio', { name: 'Transferencia Bancaria' })).toBeChecked();

    // Seleccionar cuenta destino
    await page.locator('.select-box').click();
    await page.waitForTimeout(500);

    // Seleccionar la primera cuenta disponible
    await page.getByText('Banco de Galicia y Bs. As. SA Cuenta Corriente Nro:').click();
    await page.waitForTimeout(500);

    // Click en "Siguiente"
    const botonSiguiente = page.getByRole('button', { name: 'Siguiente' });
    await expect(botonSiguiente).toBeEnabled();
    await botonSiguiente.click();

    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 5 de 5')).toBeVisible();

    // PASO 5: Confirmar y enviar
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();

    await page.getByRole('button', { name: 'Enviar solicitud' }).click();

    await page.waitForTimeout(4000);

    // Verificar éxito
    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Tu solicitud fue enviada con éxito')).toBeVisible();

    await page.getByRole('button', { name: 'Finalizar' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('debería completar un rescate con retiro vía Transferencia MEP', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    await page.waitForURL('**/invertir-fci', { timeout: 20000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // PASO 1: Seleccionar tipo de fondo
    await expect(page.getByText('Paso 1 de 5')).toBeVisible({ timeout: 10000 });
    await page.getByText('Fondos en pesos').click({ force: true });

    await page.waitForTimeout(2000);
    await expect(page.getByText('Paso 2 de 5')).toBeVisible({ timeout: 15000 });

    // PASO 2: Seleccionar fondo específico
    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();

    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 3 de 5')).toBeVisible();

    // PASO 3: Click en "Rescatar"
    await page.getByRole('button', { name: 'Rescatar' }).click();

    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 4 de 5')).toBeVisible();

    // PASO 4: Ingresar monto y seleccionar retiro MEP
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill('1000');
    await page.waitForTimeout(500);

    // Marcar checkbox de retiro de fondos
    await page.locator('label').filter({ hasText: 'Quiero retirar los fondos vía' }).click();
    await page.waitForTimeout(500);

    // Marcar checkbox de Transferencia MEP
    await page.locator('label').filter({ hasText: 'Seleccione si es' }).click();
    await page.waitForTimeout(500);

    // Verificar que el checkbox MEP está marcado
    await expect(page.getByRole('checkbox', { name: 'Seleccione si es Transferencia MEP' })).toBeChecked();

    // Seleccionar cuenta destino
    await page.locator('.select-box').click();
    await page.waitForTimeout(500);

    await page.getByText('Banco de Galicia y Bs. As. SA Cuenta Corriente Nro:').click();
    await page.waitForTimeout(500);

    // Click en "Siguiente"
    const botonSiguiente = page.getByRole('button', { name: 'Siguiente' });
    await expect(botonSiguiente).toBeEnabled();
    await botonSiguiente.click();

    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 5 de 5')).toBeVisible();

    // PASO 5: Confirmar y enviar
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();

    await page.getByRole('button', { name: 'Enviar solicitud' }).click();

    await page.waitForTimeout(3000);

    // Verificar éxito
    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Tu solicitud fue enviada con éxito')).toBeVisible();

    await page.getByRole('button', { name: 'Finalizar' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('debería completar un rescate con retiro vía Echeq al día', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    await page.waitForURL('**/invertir-fci', { timeout: 20000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // PASO 1: Seleccionar tipo de fondo
    await expect(page.getByText('Paso 1 de 5')).toBeVisible({ timeout: 10000 });
    await page.getByText('Fondos en pesos').click({ force: true });

    await page.waitForTimeout(2000);
    await expect(page.getByText('Paso 2 de 5')).toBeVisible({ timeout: 15000 });

    // PASO 2: Seleccionar fondo específico
    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();

    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 3 de 5')).toBeVisible();

    // PASO 3: Click en "Rescatar"
    await page.getByRole('button', { name: 'Rescatar' }).click();

    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 4 de 5')).toBeVisible();

    // PASO 4: Ingresar monto y seleccionar Echeq al día
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill('1000');
    await page.waitForTimeout(500);

    // Marcar checkbox de retiro de fondos
    await page.locator('label').filter({ hasText: 'Quiero retirar los fondos vía' }).click();
    await page.waitForTimeout(500);

    // Seleccionar "Echeq al día"
    await page.locator('label').filter({ hasText: 'Echeq al día' }).click();
    await page.waitForTimeout(500);

    // Verificar que "Echeq al día" está seleccionado
    await expect(page.getByRole('radio', { name: 'Echeq al día' })).toBeChecked();

    // Verificar que se muestra el formulario de Echeq
    await expect(page.getByText('Solicitando:')).toBeVisible();

    // Click en "Siguiente"
    const botonSiguiente = page.getByRole('button', { name: 'Siguiente' });
    await expect(botonSiguiente).toBeEnabled();
    await botonSiguiente.click();

    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 5 de 5')).toBeVisible();

    // PASO 5: Confirmar y enviar
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

  test('debería completar un rescate de FCI en dólares sin retiro de fondos', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    await page.waitForURL('**/invertir-fci', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // PASO 1: Seleccionar tipo de fondo
    await expect(page.getByText('Paso 1 de 5')).toBeVisible({ timeout: 10000 });
    await page.getByText('Fondos en dólares').click({ force: true });

    await page.waitForTimeout(2000);
    await expect(page.getByText('Paso 2 de 5')).toBeVisible({ timeout: 15000 });

    // PASO 2: Seleccionar fondo específico
    await expect(page.getByText('Seleccioná un fondo en dólares')).toBeVisible();
    await page.getByText('IAM Liquidez en Dólares - Clase B').click();

    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 3 de 5')).toBeVisible();

    // PASO 3: Verificar detalles y click en "Rescatar"
    await expect(page.getByText('IAM Liquidez en Dólares - Clase B')).toBeVisible();
    await expect(page.getByText('IAM 44')).toBeVisible();

    await page.getByRole('button', { name: 'Rescatar' }).click();

    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 4 de 5')).toBeVisible();

    // PASO 4: Ingresar monto de rescate
    await expect(page.getByText('Rescatar fondo')).toBeVisible();

    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill('1000');
    await page.waitForTimeout(500);

    const botonSiguiente = page.getByRole('button', { name: 'Siguiente' });
    await expect(botonSiguiente).toBeEnabled();
    await botonSiguiente.click();

    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 5 de 5')).toBeVisible();

    // PASO 5: Confirmar solicitud
    await expect(page.getByText('Confirmá tu solicitud')).toBeVisible();
    await expect(page.getByText('IAM Liquidez en Dólares - Clase B')).toBeVisible();
    await expect(page.getByText('IAM 44')).toBeVisible();

    await page.getByRole('button', { name: 'Enviar solicitud' }).click();

    await page.waitForTimeout(3000);

    // Verificar éxito
    await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Tu solicitud fue enviada con éxito')).toBeVisible();

    await page.getByRole('button', { name: 'Finalizar' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('debería permitir usar el botón MAX para el monto en rescate', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    await page.waitForURL('**/invertir-fci', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Navegar hasta el paso 4
    await page.getByText('Fondos en pesos').click({ force: true });
    await page.waitForTimeout(2000);

    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Rescatar' }).click();
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

  test('debería validar que no se puede continuar sin ingresar monto en rescate', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    await page.waitForURL('**/invertir-fci', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Navegar hasta el paso 4
    await page.getByText('Fondos en pesos').click({ force: true });
    await page.waitForTimeout(2000);

    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Rescatar' }).click();
    await page.waitForTimeout(1000);

    // Verificar que el botón "Siguiente" está deshabilitado sin monto
    const botonSiguiente = page.getByRole('button', { name: 'Siguiente' });
    await expect(botonSiguiente).toBeDisabled();
  });

  test('debería validar que se requiere cuenta destino para transferencia bancaria', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    await page.waitForURL('**/invertir-fci', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Navegar hasta el paso 4
    await page.getByText('Fondos en pesos').click({ force: true });
    await page.waitForTimeout(2000);

    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Rescatar' }).click();
    await page.waitForTimeout(1000);

    // Ingresar monto
    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill('1000');
    await page.waitForTimeout(500);

    // Marcar checkbox de retiro de fondos
    await page.locator('label').filter({ hasText: 'Quiero retirar los fondos vía' }).click();
    await page.waitForTimeout(500);

    // Verificar que el botón "Siguiente" está deshabilitado sin seleccionar cuenta
    const botonSiguiente = page.getByRole('button', { name: 'Siguiente' });
    await expect(botonSiguiente).toBeDisabled();
  });

  test('debería permitir volver atrás usando el botón Anterior en rescate', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    await page.waitForURL('**/invertir-fci', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Avanzar hasta el paso 4
    await page.getByText('Fondos en pesos').click({ force: true });
    await page.waitForTimeout(2000);
    await expect(page.getByText('Paso 2 de 5')).toBeVisible({ timeout: 10000 });

    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 3 de 5')).toBeVisible();

    await page.getByRole('button', { name: 'Rescatar' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Paso 4 de 5')).toBeVisible();

    // Click en "Anterior" para volver al paso 3
    await page.getByText('Anterior').click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Paso 3 de 5')).toBeVisible();

    // Verificar que los botones Rescatar y Suscribir están visibles
    await expect(page.getByRole('button', { name: 'Rescatar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Suscribir' })).toBeVisible();
  });

  test('debería permitir realizar otro rescate después de completar uno', async ({ page }) => {
    // Click en "Invertir en FCI"
    await page.locator('#invertirFci').click();

    await page.waitForURL('**/invertir-fci', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Completar un rescate
    await page.getByText('Fondos en pesos').click({ force: true });
    await page.waitForTimeout(2000);

    await page.getByText('IAM Ahorro Pesos - Clase BIAM 37 CI $').click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Rescatar' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill('1000');
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Siguiente' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await page.waitForTimeout(4000);

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
