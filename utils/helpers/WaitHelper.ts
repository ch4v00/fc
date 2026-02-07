import { Page, Locator } from '@playwright/test';

/**
 * Helper para esperas inteligentes
 * EVITA el uso de waitForTimeout - usa esperas explícitas
 */
export class WaitHelper {
  /**
   * Espera a que la navegación complete
   * Usa 'networkidle' para asegurar que no haya requests pendientes
   */
  static async waitForNavigation(page: Page, timeout: number = 30000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Espera a que un elemento sea visible
   * @param locator - Locator del elemento
   * @param timeout - Tiempo máximo de espera en ms (default: 10000)
   */
  static async waitForElement(locator: Locator, timeout: number = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Espera a que un elemento esté oculto
   * @param locator - Locator del elemento
   * @param timeout - Tiempo máximo de espera en ms (default: 5000)
   */
  static async waitForElementToBeHidden(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Espera a que la URL coincida con un patrón
   * @param page - Página de Playwright
   * @param urlPattern - Patrón de URL (string o regex)
   * @param timeout - Tiempo máximo de espera en ms (default: 10000)
   */
  static async waitForURL(page: Page, urlPattern: string | RegExp, timeout: number = 10000) {
    await page.waitForURL(urlPattern, { timeout });
  }

  /**
   * Espera pequeña para transiciones de UI (solo cuando sea necesario)
   * Usa con moderación - preferir esperas explícitas
   * @param ms - Milisegundos a esperar (default: 500)
   */
  static async shortWait(page: Page, ms: number = 500) {
    await page.waitForTimeout(ms);
  }

  /**
   * Espera a que un elemento esté habilitado
   * @param locator - Locator del elemento
   * @param timeout - Tiempo máximo de espera en ms (default: 5000)
   */
  static async waitForEnabled(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
    // Esperar a que esté habilitado verificando el atributo disabled
    await locator.evaluate((el: any) => {
      return new Promise((resolve) => {
        const checkEnabled = () => {
          if (!el.disabled && !el.hasAttribute('disabled')) {
            resolve(true);
          } else {
            setTimeout(checkEnabled, 100);
          }
        };
        checkEnabled();
      });
    });
  }

  /**
   * Espera a que desaparezca un loader o spinner
   * @param page - Página de Playwright
   * @param timeout - Tiempo máximo de espera en ms (default: 10000)
   */
  static async waitForLoadersToDisappear(page: Page, timeout: number = 10000) {
    // Esperar a que no haya spinners o loaders visibles
    const loaders = page.locator('.loader, .spinner, [role="progressbar"]');
    try {
      await loaders.first().waitFor({ state: 'hidden', timeout });
    } catch {
      // Si no hay loaders, continuar
    }
  }
}
