import { Page } from '@playwright/test';
import { BaseWizard } from '../base/BaseWizard';
import { TipoFondo, AccionFCI } from './InvertirFCIWizard';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

/**
 * Page Object para el wizard de rescate de FCI
 * Similar a InvertirFCIWizard pero para rescates (sin checkbox de reglamento)
 */
export class RescatarFCIDesdeInversionesWizard extends BaseWizard {
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
   * @param fundName - Nombre del fondo
   */
  async seleccionarFondo(fundName: string) {
    await this.verifyStep(2, this.TOTAL_STEPS);
    await this.page.getByText(fundName).click();
    await WaitHelper.shortWait(this.page, 1000);
    await this.verifyStep(3, this.TOTAL_STEPS);
  }

  // ============================================
  // PASO 3: Ver detalles y seleccionar Rescatar
  // ============================================

  /**
   * Click en "Rescatar"
   */
  async seleccionarRescatar() {
    await this.verifyStep(3, this.TOTAL_STEPS);
    await this.clickButton(AccionFCI.RESCATAR);
    await WaitHelper.shortWait(this.page, 1000);
    await this.verifyStep(4, this.TOTAL_STEPS);
  }

  // ============================================
  // PASO 4: Ingresar monto de rescate
  // ============================================

  /**
   * Ingresa el monto de rescate
   * @param amount - Monto a rescatar
   */
  async ingresarMonto(amount: string) {
    await this.verifyStep(4, this.TOTAL_STEPS);
    await this.verifyTextVisible('Rescatar fondo');

    await this.fillInput('Ingresá el monto', amount);
    await WaitHelper.shortWait(this.page, 500);

    await this.next();
    await this.verifyStep(5, this.TOTAL_STEPS);
  }

  /**
   * Click en botón MAX para rescatar todo el saldo
   */
  async clickearMontoMaximo() {
    await this.page.getByText('MAX').click();
    await WaitHelper.shortWait(this.page, 500);
  }

  // ============================================
  // PASO 5: Confirmar rescate
  // ============================================

  /**
   * Confirma el rescate
   * NOTA: El rescate NO requiere checkbox de reglamento
   * @param withFundsWithdrawal - Si incluye retiro de fondos (default: false)
   */
  async confirmarRescate(withFundsWithdrawal: boolean = false) {
    await this.verifyStep(5, this.TOTAL_STEPS);

    // Si incluye retiro de fondos, aceptar el checkbox
    if (withFundsWithdrawal) {
      await this.clickCheckbox();
      await WaitHelper.shortWait(this.page, 500);
    }

    // Enviar solicitud
    await this.confirmRequest();
  }

  // ============================================
  // FLUJOS COMPLETOS
  // ============================================

  /**
   * Flujo completo de rescate sin retiro de fondos
   * @param fundType - Tipo de fondo (pesos/dólares)
   * @param fundName - Nombre del fondo
   * @param amount - Monto a rescatar
   */
  async rescatarFondo(fundType: TipoFondo, fundName: string, amount: string) {
    await this.seleccionarTipoFondo(fundType);
    await this.seleccionarFondo(fundName);
    await this.seleccionarRescatar();
    await this.ingresarMonto(amount);
    await this.confirmarRescate(false);
    await this.completeSuccessFlow();
  }

  /**
   * Flujo completo de rescate con retiro de fondos
   * @param fundType - Tipo de fondo (pesos/dólares)
   * @param fundName - Nombre del fondo
   * @param amount - Monto a rescatar
   */
  async rescatarFondoConRetiro(fundType: TipoFondo, fundName: string, amount: string) {
    await this.seleccionarTipoFondo(fundType);
    await this.seleccionarFondo(fundName);
    await this.seleccionarRescatar();
    await this.ingresarMonto(amount);
    await this.confirmarRescate(true);
    await this.completeSuccessFlow();
  }

  /**
   * Rescate rápido de IAM Ahorro Pesos (sin retiro de fondos)
   * @param amount - Monto a rescatar
   */
  async rescatarIAMAhorroPesos(amount: string = '1000') {
    await this.rescatarFondo(
      TipoFondo.PESOS,
      'IAM Ahorro Pesos - Clase BIAM 37 CI $',
      amount
    );
  }

  /**
   * Rescate rápido de IAM Renta Dólares (sin retiro de fondos)
   * @param amount - Monto a rescatar
   */
  async rescatarIAMRentaDolares(amount: string = '1000') {
    await this.rescatarFondo(
      TipoFondo.DOLARES,
      'IAM Renta Dolares - Clase B',
      amount
    );
  }

  // ============================================
  // VERIFICACIONES
  // ============================================

  /**
   * Verifica detalles del fondo
   * @param fundName - Nombre del fondo
   * @param fundCode - Código del fondo
   */
  async verificarDetallesFondo(fundName: string, fundCode: string) {
    await this.verifyTextVisible(fundName);
    await this.verifyTextVisible(fundCode);
    await this.verifyTextVisible('Conservador');
  }
}
