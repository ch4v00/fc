import { Page } from '@playwright/test';
import { BaseWizard } from '../base/BaseWizard';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

/**
 * Page Object para el wizard de rescate de FCI desde Portfolio
 * URL: rescatar-fci
 * Maneja el flujo completo de 2 pasos para rescate de FCI
 *
 * Nota: Este wizard se accede desde Portfolio > Fondos > Rescatar
 */
export class RescatarFCIWizard extends BaseWizard {
  private readonly TOTAL_STEPS = 2;

  constructor(page: Page) {
    super(page);
  }

  // ============================================
  // NAVEGACIÓN DESDE PORTFOLIO
  // ============================================

  /**
   * Navega al Portfolio y expande la sección de Fondos
   * @param fundType - 'Fondos En Dólar' o 'Fondos En Pesos'
   */
  async navegarAFondosEnPortfolio(fundType: 'Fondos En Dólar' | 'Fondos En Pesos') {
    // Click en portfolio desde la navegación lateral
    await this.page.getByRole('button', { name: 'portfolio' }).click();
    await this.page.waitForLoadState('networkidle');
    await WaitHelper.shortWait(this.page, 3000);

    // Expandir Activos Valuados
    await this.page.getByRole('button', { name: 'Activos Valuados' }).click();
    await WaitHelper.shortWait(this.page, 1000);

    // Expandir la categoría de fondos
    if (fundType === 'Fondos En Dólar') {
      await this.page.getByRole('button', { name: /Fondos En Dólar U\$S/ }).click();
    } else {
      await this.page.getByRole('button', { name: /Fondos En Pesos \$/ }).click();
    }
    await WaitHelper.shortWait(this.page, 1000);
  }

  /**
   * Selecciona la acción "Rescatar" del primer fondo en la lista
   */
  async seleccionarAccionRescatar() {
    // Click en el botón de acciones (more_vert) del primer instrumento
    await this.page.locator('button').filter({ hasText: 'more_vert' }).first().click();
    await WaitHelper.shortWait(this.page, 500);

    // Seleccionar "Rescatar" del menú
    await this.page.getByRole('menuitem', { name: 'Rescatar' }).click();
    await this.page.waitForLoadState('networkidle');
    await WaitHelper.shortWait(this.page, 3000);
  }

  // ============================================
  // PASO 1: Ingresar monto
  // ============================================

  /**
   * Verifica la información del fondo en el paso 1
   * @param fundName - Nombre esperado del fondo
   * @param fundCode - Código esperado del fondo (ej: 'IAM 44')
   */
  async verificarInfoFondo(fundName: string, fundCode: string) {
    await this.verifyStep(1, this.TOTAL_STEPS);
    await this.verifyTextVisible(fundName);
    await this.verifyTextVisible(fundCode);
  }

  /**
   * Ingresa el monto a rescatar y avanza al siguiente paso
   * @param amount - Monto a rescatar
   */
  async ingresarMonto(amount: string) {
    await this.verifyStep(1, this.TOTAL_STEPS);

    await this.fillInput('Ingresá el monto', amount);
    await WaitHelper.shortWait(this.page, 500);

    await this.verifyButtonEnabled('Siguiente');
    await this.clickButton('Siguiente');
    await WaitHelper.shortWait(this.page, 1000);
    await this.verifyStep(2, this.TOTAL_STEPS);
  }

  // ============================================
  // PASO 2: Confirmar solicitud
  // ============================================

  /**
   * Confirma el rescate del FCI
   * Nota: No requiere aceptar reglamento (a diferencia de suscripción)
   */
  async confirmarRescate() {
    await this.verifyStep(2, this.TOTAL_STEPS);
    await this.verifyTextVisible('Confirmá tu solicitud');
    await this.verifyTextVisible('Agro In SRL');
    await this.verifyTextVisible('Monto a Rescatar');

    // Enviar solicitud (no requiere checkbox para rescate)
    await this.verifyButtonEnabled('Enviar solicitud');
    await this.confirmRequest();
  }

  // ============================================
  // FLUJOS COMPLETOS
  // ============================================

  /**
   * Flujo completo de rescate desde portfolio
   * @param fundType - Tipo de fondo ('Fondos En Dólar' o 'Fondos En Pesos')
   * @param amount - Monto a rescatar
   */
  async rescatarDesdePortfolio(fundType: 'Fondos En Dólar' | 'Fondos En Pesos', amount: string) {
    await this.navegarAFondosEnPortfolio(fundType);
    await this.seleccionarAccionRescatar();
    await this.ingresarMonto(amount);
    await this.confirmarRescate();
    await this.completeSuccessFlow();
  }

  /**
   * Rescate rápido de Fondos en Dólar desde portfolio
   * @param amount - Monto a rescatar (por defecto 1200)
   */
  async rescatarFondoDolar(amount: string = '1200') {
    await this.rescatarDesdePortfolio('Fondos En Dólar', amount);
  }

  /**
   * Rescate rápido de Fondos en Pesos desde portfolio
   * @param amount - Monto a rescatar (por defecto 1200)
   */
  async rescatarFondoPeso(amount: string = '1200') {
    await this.rescatarDesdePortfolio('Fondos En Pesos', amount);
  }

  // ============================================
  // VERIFICACIONES
  // ============================================

  /**
   * Verifica que el menú de acciones muestre las opciones Suscribir y Rescatar
   */
  async verificarMenuAcciones() {
    await this.verifyTextVisible('Suscribir');
    await this.verifyTextVisible('Rescatar');
  }

  /**
   * Verifica que se muestre un fondo específico en la lista
   * @param fundCode - Código del fondo (ej: 'IAM 44', 'GALILEO 24')
   */
  async verificarFondoEnLista(fundCode: string) {
    await this.verifyTextVisible(fundCode);
  }

  /**
   * Click en botón MAX para rescatar todo el saldo disponible
   */
  async clickearMontoMaximo() {
    await this.page.getByText('MAX').click();
    await WaitHelper.shortWait(this.page, 500);
  }
}
