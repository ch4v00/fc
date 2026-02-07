import { Page, Locator, expect } from '@playwright/test';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

/**
 * Clase base para todos los Page Objects
 * Proporciona métodos comunes para interactuar con la UI
 */
export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navega a una URL específica
   * @param url - URL a navegar (default: '/')
   */
  async goto(url: string = '/') {
    await this.page.goto(url);
    await WaitHelper.waitForNavigation(this.page);
  }

  /**
   * Click en un botón por su nombre/texto
   * @param buttonName - Nombre del botón
   */
  async clickButton(buttonName: string) {
    await this.page.getByRole('button', { name: buttonName }).click();
  }

  /**
   * Llena un input de texto por su label/nombre
   * @param label - Label del input
   * @param value - Valor a ingresar
   */
  async fillInput(label: string, value: string) {
    await this.page.getByRole('textbox', { name: label }).fill(value);
  }

  /**
   * Llena un input por placeholder
   * @param placeholder - Placeholder del input
   * @param value - Valor a ingresar
   */
  async fillByPlaceholder(placeholder: string, value: string) {
    await this.page.getByPlaceholder(placeholder).fill(value);
  }

  /**
   * Selecciona una opción por su texto
   * @param optionText - Texto de la opción
   */
  async selectOption(optionText: string) {
    await this.page.getByText(optionText).click();
  }

  /**
   * Click en un elemento por su texto
   * @param text - Texto del elemento
   * @param exact - Si debe ser exacto (default: false)
   */
  async clickText(text: string, exact: boolean = false) {
    await this.page.getByText(text, { exact }).click();
  }

  /**
   * Espera a que un texto sea visible
   * @param text - Texto a esperar
   * @param timeout - Timeout en ms (default: 10000)
   */
  async waitForText(text: string, timeout: number = 10000) {
    await this.page.getByText(text).waitFor({ state: 'visible', timeout });
  }

  /**
   * Verifica que un texto sea visible
   * @param text - Texto a verificar
   * @param timeout - Timeout en ms (default: 10000)
   */
  async verifyTextVisible(text: string, timeout: number = 20000) {
    await expect(this.page.getByText(text)).toBeVisible({ timeout });
  }

  /**
   * Verifica que un heading sea visible
   * @param headingText - Texto del heading
   * @param timeout - Timeout en ms (default: 10000)
   */
  async verifyHeading(headingText: string | RegExp, timeout: number = 10000) {
    await expect(this.page.getByRole('heading', { name: headingText })).toBeVisible({ timeout });
  }

  /**
   * Verifica la URL actual
   * @param urlPattern - Patrón de URL (string o regex)
   */
  async verifyURL(urlPattern: string | RegExp) {
    await expect(this.page).toHaveURL(urlPattern);
  }

  /**
   * Espera a que la URL coincida con un patrón
   * @param urlPattern - Patrón de URL
   * @param timeout - Timeout en ms (default: 10000)
   */
  async waitForURL(urlPattern: string | RegExp, timeout: number = 10000) {
    await WaitHelper.waitForURL(this.page, urlPattern, timeout);
  }

  /**
   * Click en un checkbox
   * @param label - Label del checkbox
   */
  async clickCheckbox(label?: string) {
    if (label) {
      await this.page.getByLabel(label).click();
    } else {
      await this.page.locator('.mat-checkbox-inner-container').click();
    }
  }

  /**
   * Selecciona una opción de un combobox
   * @param comboboxLabel - Label del combobox
   * @param optionText - Texto de la opción
   */
  async selectFromCombobox(comboboxLabel: string, optionText: string) {
    await this.page.getByRole('combobox', { name: comboboxLabel }).click();
    await WaitHelper.shortWait(this.page, 500);
    await this.page.getByRole('option', { name: optionText }).click();
  }

  /**
   * Cierra un dropdown presionando Escape
   */
  async closeDropdown() {
    await this.page.keyboard.press('Escape');
  }

  /**
   * Verifica que un botón esté habilitado
   * @param buttonName - Nombre del botón
   */
  async verifyButtonEnabled(buttonName: string) {
    const button = this.page.getByRole('button', { name: buttonName });
    await expect(button).toBeEnabled();
  }

  /**
   * Verifica que un botón esté deshabilitado
   * @param buttonName - Nombre del botón
   */
  async verifyButtonDisabled(buttonName: string) {
    const button = this.page.getByRole('button', { name: buttonName });
    await expect(button).toBeDisabled();
  }

  /**
   * Obtiene el locator de la página
   * Útil para casos especiales donde se necesita acceso directo
   */
  getPage(): Page {
    return this.page;
  }

  /**
   * Espera pequeña para transiciones (usar con moderación)
   * @param ms - Milisegundos (default: 500)
   */
  async wait(ms: number = 500) {
    await WaitHelper.shortWait(this.page, ms);
  }
}
