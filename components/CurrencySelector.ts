import { Page, expect } from '@playwright/test';
import { WaitHelper } from '../utils/helpers/WaitHelper';

/**
 * Enum para tipos de moneda
 */
export enum Currency {
  ARS = 0,    // Pesos argentinos
  USD = 1,    // Dólares
  CABLE = 2   // Dólar Cable
}

/**
 * Componente para selector de moneda
 * Maneja la selección de moneda en formularios (ARS, USD, Dólar Cable)
 */
export class CurrencySelector {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Selecciona una moneda usando el enum Currency
   * @param currency - Moneda a seleccionar
   */
  async selectCurrency(currency: Currency) {
    await this.page.locator('mat-radio-button').nth(currency).click();
    await WaitHelper.shortWait(this.page, 500);
  }

  /**
   * Selecciona Pesos (ARS)
   */
  async selectARS() {
    await this.selectCurrency(Currency.ARS);
  }

  /**
   * Selecciona Dólares (USD)
   */
  async selectUSD() {
    await this.selectCurrency(Currency.USD);
  }

  /**
   * Selecciona Dólar Cable
   */
  async selectCable() {
    await this.selectCurrency(Currency.CABLE);
  }

  /**
   * Verifica que una moneda esté visible
   * @param currencyName - Nombre de la moneda ('ARS', 'USD', 'Dólar Cable')
   */
  async verifyCurrencyVisible(currencyName: string) {
    await expect(this.page.getByText(currencyName)).toBeVisible();
  }

  /**
   * Verifica que todas las opciones de moneda estén visibles
   */
  async verifyAllCurrenciesVisible() {
    await this.verifyCurrencyVisible('ARS');
    await this.verifyCurrencyVisible('USD');
    await this.verifyCurrencyVisible('Dólar Cable');
  }
}
