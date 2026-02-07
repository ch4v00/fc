import { Page, expect } from '@playwright/test';
import { BaseWizard } from '../base/BaseWizard';
import { DataGenerator } from '../../utils/generators/DataGenerator';
import { BUTTONS } from '../../utils/constants';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

/**
 * Page Object para el wizard de mover fondos
 * Maneja el flujo completo de 3 pasos para transferir fondos entre cuentas
 */
export class MoveFundsWizard extends BaseWizard {
  private readonly TOTAL_STEPS = 3;

  constructor(page: Page) {
    super(page);
  }

  // ============================================
  // PASO 1: Configurar movimiento
  // ============================================

  /**
   * Intercambia origen y destino (swap)
   * Útil para cambiar de "Granos -> Inversiones" a "Inversiones -> Granos"
   */
  async swapOriginDestination() {
    await this.page.locator('button').filter({ hasText: '' }).first().click();
    await WaitHelper.shortWait(this.page, 500);
  }

  /**
   * Ingresa el monto a mover
   * @param amount - Monto (opcional, se genera random si no se proporciona)
   */
  async enterAmount(amount?: number) {
    const moveAmount = amount || DataGenerator.randomAmount(1, 19999);
    await this.fillInput('Ingresa el monto', moveAmount.toString());
  }

  /**
   * Click en botón MAX para usar el saldo disponible completo
   */
  async clickMaxAmount() {
    await this.page.getByText(BUTTONS.MAX).click();
    await WaitHelper.shortWait(this.page, 500);
  }

  /**
   * Ingresa observaciones
   * @param observation - Texto de observación (default: 'Test Automatizado')
   */
  async enterObservation(observation: string = 'Test Automatizado') {
    await this.fillInput('Ingresá una observación', observation);
  }

  /**
   * Acepta términos y condiciones
   */
  async acceptTerms() {
    await this.clickCheckbox();
    await WaitHelper.shortWait(this.page, 500);
  }

  /**
   * Completa el paso 1 con todos los datos
   * @param amount - Monto (opcional)
   * @param swapDirection - Si debe intercambiar origen/destino (default: false)
   */
  async fillMovementData(amount?: number, swapDirection: boolean = false) {
    await this.verifyStep(1, this.TOTAL_STEPS);
    await this.verifyTextVisible('Mover fondos');

    // Intercambiar si es necesario
    if (swapDirection) {
      await this.swapOriginDestination();
      await WaitHelper.shortWait(this.page, 500);
    }

    // Ingresar datos
    await this.enterAmount(amount);
    await this.enterObservation();
    await this.acceptTerms();

    // Continuar
    await this.continue();
  }

  // ============================================
  // PASO 2: Confirmar solicitud
  // ============================================

  /**
   * Confirma la solicitud de movimiento
   */
  async confirmAndSend() {
    await this.verifyStep(2, this.TOTAL_STEPS);
    await this.confirmRequest();
  }

  // ============================================
  // FLUJO COMPLETO
  // ============================================

  /**
   * Flujo completo de movimiento de fondos
   * @param amount - Monto a mover (opcional)
   * @param fromInvestments - true para mover desde Inversiones a Granos (default: true)
   */
  async moveFunds(amount?: number, fromInvestments: boolean = true) {
    await this.fillMovementData(amount, fromInvestments);
    await this.confirmAndSend();
    await this.completeSuccessFlow();
  }

  /**
   * Mueve fondos desde Inversiones a Granos
   * @param amount - Monto (opcional)
   */
  async moveFromInvestmentsToGrains(amount?: number) {
    await this.moveFunds(amount, true);
  }

  /**
   * Mueve fondos desde Granos a Inversiones
   * @param amount - Monto (opcional)
   */
  async moveFromGrainsToInvestments(amount?: number) {
    await this.moveFunds(amount, false);
  }

  /**
   * Click en "Realizar otro movimiento"
   */
  async makeAnotherMovement() {
    await this.page.getByRole('button', { name: BUTTONS.MAKE_ANOTHER_MOVEMENT }).click();
    await WaitHelper.shortWait(this.page, 1000);
    await this.verifyStep(1, this.TOTAL_STEPS);
  }

  // ============================================
  // VERIFICACIONES
  // ============================================

  /**
   * Verifica el texto de dirección del movimiento
   * @param direction - Texto esperado (ej: 'De mis inversiones a mis negocios')
   */
  async verifyDirection(direction: string) {
    await this.verifyTextVisible(direction);
  }

  /**
   * Verifica que se muestre el Total Disponible
   */
  async verifyAvailableBalanceVisible() {
    await this.verifyTextVisible('Total Disponible');
  }

  /**
   * Verifica que el botón continuar esté deshabilitado sin términos aceptados
   */
  async verifyContinueDisabledWithoutTerms() {
    await this.verifyContinueDisabled();
  }
}
