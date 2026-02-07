import { Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

/**
 * Page Object para la página principal (Home/Dashboard)
 * Contiene las acciones rápidas y navegación principal
 */
export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Verifica que estamos en la home page
   * Comprueba el heading "Hola, [nombre]"
   */
  async verifyHomePage() {
    await expect(
      this.page.getByRole('heading', { name: /Hola,/ })
    ).toBeVisible({ timeout: 10000 });
  }

  // ============================================
  // ACCIONES RÁPIDAS - MI EMPRESA
  // ============================================

  /**
   * Click en "Añadir usuario"
   */
  async clickAddUser() {
    await this.page.locator('div').filter({ hasText: 'Añadir usuario' }).nth(4).click();
    await WaitHelper.waitForNavigation(this.page);
  }

  // ============================================
  // ACCIONES RÁPIDAS - MIS INVERSIONES
  // ============================================

  /**
   * Click en "Informar Depósito"
   */
  async clickInformDeposit() {
    await this.page.locator('div').filter({ hasText: /^Informar Depósito$/ }).click();
    await WaitHelper.waitForNavigation(this.page);
  }

  /**
   * Click en "Solicitar Fondos" (retiros)
   */
  async clickRequestFunds() {
    await this.page.locator('div').filter({ hasText: /^Solicitar Fondos$/ }).click();
    await WaitHelper.waitForNavigation(this.page);
  }

  /**
   * Click en "Mover Fondos"
   */
  async clickMoveFunds() {
    await this.page.locator('div').filter({ hasText: /^Mover Fondos$/ }).click();
    await WaitHelper.waitForNavigation(this.page);
  }

  /**
   * Click en "Invertir en FCI"
   */
  async clickInvestFCI() {
    await this.page.locator('#invertirFci').click();
    await WaitHelper.waitForNavigation(this.page);
  }

  /**
   * Click en "Añadir Cuenta"
   */
  async clickAddAccount() {
    await this.page.locator('div').filter({ hasText: /^Añadir Cuenta$/ }).click();
    await WaitHelper.waitForNavigation(this.page);
  }

  // ============================================
  // NAVEGACIÓN - SOLAPAS PRINCIPALES
  // ============================================

  /**
   * Click en solapa "Mi Empresa"
   */
  async clickMiEmpresa() {
    await this.page.getByRole('button', { name: 'Mi Empresa' }).click();
    await WaitHelper.shortWait(this.page, 1000);
  }

  /**
   * Click en solapa "Mis Inversiones"
   */
  async clickMisInversiones() {
    await this.page.getByRole('button', { name: 'Mis Inversiones' }).click();
    await WaitHelper.shortWait(this.page, 1000);
  }

  /**
   * Click en solapa "Aira"
   */
  async clickAira() {
    await this.page.getByRole('button', { name: 'Aira' }).click();
    await WaitHelper.shortWait(this.page, 1000);
  }

  // ============================================
  // VERIFICACIONES
  // ============================================

  /**
   * Verifica que se muestre el saldo
   */
  async verifySaldoVisible() {
    await expect(this.page.getByRole('heading', { name: 'Tu saldo' })).toBeVisible();
  }

  /**
   * Verifica la sección "¿Qué necesitas hacer hoy?"
   */
  async verifyQuickActionsVisible() {
    await expect(
      this.page.getByRole('heading', { name: '¿Qué necesitas hacer hoy?' })
    ).toBeVisible();
  }
}
