import { Page, expect } from '@playwright/test';
import { BaseWizard } from '../base/BaseWizard';
import { BUTTONS } from '../../utils/constants';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

/**
 * Enum para tipos de fondos
 */
export enum FundType {
  PESOS = 'Fondos en pesos',
  DOLARES = 'Fondos en dólares'
}

/**
 * Enum para acciones en FCI
 */
export enum FCIAction {
  SUBSCRIBE = 'Suscribir',
  WITHDRAW = 'Rescatar'
}

/**
 * Page Object para el wizard de invertir en FCI
 * Maneja el flujo completo de 5 pasos para suscripción/rescate de FCI
 */
export class InvestFCIWizard extends BaseWizard {
  private readonly TOTAL_STEPS = 5;

  constructor(page: Page) {
    super(page);
  }

  // ============================================
  // PASO 1: Seleccionar tipo de fondo
  // ============================================

  /**
   * Selecciona el tipo de fondo (pesos o dólares)
   * @param fundType - Tipo de fondo
   */
  async selectFundType(fundType: FundType) {
    await this.verifyStep(1, this.TOTAL_STEPS);
    await this.verifyTextVisible('Seleccioná una de las opciones:');

    await this.page.getByText(fundType).click({ force: true });
    await WaitHelper.shortWait(this.page, 2000);
    await this.verifyStep(2, this.TOTAL_STEPS);
  }

  // ============================================
  // PASO 2: Seleccionar fondo específico
  // ============================================

  /**
   * Selecciona un fondo específico del listado
   * @param fundName - Nombre del fondo (ej: 'IAM Ahorro Pesos - Clase B')
   */
  async selectFund(fundName: string) {
    await this.verifyStep(2, this.TOTAL_STEPS);
    await this.page.getByText(fundName).click();
    await WaitHelper.shortWait(this.page, 1000);
    await this.verifyStep(3, this.TOTAL_STEPS);
  }

  // ============================================
  // PASO 3: Ver detalles y seleccionar acción
  // ============================================

  /**
   * Verifica detalles del fondo y selecciona acción (Suscribir/Rescatar)
   * @param action - Acción a realizar
   */
  async selectAction(action: FCIAction) {
    await this.verifyStep(3, this.TOTAL_STEPS);
    await this.clickButton(action);
    await WaitHelper.shortWait(this.page, 1000);
    await this.verifyStep(4, this.TOTAL_STEPS);
  }

  /**
   * Verifica información del fondo en el paso 3
   * @param fundName - Nombre del fondo esperado
   * @param fundCode - Código del fondo (ej: 'IAM 37')
   */
  async verifyFundDetails(fundName: string, fundCode: string) {
    await this.verifyTextVisible(fundName);
    await this.verifyTextVisible(fundCode);
    await this.verifyTextVisible('Conservador');
  }

  // ============================================
  // PASO 4: Ingresar monto
  // ============================================

  /**
   * Ingresa el monto de inversión
   * @param amount - Monto a invertir
   */
  async enterAmount(amount: string) {
    await this.verifyStep(4, this.TOTAL_STEPS);
    await this.verifyTextVisible('Suscribir fondo');

    await this.fillInput('Ingresá el monto', amount);
    await WaitHelper.shortWait(this.page, 500);

    await this.next();
    await this.verifyStep(5, this.TOTAL_STEPS);
  }

  /**
   * Click en botón MAX para usar saldo disponible
   */
  async clickMaxAmount() {
    await this.page.getByText(BUTTONS.MAX).click();
    await WaitHelper.shortWait(this.page, 500);
  }

  // ============================================
  // PASO 5: Confirmar y enviar
  // ============================================

  /**
   * Acepta el reglamento y confirma la solicitud
   */
  async confirmSubscription() {
    await this.verifyStep(5, this.TOTAL_STEPS);

    // Aceptar el reglamento (checkbox)
    await this.clickCheckbox();
    await WaitHelper.shortWait(this.page, 500);

    // Enviar solicitud
    await this.confirmRequest();
  }

  // ============================================
  // FLUJOS COMPLETOS
  // ============================================

  /**
   * Flujo completo de suscripción a un fondo
   * @param fundType - Tipo de fondo (pesos/dólares)
   * @param fundName - Nombre del fondo
   * @param amount - Monto a invertir
   */
  async subscribeFund(fundType: FundType, fundName: string, amount: string) {
    await this.selectFundType(fundType);
    await this.selectFund(fundName);
    await this.selectAction(FCIAction.SUBSCRIBE);
    await this.enterAmount(amount);
    await this.confirmSubscription();
    await this.completeSuccessFlow();
  }

  /**
   * Suscripción rápida a IAM Ahorro Pesos (fondo por defecto para tests)
   * @param amount - Monto a invertir
   */
  async subscribeIAMAhorroPesos(amount: string = '25000000') {
    await this.subscribeFund(
      FundType.PESOS,
      'IAM Ahorro Pesos - Clase BIAM 37 CI $',
      amount
    );
  }

  /**
   * Suscripción rápida a IAM Renta Dólares (fondo en dólares para tests)
   * @param amount - Monto a invertir
   */
  async subscribeIAMRentaDolares(amount: string = '25000') {
    await this.subscribeFund(
      FundType.DOLARES,
      'IAM Renta Dolares - Clase B',
      amount
    );
  }

  /**
   * Click en "Realizar otra inversión"
   */
  async makeAnotherInvestment() {
    await this.page.getByRole('button', { name: BUTTONS.MAKE_ANOTHER_INVESTMENT }).click();
    await WaitHelper.shortWait(this.page, 1000);
    await this.verifyStep(1, this.TOTAL_STEPS);
  }

  // ============================================
  // VERIFICACIONES
  // ============================================

  /**
   * Verifica que ambos tipos de fondos estén disponibles
   */
  async verifyFundTypeOptions() {
    await this.verifyTextVisible(FundType.PESOS);
    await this.verifyTextVisible(FundType.DOLARES);
  }

  /**
   * Verifica que ambas acciones estén disponibles
   */
  async verifyActionButtons() {
    await this.verifyButtonEnabled(FCIAction.SUBSCRIBE);
    await this.verifyButtonEnabled(FCIAction.WITHDRAW);
  }
}
