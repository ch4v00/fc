import { test, expect } from '@playwright/test';

// Use the stored authentication from auth.setup.ts
test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Validar Navegación - Menús y Solapas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  // ============================================
  // HOME - SOLAPAS PRINCIPALES
  // ============================================

  test('debería cargar la solapa Mi Empresa correctamente', async ({ page }) => {
    // Mi Empresa debería estar visible
    await page.getByRole('button', { name: 'Mi Empresa' }).click();
    await page.waitForTimeout(1000);

    // Verificar contenido principal
    await expect(page.getByRole('heading', { name: /Hola,/ })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Añadir usuario')).toBeVisible();

    // Verificar menú lateral
    await expect(page.getByRole('button', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'configuracion' })).toBeVisible();
  });

  test('debería cargar la solapa Mis Inversiones correctamente', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    // Verificar contenido principal
    await expect(page.getByRole('heading', { name: /Hola,/ })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Tu saldo' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '¿Qué necesitas hacer hoy?' })).toBeVisible();

    // Verificar acciones rápidas
    await expect(page.getByText('Informar Depósito')).toBeVisible();
    await expect(page.getByText('Solicitar Fondos')).toBeVisible();
    await expect(page.getByText('Mover Fondos')).toBeVisible();
    await expect(page.getByText('Invertir en FCI')).toBeVisible();
    await expect(page.getByText('Añadir Cuenta')).toBeVisible();

    // Verificar menú lateral
    await expect(page.getByRole('button', { name: 'portfolio' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'cuentacorriente' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'rendimientos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'comprobantes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'transfdefondos' })).toBeVisible();
  });

  test('debería cargar la solapa Aira correctamente', async ({ page }) => {
    await page.getByRole('button', { name: 'Aira' }).click();
    await page.waitForTimeout(1000);

    // Verificar contenido principal
    await expect(page.getByRole('heading', { name: 'Potenciá tu negocio con IA' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Descubrí el poder de la inteligencia artificial' })).toBeVisible();

    // Verificar secciones
    await expect(page.getByRole('heading', { name: 'Capacitaciones' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contenidos' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Asistentes' })).toBeVisible();

    // Verificar menú lateral cambió
    await expect(page.getByRole('button', { name: 'capacitaciones' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'contenido' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'asistentes' })).toBeVisible();
  });

  // ============================================
  // PORTFOLIO
  // ============================================

  test('debería cargar Portfolio - Cartera financiera correctamente', async ({ page }) => {
    // Ir a Mis Inversiones primero para tener el menú lateral
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    // Navegar a Portfolio
    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Verificar navegación superior
    await expect(page.getByRole('button', { name: 'Portfolio' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Cuenta corriente' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Rendimientos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Boletos y comprobantes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Transferencia de fondos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mercado' })).toBeVisible();

    // Verificar pestañas
    await expect(page.getByRole('tab', { name: 'Cartera financiera' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Cartera de derivados' })).toBeVisible();

    // Cartera financiera está seleccionada por defecto
    await expect(page.getByRole('tab', { name: 'Cartera financiera' })).toHaveAttribute('aria-selected', 'true');

    // Verificar contenido de cartera financiera
    await expect(page.getByText('Total')).toBeVisible();
    await expect(page.getByText('Saldos')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Activos Valuados' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pasivos Valuados' })).toBeVisible();
  });

  test('debería cargar Portfolio - Cartera de derivados correctamente', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Click en Cartera de derivados
    await page.getByRole('tab', { name: 'Cartera de derivados' }).click();
    await page.waitForTimeout(2000);

    // Verificar que la pestaña está seleccionada
    await expect(page.getByRole('tab', { name: 'Cartera de derivados' })).toHaveAttribute('aria-selected', 'true');

    // Verificar contenido
    await expect(page.getByText('Posiciones Abiertas').nth(1)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Posiciones Cerradas')).toBeVisible();

    // Verificar filtros
    await expect(page.getByRole('radio', { name: 'Resumen' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Abierta' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Cerrada' })).toBeVisible();
  });

  test('debería expandir Activos Valuados en Portfolio correctamente', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Expandir Activos Valuados
    await page.getByRole('button', { name: 'Activos Valuados' }).click();
    await page.waitForTimeout(1000);

    // Verificar que se muestran las categorías
    await expect(page.getByText('Pesos').nth(2)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Fondos En Dólar')).toBeVisible();
    await expect(page.getByText('Fondos En Pesos')).toBeVisible();
  });

  // ============================================
  // CUENTA CORRIENTE
  // ============================================

  test.skip('debería cargar Cuenta corriente correctamente', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Navegar a Cuenta corriente
    await page.getByRole('button', { name: 'Cuenta corriente' }).click();
    await page.waitForTimeout(2000);

    // Verificar URL
    await expect(page).toHaveURL(/.*cuentaCorriente/);

    // Verificar filtros
    await expect(page.getByRole('radio', { name: 'Disponible' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('radio', { name: 'No disponible' })).toBeVisible();

    // Verificar secciones de monedas
    await expect(page.getByRole('button', { name: /Dólar U\$S/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Dólar Cable/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Pesos \$/ })).toBeVisible();
  });

  // ============================================
  // RENDIMIENTOS
  // ============================================

  test('debería cargar Rendimientos y mostrar las solapas Financieros, Derivados y Renta financiera', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Navegar a Rendimientos
    await page.getByRole('button', { name: 'Rendimientos' }).click();
    await page.waitForTimeout(2000);

    // Verificar URL
    await expect(page).toHaveURL(/.*valores/);

    // Cerrar diálogo de error si aparece
    const errorDialog = page.getByRole('button', { name: 'Salir' });
    if (await errorDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
      await errorDialog.click();
      await page.waitForTimeout(500);
    }

    // Verificar que las 3 solapas están visibles
    await expect(page.getByRole('button', { name: 'Financieros' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Derivados' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Renta financiera' })).toBeVisible();
  });

  test('debería cargar Rendimientos - Renta financiera correctamente', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    await page.getByRole('button', { name: 'Rendimientos' }).click();
    await page.waitForTimeout(2000);

    // Cerrar diálogo de error si aparece
    const errorDialog = page.getByRole('button', { name: 'Salir' });
    if (await errorDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
      await errorDialog.click();
      await page.waitForTimeout(500);
    }

    // Click en Renta financiera
    await page.getByRole('button', { name: 'Renta financiera' }).click();
    await page.waitForTimeout(1000);

    // Verificar contenido
    await expect(page.getByText('Reporte renta financiera')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Descargar Excel' })).toBeVisible();
  });

  // ============================================
  // BOLETOS Y COMPROBANTES
  // ============================================

  test('debería cargar Boletos y comprobantes con todas las solapas', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Navegar a Boletos y comprobantes
    await page.getByRole('button', { name: 'Boletos y comprobantes' }).click();
    await page.waitForTimeout(2000);

    // Verificar URL
    await expect(page).toHaveURL(/.*boletosComprobantes/);

    // Verificar que las 5 solapas están visibles
    await expect(page.getByRole('button', { name: 'Boletos' }).nth(1)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'FCI' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cobros y pagos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Otros comprobantes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Garantías' })).toBeVisible();
  });

  test('debería cargar la solapa FCI en Boletos y comprobantes', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    await page.getByRole('button', { name: 'Boletos y comprobantes' }).click();
    await page.waitForTimeout(2000);

    // Click en FCI
    await page.getByRole('button', { name: 'FCI' }).click();
    await page.waitForTimeout(1000);

    // Verificar filtros de FCI
    await expect(page.getByRole('radio', { name: 'Liquidaciones FCI' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('radio', { name: 'Solicitudes FCI' })).toBeVisible();

    // Verificar que se muestra la tabla con encabezados
    await expect(page.getByText('Nro liquidación')).toBeVisible();
    await expect(page.getByText('Movimiento').nth(1)).toBeVisible();
  });

  test('debería cargar la solapa Cobros y pagos en Boletos y comprobantes', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    await page.getByRole('button', { name: 'Boletos y comprobantes' }).click();
    await page.waitForTimeout(2000);

    // Click en Cobros y pagos
    await page.getByRole('button', { name: 'Cobros y pagos' }).click();
    await page.waitForTimeout(1000);

    // Verificar encabezados de tabla
    await expect(page.getByText('Tipo movimiento').nth(1)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Moneda').nth(3)).toBeVisible();
    await expect(page.getByText('Importe').nth(1)).toBeVisible();
    await expect(page.getByText('Cotización')).toBeVisible();
  });

  test('debería cargar la solapa Otros comprobantes en Boletos y comprobantes', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    await page.getByRole('button', { name: 'Boletos y comprobantes' }).click();
    await page.waitForTimeout(2000);

    // Click en Otros comprobantes
    await page.getByRole('button', { name: 'Otros comprobantes' }).click();
    await page.waitForTimeout(1000);

    // Verificar encabezados de tabla
    await expect(page.getByText('Tipo movimiento')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Moneda').nth(3)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Importe')).toBeVisible({ timeout: 10000 });
  });

  test('debería cargar la solapa Garantías en Boletos y comprobantes', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    await page.getByRole('button', { name: 'Boletos y comprobantes' }).click();
    await page.waitForTimeout(2000);

    // Click en Garantías
    await page.getByRole('button', { name: 'Garantías' }).click();
    await page.waitForTimeout(1000);

    // Puede no tener resultados, pero no debe mostrar error
    const errorDialog = page.locator('dialog');
    await expect(errorDialog).not.toBeVisible({ timeout: 3000 });
  });

  // ============================================
  // TRANSFERENCIA DE FONDOS
  // ============================================

  test('debería cargar Transferencia de fondos con todas las pestañas', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Navegar a Transferencia de fondos
    await page.getByRole('button', { name: 'Transferencia de fondos' }).click();
    await page.waitForTimeout(2000);

    // Verificar URL
    await expect(page).toHaveURL(/.*transferenciaFondos/);

    // Verificar que las 4 pestañas están visibles
    await expect(page.getByRole('tab', { name: 'Depósitos' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('tab', { name: 'Retiros' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Movimientos' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Cuentas bancarias' })).toBeVisible();

    // Depósitos está seleccionada por defecto
    await expect(page.getByRole('tab', { name: 'Depósitos' })).toHaveAttribute('aria-selected', 'true');
  });

  test('debería cargar la pestaña Retiros en Transferencia de fondos', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    await page.getByRole('button', { name: 'Transferencia de fondos' }).click();
    await page.waitForTimeout(2000);

    // Click en Retiros
    await page.getByRole('tab', { name: 'Retiros' }).click();
    await page.waitForTimeout(1000);

    // Verificar que la pestaña está seleccionada
    await expect(page.getByRole('tab', { name: 'Retiros' })).toHaveAttribute('aria-selected', 'true');

    // No debe mostrar error
    const errorDialog = page.locator('dialog');
    await expect(errorDialog).not.toBeVisible({ timeout: 3000 });
  });

  test('debería cargar la pestaña Movimientos en Transferencia de fondos', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    await page.getByRole('button', { name: 'Transferencia de fondos' }).click();
    await page.waitForTimeout(2000);

    // Click en Movimientos
    await page.getByRole('tab', { name: 'Movimientos' }).click();
    await page.waitForTimeout(1000);

    // Verificar que la pestaña está seleccionada
    await expect(page.getByRole('tab', { name: 'Movimientos' })).toHaveAttribute('aria-selected', 'true');

    // No debe mostrar error
    const errorDialog = page.locator('dialog');
    await expect(errorDialog).not.toBeVisible({ timeout: 3000 });
  });

  test('debería cargar la pestaña Cuentas bancarias en Transferencia de fondos', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    await page.getByRole('button', { name: 'Transferencia de fondos' }).click();
    await page.waitForTimeout(2000);

    // Click en Cuentas bancarias
    await page.getByRole('tab', { name: 'Cuentas bancarias' }).click();
    await page.waitForTimeout(1000);

    // Verificar que la pestaña está seleccionada
    await expect(page.getByRole('tab', { name: 'Cuentas bancarias' })).toHaveAttribute('aria-selected', 'true');

    // Verificar botón Cuentas fyo
    await expect(page.getByRole('button', { name: 'Cuentas fyo' })).toBeVisible({ timeout: 10000 });

    // No debe mostrar error
    const errorDialog = page.locator('dialog');
    await expect(errorDialog).not.toBeVisible({ timeout: 3000 });
  });

  // ============================================
  // MERCADO
  // ============================================

  test('debería cargar Mercado con solicitudes correctamente', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Navegar a Mercado
    await page.getByRole('button', { name: 'Mercado' }).click();
    await page.waitForTimeout(3000);

    // Verificar URL
    await expect(page).toHaveURL(/.*mercado/);

    // Verificar pestaña Solicitudes
    await expect(page.getByRole('tab', { name: 'Solicitudes' })).toBeVisible({ timeout: 10000 });

    // Verificar secciones de fondos
    await expect(page.getByRole('button', { name: 'Fondos / Pesos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fondos / Dólar' })).toBeVisible();
  });

  test('debería expandir Fondos / Pesos en Mercado correctamente', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    await page.getByRole('button', { name: 'Mercado' }).click();
    await page.waitForTimeout(3000);

    // Expandir Fondos / Pesos
    await page.getByRole('button', { name: 'Fondos / Pesos' }).click();
    await page.waitForTimeout(1000);

    // Verificar encabezados de la tabla
    await expect(page.getByText('Especie').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Estado').first()).toBeVisible();

    // No debe mostrar error
    const errorDialog = page.locator('dialog');
    await expect(errorDialog).not.toBeVisible({ timeout: 3000 });
  });

  test('debería expandir Fondos / Dólar en Mercado correctamente', async ({ page }) => {
    await page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'portfolio' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    await page.getByRole('button', { name: 'Mercado' }).click();
    await page.waitForTimeout(3000);

    // Expandir Fondos / Dólar
    await page.getByRole('button', { name: 'Fondos / Dólar' }).click();
    await page.waitForTimeout(2000);

    // Verificar encabezados de la tabla
    await expect(page.getByText('Especie').nth(1)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Estado').nth(1)).toBeVisible();

    // No debe mostrar error
    const errorDialog = page.locator('dialog');
    await expect(errorDialog).not.toBeVisible({ timeout: 3000 });
  });

  // ============================================
  // FOOTER
  // ============================================

  test('debería mostrar el footer con información correcta', async ({ page }) => {
    await expect(page.getByText(/© fyoDigital \d{4}/)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Staging - v/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'equipo@fyodigital.com' })).toBeVisible();
  });
});
