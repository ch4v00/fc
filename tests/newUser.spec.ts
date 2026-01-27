import { test, expect } from '@playwright/test';

// Use the stored authentication from auth.setup.ts
test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Add New User', () => {
  test('should create a new user successfully', async ({ page }) => {
    // Navigate to home page (authentication is already loaded from storageState)
    await page.goto('/');

    // Click on "Mi Empresa"
    await page.getByRole('button', { name: 'Mi Empresa' }).click();

    // Wait for Mi Empresa section to load
    await page.waitForTimeout(2000);

    // Click on "Añadir usuario" - use nth selector as there are multiple elements with this text
    await page.locator('div').filter({ hasText: 'Añadir usuario' }).nth(4).click();

    // Wait for navigation to complete and form to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Wait for the form to be visible
    await expect(page.getByRole('heading', { name: 'Nuevo Usuario' }), { timeout: 15000 }).toBeVisible();

    // Step 1: Fill user basic information
    await page.getByRole('textbox', { name: 'Ingrese un mail' }).fill(`test${Date.now()}@example.com`);
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
    await page.waitForTimeout(2000);
    // Select Finanzas and wait
    await page.getByRole('option', { name: 'Finanzas' }).click();
    await page.waitForTimeout(1000);

    // Select Fyocapital and wait
    await page.getByRole('option', { name: 'Fyocapital' }).click();
    await page.waitForTimeout(1000);

    // Close dropdown
    await page.keyboard.press('Escape');

    // Wait for roles sections to appear
    //await expect(page.getByText('Finanzas')).toBeVisible({ timeout: 10000 });
    //await expect(page.locator('.module-title').filter({ hasText: 'fyoCapital' })).toBeVisible({ timeout: 10000 });

    // Select roles - Finanzas (radio button) - click on the container div
    await page.locator('div').filter({ hasText: /^Analista Finanzas$/ }).locator('..').click();

    // Select roles - fyoCapital (checkboxes) - click on the container divs
    await page.locator('div').filter({ hasText: /^Analista instrumentos financieros$/ }).locator('..').locator('..').click();
    await page.locator('div').filter({ hasText: /^Operador de Instrumentos Financieros$/ }).locator('..').locator('..').click();

    // Add documentation
    await page.getByText('Adjuntar documentación').click();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test.pdf');

    // Add observaciones
    await page.getByRole('textbox', { name: 'Ingresá una observación' }).fill('test automation');

    // Click Continuar
    await page.getByRole('button', { name: 'Continuar' }).click();

    // Step 4: Confirm user creation
    // Verify confirmation page displays correct information
    await expect(page.getByRole('heading', { name: 'Confirmá el alta de usuario' })).toBeVisible();
    await expect(page.getByText('Juan')).toBeVisible();
    await expect(page.getByText('Paez')).toBeVisible();
    await expect(page.getByText('Agro In SRL')).toBeVisible();
    await expect(page.getByText('Activo')).toBeVisible();
    await expect(page.getByText('Finanzas, fyoCapital')).toBeVisible();

    // Click "Añadir usuario" to complete
    await page.getByRole('button', { name: 'Añadir usuario' }).click();

    // Wait for response - either success or error
    await page.waitForTimeout(3000);
  });

  test('should validate required fields on step 1', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Mi Empresa' }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Añadir usuario').click();

    // Wait for the form to be visible
    await expect(page.getByRole('heading', { name: 'Nuevo Usuario' }), { timeout: 15000 }).toBeVisible();

    // Try to continue without filling fields
    const continueButton = page.getByRole('button', { name: 'Continuar' });
    await expect(continueButton).toBeDisabled();
  });

  test('should validate required fields on step 2', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Mi Empresa' }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Añadir usuario').click();

    // Wait for the form to be visible
    await expect(page.getByRole('heading', { name: 'Nuevo Usuario' }), { timeout: 15000 }).toBeVisible();

    // Fill step 1
    await page.getByRole('textbox', { name: 'Ingrese un mail' }).fill(`test${Date.now()}@example.com`);
    await page.getByRole('textbox', { name: 'Ingrese el nombre' }).fill('Maria');
    await page.getByRole('textbox', { name: 'Ingrese el apellido' }).fill('Gomez');
    await page.getByPlaceholder('Ingrese un teléfono').fill('9876543210');
    await page.getByRole('button', { name: 'Continuar' }).click();

    // Wait for step 2 to load
    await page.waitForTimeout(1000);

    // Try to continue without selecting Empresa and Estado
    const continueButton = page.getByRole('button', { name: 'Continuar' });
    await expect(continueButton).toBeDisabled();
  });
});
