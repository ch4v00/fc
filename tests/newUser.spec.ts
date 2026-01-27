import { test, expect } from '@playwright/test';

test.describe('Add New User', () => {
  test('should create a new user successfully', async ({ page }) => {
    // Navigate to the application
    await page.goto('https://tst.fyodigital.com');

    // Click on "Mi Empresa"
    await page.getByRole('button', { name: 'Mi Empresa' }).click();

    // Click on "Añadir usuario"
    await page.locator('div').filter({ hasText: 'Añadir usuario' }).nth(4).click();

    // Step 1: Fill user basic information
    await page.getByRole('textbox', { name: 'Ingrese un mail' }).fill('test@example23.com');
    await page.getByRole('textbox', { name: 'Ingrese el nombre' }).fill('Juan');
    await page.getByRole('textbox', { name: 'Ingrese el apellido' }).fill('Paez');
    await page.getByPlaceholder('Ingrese un teléfono').fill('1234567890');

    // Click Continuar
    await page.getByRole('button', { name: 'Continuar' }).click();

    // Step 2: Select Empresa and Estado
    await page.getByRole('combobox', { name: 'Seleccione Seleccione' }).click();
    await page.getByRole('option', { name: 'Agro In Srl' }).click();

    // Close dropdown and select Estado
    await page.keyboard.press('Escape');
    await page.locator('.select-container.default > .select-box').click();
    await page.getByText('Activo', { exact: true }).click();

    // Click Continuar
    await page.getByRole('button', { name: 'Continuar' }).click();

    // Step 3: Select Secciones and Roles
    await page.getByRole('combobox', { name: 'Seleccione Seleccione' }).click();
    await page.getByRole('option', { name: 'Finanzas' }).click();
    await page.getByRole('option', { name: 'Fyocapital' }).click();

    // Close dropdown
    await page.keyboard.press('Escape');

    // Select roles - Finanzas (radio button)
    await page.locator('#mat-radio-3 label').click();

    // Select roles - fyoCapital (checkboxes)
    await page.locator('label').filter({ hasText: 'Analista instrumentos' }).click();
    await page.locator('label').filter({ hasText: 'Operador de Instrumentos' }).click();

    // Add documentation
    await page.getByText('Adjuntar documentaciónNingún').click();
    await page.getByRole('textbox', { name: 'File' }).setInputFiles('./test.pdf');

    // Add observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('test automation');

    // Click Continuar
    await page.getByRole('button', { name: 'Continuar' }).click();

    // Step 4: Confirm user creation
    // Verify confirmation page displays correct information
    await expect(page.getByRole('heading', { name: 'Confirmá el alta de usuario' })).toBeVisible();
    await expect(page.getByText('Juan')).toBeVisible();
    await expect(page.getByText('Paez')).toBeVisible();
    await expect(page.getByText('test@example23.com')).toBeVisible();
    await expect(page.getByText('Agro In SRL')).toBeVisible();
    await expect(page.getByText('Activo')).toBeVisible();
    await expect(page.getByText('Finanzas, fyoCapital')).toBeVisible();

    // Click "Añadir usuario" to complete
    await page.getByRole('button', { name: 'Añadir usuario' }).click();

    // Verify user was created successfully (check for success message or redirect)
    // Note: Adjust this assertion based on actual success behavior
    await expect(page.getByText('Error al Guardar Usuario.')).not.toBeVisible();
  });

  test('should validate required fields on step 1', async ({ page }) => {
    await page.goto('https://tst.fyodigital.com');
    await page.getByRole('button', { name: 'Mi Empresa' }).click();
    await page.locator('div').filter({ hasText: 'Añadir usuario' }).nth(4).click();

    // Try to continue without filling fields
    const continueButton = page.getByRole('button', { name: 'Continuar' });
    await expect(continueButton).toBeDisabled();
  });

  test('should validate required fields on step 2', async ({ page }) => {
    await page.goto('https://tst.fyodigital.com');
    await page.getByRole('button', { name: 'Mi Empresa' }).click();
    await page.locator('div').filter({ hasText: 'Añadir usuario' }).nth(4).click();

    // Fill step 1
    await page.getByRole('textbox', { name: 'Ingrese un mail' }).fill('test2@example.com');
    await page.getByRole('textbox', { name: 'Ingrese el nombre' }).fill('Maria');
    await page.getByRole('textbox', { name: 'Ingrese el apellido' }).fill('Gomez');
    await page.getByPlaceholder('Ingrese un teléfono').fill('9876543210');
    await page.getByRole('button', { name: 'Continuar' }).click();

    // Try to continue without selecting Empresa and Estado
    const continueButton = page.getByRole('button', { name: 'Continuar' });
    await expect(continueButton).toBeDisabled();
  });
});
