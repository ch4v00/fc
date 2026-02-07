import { Page, expect } from '@playwright/test';
import { BaseWizard } from '../base/BaseWizard';
import { BUTTONS } from '../../utils/constants/buttons';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

/**
 * Enum para tipos de fondos
 */
export enum TipoFondo {
  PESOS = 'Fondos en pesos',
  DOLARES = 'Fondos en dólares'
}

/**
 * Enum para acciones en FCI
 */
export enum AccionFCI {
  SUSCRIBIR = 'Suscribir',
  RESCATAR = 'Rescatar'
}

/**
 * Page Object para el wizard de invertir en FCI
 * Maneja el flujo completo de 5 pasos para suscripción/rescate de FCI
 */
export class InvertirFCIWizard extends BaseWizard {
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
  async seleccionarTipoFondo(fundType: TipoFondo) {
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
  async seleccionarFondo(fundName: string) {
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
  async seleccionarAccion(action: AccionFCI) {
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
  async verificarDetallesFondo(fundName: string, fundCode: string) {
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
  async ingresarMonto(amount: string) {
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
  async clickearMontoMaximo() {
    await this.page.getByText(BUTTONS.MAX).click();
    await WaitHelper.shortWait(this.page, 500);
  }

  // ============================================
  // PASO 5: Confirmar y enviar
  // ============================================

  /**
   * Acepta el reglamento y confirma la solicitud
   */
  async confirmarSuscripcion() {
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
  async suscribirFondo(fundType: TipoFondo, fundName: string, amount: string) {
    await this.seleccionarTipoFondo(fundType);
    await this.seleccionarFondo(fundName);
    await this.seleccionarAccion(AccionFCI.SUSCRIBIR);
    await this.ingresarMonto(amount);
    await this.confirmarSuscripcion();
    await this.completeSuccessFlow();
  }

  /**
   * Suscripción rápida a IAM Ahorro Pesos (fondo por defecto para tests)
   * @param amount - Monto a invertir
   */
  async suscribirIAMAhorroPesos(amount: string = '25000000') {
    await this.suscribirFondo(
      TipoFondo.PESOS,
      'IAM Ahorro Pesos - Clase BIAM 37 CI $',
      amount
    );
  }

  /**
   * Suscripción rápida a IAM Renta Dólares (fondo en dólares para tests)
   * @param amount - Monto a invertir
   */
  async suscribirIAMRentaDolares(amount: string = '25000') {
    await this.suscribirFondo(
      TipoFondo.DOLARES,
      'IAM Renta Dolares - Clase B',
      amount
    );
  }

  /**
   * Click en "Realizar otra inversión"
   */
  async realizarOtraInversion() {
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
  async verificarOpcionesTipoFondo() {
    await this.verifyTextVisible(TipoFondo.PESOS);
    await this.verifyTextVisible(TipoFondo.DOLARES);
  }

  /**
   * Verifica que ambas acciones estén disponibles
   */
  async verificarBotonesAccion() {
    await this.verifyButtonEnabled(AccionFCI.SUSCRIBIR);
    await this.verifyButtonEnabled(AccionFCI.RESCATAR);
  }
}
