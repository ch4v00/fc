import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker/locale/es'; // Importar directamente
// Use the stored authentication from auth.setup.ts
test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Add New User', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });
  test('debería crear un nuevo usuario exitosamente', async ({ page }) => {
    // Generar datos faker
    const datosUsuario = {
      email: faker.internet.email(),
      nombre: faker.person.firstName(),
      apellido: faker.person.lastName(),
      telefono: faker.string.numeric(10) // 10 dígitos
    };

    // Navegar a la página principal
    //await page.goto('/');

    // Click en "Mi Empresa"
    await page.getByRole('button', { name: 'Mi Empresa' }).click();

    // Esperar a que cargue la sección
    await page.waitForTimeout(2000);

    // Click en "Añadir usuario"
    await page.locator('div').filter({ hasText: 'Añadir usuario' }).nth(4).click();

    // Esperar a que el formulario cargue
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Nuevo Usuario' })).toBeVisible({ timeout: 15000 });

    // ============================================
    // PASO 1: Llenar información básica del usuario
    // ============================================
    await page.getByRole('textbox', { name: 'Ingrese un mail' }).fill(datosUsuario.email);
    await page.getByRole('textbox', { name: 'Ingrese el nombre' }).fill(datosUsuario.nombre);
    await page.getByRole('textbox', { name: 'Ingrese el apellido' }).fill(datosUsuario.apellido);
    await page.getByPlaceholder('Ingrese un teléfono').fill(datosUsuario.telefono);

    // Click Continuar
    await page.getByRole('button', { name: 'Continuar' }).click();

    // ============================================
    // PASO 2: Seleccionar Empresa y Estado
    // ============================================
    await page.getByRole('combobox', { name: 'Seleccione Seleccione' }).click();
    await page.getByRole('option', { name: 'Agro In Srl' }).click();

    // Cerrar dropdown y seleccionar Estado
    await page.keyboard.press('Escape');
    await page.locator('.select-container.default > .select-box').click();
    await page.getByText('Activo', { exact: true }).click();

    // Click Continuar
    await page.getByRole('button', { name: 'Continuar' }).click();

    // ============================================
    // PASO 3: Seleccionar Secciones y Roles
    // ============================================

    // Abrir selector de secciones
    await page.getByRole('combobox', { name: 'Seleccione Seleccione' }).click();
    await page.waitForTimeout(1000);

    // Seleccionar secciones usando mat-option
    await page.locator('mat-option', { hasText: 'Finanzas' }).click();
    await page.waitForTimeout(500);
    await page.locator('mat-option', { hasText: 'Fyocapital' }).click();
    await page.waitForTimeout(500);

    // Cerrar dropdown
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Seleccionar rol en Finanzas (radio button)
    // Usar el label del mat-radio-button
    // ✅ Solo encuentra "Analista Finanzas" exactamente
    await page.locator('mat-radio-button').filter({
      has: page.locator('p.rol').filter({ hasText: /^Analista Finanzas$/ })
    }).click();

    // Seleccionar roles en fyoCapital (checkboxes)
    // Método mejorado: buscar por el label dentro del mat-checkbox
    await page.locator('mat-checkbox', {
      has: page.locator('p.rol', { hasText: 'Analista instrumentos financieros' })
    }).click();

    await page.locator('mat-checkbox', {
      has: page.locator('p.rol', { hasText: 'Operador de Instrumentos Financieros' })
    }).click();

    // Esperar un momento para que se registren los clicks
    await page.waitForTimeout(500);

    // Adjuntar documentación
    await page.getByText('Adjuntar documentación').click();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test.pdf');

    // Agregar observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('Test de automatización');

    // Click Continuar
    await page.getByRole('button', { name: 'Continuar' }).click();

    // ============================================
    // PASO 4: Confirmar creación de usuario
    // ============================================
    await expect(page.getByRole('heading', { name: 'Confirmá el alta de usuario' })).toBeVisible();

    // Verificar que la información se muestra correctamente
    await expect(page.getByText(datosUsuario.nombre)).toBeVisible();
    await expect(page.getByText(datosUsuario.apellido)).toBeVisible();
    await expect(page.getByText('Agro In SRL')).toBeVisible();
    await expect(page.getByText('Activo')).toBeVisible();
    await expect(page.getByText('Finanzas, fyoCapital')).toBeVisible();

    // Click "Añadir usuario" para completar
    await page.getByRole('button', { name: 'Añadir usuario' }).click();

    // Esperar respuesta
    await page.waitForTimeout(5000);

    // Opcional: Verificar mensaje de éxito
    //await expect(page.getByText('Usuario creado exitosamente')).toBeVisible();
    await page.getByRole('button', { name: 'Finalizar' }).click();

  });

  test('debería validar campos requeridos en el paso 1', async ({ page }) => {
    await page.getByRole('button', { name: 'Mi Empresa' }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Añadir usuario').click();

    // Esperar a que el formulario cargue
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Nuevo Usuario' })).toBeVisible({ timeout: 15000 });

    // Intentar continuar sin llenar campos
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeDisabled();
  });

  test('debería validar campos requeridos en el paso 2', async ({ page }) => {
    // Generar datos faker para el paso 1
    const datosUsuario = {
      email: faker.internet.email(),
      nombre: faker.person.firstName(),
      apellido: faker.person.lastName(),
      telefono: faker.string.numeric(10)
    };

    //await page.goto('/');
    await page.getByRole('button', { name: 'Mi Empresa' }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Añadir usuario').click();

    // Esperar a que el formulario cargue
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Nuevo Usuario' })).toBeVisible({ timeout: 15000 });

    // Llenar paso 1 con datos faker
    await page.getByRole('textbox', { name: 'Ingrese un mail' }).fill(datosUsuario.email);
    await page.getByRole('textbox', { name: 'Ingrese el nombre' }).fill(datosUsuario.nombre);
    await page.getByRole('textbox', { name: 'Ingrese el apellido' }).fill(datosUsuario.apellido);
    await page.getByPlaceholder('Ingrese un teléfono').fill(datosUsuario.telefono);

    await page.getByRole('button', { name: 'Continuar' }).click();

    // Esperar a que cargue el paso 2
    await page.waitForTimeout(1000);

    // Intentar continuar sin seleccionar Empresa y Estado
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeDisabled();
  });

  test('debería validar campos requeridos en el paso 3', async ({ page }) => {
    // Generar datos faker
    const datosUsuario = {
      email: faker.internet.email(),
      nombre: faker.person.firstName(),
      apellido: faker.person.lastName(),
      telefono: faker.string.numeric(10)
    };

    //await page.goto('/');
    await page.getByRole('button', { name: 'Mi Empresa' }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Añadir usuario').click();

    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Nuevo Usuario' })).toBeVisible({ timeout: 15000 });

    // Completar paso 1
    await page.getByRole('textbox', { name: 'Ingrese un mail' }).fill(datosUsuario.email);
    await page.getByRole('textbox', { name: 'Ingrese el nombre' }).fill(datosUsuario.nombre);
    await page.getByRole('textbox', { name: 'Ingrese el apellido' }).fill(datosUsuario.apellido);
    await page.getByPlaceholder('Ingrese un teléfono').fill(datosUsuario.telefono);
    await page.getByRole('button', { name: 'Continuar' }).click();

    // Completar paso 2
    await page.getByRole('combobox', { name: 'Seleccione Seleccione' }).click();
    await page.getByRole('option', { name: 'Agro In Srl' }).click();
    await page.keyboard.press('Escape');
    await page.locator('.select-container.default > .select-box').click();
    await page.getByText('Activo', { exact: true }).click();
    await page.getByRole('button', { name: 'Continuar' }).click();

    // En paso 3, intentar continuar sin seleccionar secciones ni roles
    await page.waitForTimeout(1000);
    const botonContinuar = page.getByRole('button', { name: 'Continuar' });
    await expect(botonContinuar).toBeDisabled();
  });

  test('debería permitir cancelar la creación de usuario', async ({ page }) => {
    //await page.goto('/');
    await page.getByRole('button', { name: 'Mi Empresa' }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Añadir usuario').click();

    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Nuevo Usuario' })).toBeVisible({ timeout: 15000 });

    // Buscar y hacer click en el botón de cancelar (ajustar según tu interfaz)
    await page.locator('.back', { hasText: 'Salir' }).click();
    // Verificar que volvió a la página anterior
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });
});
