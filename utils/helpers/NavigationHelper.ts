import { Page } from '@playwright/test';
import { WaitHelper } from './WaitHelper';

/**
 * Helper para navegación común
 * Facilita la navegación por la aplicación
 */
export class NavigationHelper {
  /**
   * Navega a la página principal y espera a que cargue
   * @param page - Página de Playwright
   */
  static async goToHome(page: Page) {
    await page.goto('/');
    await WaitHelper.waitForNavigation(page);
  }

  /**
   * Click en un botón de navegación del menú lateral
   * @param page - Página de Playwright
   * @param buttonName - Nombre del botón (ej: 'portfolio', 'cuentacorriente')
   */
  static async clickSidebarButton(page: Page, buttonName: string) {
    await page.getByRole('button', { name: buttonName }).click();
    await WaitHelper.waitForNavigation(page);
  }

  /**
   * Click en una solapa principal (Mi Empresa, Mis Inversiones, Aira)
   * @param page - Página de Playwright
   * @param tabName - Nombre de la solapa
   */
  static async clickMainTab(page: Page, tabName: string) {
    await page.getByRole('button', { name: tabName }).click();
    await WaitHelper.shortWait(page, 1000);
  }

  /**
   * Navega hacia atrás usando el historial del navegador
   * @param page - Página de Playwright
   */
  static async goBack(page: Page) {
    await page.goBack();
    await WaitHelper.waitForNavigation(page);
  }

  /**
   * Navega hacia adelante usando el historial del navegador
   * @param page - Página de Playwright
   */
  static async goForward(page: Page) {
    await page.goForward();
    await WaitHelper.waitForNavigation(page);
  }

  /**
   * Recarga la página actual
   * @param page - Página de Playwright
   */
  static async reload(page: Page) {
    await page.reload();
    await WaitHelper.waitForNavigation(page);
  }
}
