import { Page } from '@playwright/test';
import { BaseWizard } from '../base/BaseWizard';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

/**
 * Enum para métodos de retiro
 */
export enum MetodoRetiro {
  TRANSFERENCIA_BANCARIA = 'Transferencia bancaria',
  ECHEQ = 'Echeq'
}

/**
 * Enum para monedas disponibles
 */
export enum Moneda {
  ARS = 'ARS',
  USD = 'USD',
  CABLE = 'Dólar Cable'
}

/**
 * Page Object para el wizard de solicitar fondos (retiro)
 * URL: alta-retiro
 * Maneja el flujo completo de 4 pasos para solicitud de fondos
 */
export class SolicitarFondosWizard extends BaseWizard {
  private readonly TOTAL_STEPS = 4;

  constructor(page: Page) {
    super(page);
  }

  // ============================================
  // PASO 1: Seleccionar método de retiro
  // ============================================

  /**
   * Selecciona el método de retiro (Transferencia bancaria o Echeq)
   * @param method - Método de retiro
   */
  async seleccionarMetodoRetiro(method: MetodoRetiro) {
    await this.verifyStep(1, this.TOTAL_STEPS);
    await this.page.locator('div').filter({ hasText: new RegExp(`^${method}$`) }).click();
    await WaitHelper.shortWait(this.page, 1000);
    await this.verifyStep(2, this.TOTAL_STEPS);
  }

  // ============================================
  // PASO 2: Completar datos - Transferencia
  // ============================================

  /**
   * Selecciona la moneda (solo para transferencia bancaria)
   * @param currency - Moneda a seleccionar
   */
  async seleccionarMoneda(currency: Moneda) {
    await this.verifyStep(2, this.TOTAL_STEPS);

    // Determinar el índice del radio button según la moneda
    let radioIndex = 0;
    switch (currency) {
      case Moneda.ARS:
        radioIndex = 0; // ARS es el primero
        break;
      case Moneda.USD:
        radioIndex = 1; // USD es el segundo
        break;
      case Moneda.CABLE:
        radioIndex = 2; // Dólar Cable es el tercero
        break;
    }

    if (radioIndex > 0) {
      await this.page.locator('mat-radio-button').nth(radioIndex).click({ force: true });
      await WaitHelper.shortWait(this.page, 1000);
    }
  }

  /**
   * Completa el formulario de transferencia bancaria
   * @param amount - Monto a retirar
   * @param observation - Observación opcional
   * @param currency - Moneda (por defecto ARS)
   */
  async completarFormularioTransferencia(amount: string, observation: string = 'Test Automatizado', currency: Moneda = Moneda.ARS) {
    await this.verifyStep(2, this.TOTAL_STEPS);

    // Seleccionar moneda si no es ARS (que está por defecto)
    if (currency !== Moneda.ARS) {
      await this.seleccionarMoneda(currency);
    }

    // Ingresar monto
    await this.fillInput('Ingresa el monto', amount);

    // Seleccionar cuenta destino (última opción)
    await WaitHelper.shortWait(this.page, 2000);
    await this.page.locator('mat-radio-button').last().click({ force: true });
    await WaitHelper.shortWait(this.page, 1000);

    // Ingresar observaciones
    await this.fillInput('Ingresá una observación', observation);

    // Aceptar términos y condiciones
    await this.clickCheckbox();
    await WaitHelper.shortWait(this.page, 1500);

    // Continuar
    await this.verifyButtonEnabled('Continuar');
    await this.clickButton('Continuar');
    await WaitHelper.shortWait(this.page, 1000);
    await this.verifyStep(3, this.TOTAL_STEPS);
  }

  // ============================================
  // PASO 2: Completar datos - Echeq
  // ============================================

  /**
   * Completa el formulario de Echeq
   * @param date - Fecha en formato DD/MM/YYYY
   * @param amount - Monto (número de echeq)
   * @param observation - Observación opcional
   */
  async completarFormularioEcheq(date: string, amount: string, observation: string = 'Test Automatizado') {
    await this.verifyStep(2, this.TOTAL_STEPS);

    // Ingresar Fecha de Emisión
    await this.page.locator('input[placeholder="dd/mm/aaaa"]').first().fill(date);

    // Ingresar Fecha de Pago
    await this.page.locator('input[placeholder="dd/mm/aaaa"]').nth(1).fill(date);

    // Ingresar número de echeq
    await this.fillInput('Ingresa el número', amount);

    // Agregar echeq
    await this.page.getByRole('button', { name: /Agregar echeq/ }).click();
    await WaitHelper.shortWait(this.page, 500);

    // Eliminar la fila vacía que se crea automáticamente
    await this.page.locator('button-fyo button.large.primary').nth(1).click();
    await WaitHelper.shortWait(this.page, 500);

    // Ingresar observaciones
    await this.fillInput('Ingresá una observación', observation);

    // Aceptar términos y condiciones
    await this.clickCheckbox();
    await WaitHelper.shortWait(this.page, 500);

    // Continuar
    await this.verifyButtonEnabled('Continuar');
    await this.clickButton('Continuar');
    await WaitHelper.shortWait(this.page, 1000);
    await this.verifyStep(3, this.TOTAL_STEPS);
  }

  // ============================================
  // PASO 3: Confirmar solicitud
  // ============================================

  /**
   * Confirma la solicitud de retiro
   */
  async confirmarSolicitudRetiro() {
    await this.verifyStep(3, this.TOTAL_STEPS);
    await this.verifyTextVisible('Confirmá tu solicitud');
    await this.verifyTextVisible('Agro In SRL');

    // Enviar solicitud
    await this.confirmRequest();
  }

  // ============================================
  // FLUJOS COMPLETOS
  // ============================================

  /**
   * Flujo completo de retiro por transferencia bancaria
   * @param amount - Monto a retirar
   * @param currency - Moneda
   * @param observation - Observación
   */
  async retirarPorTransferenciaBancaria(amount: string, currency: Moneda = Moneda.ARS, observation: string = 'Test Automatizado') {
    await this.seleccionarMetodoRetiro(MetodoRetiro.TRANSFERENCIA_BANCARIA);
    await this.completarFormularioTransferencia(amount, observation, currency);
    await this.confirmarSolicitudRetiro();
    await this.completeSuccessFlow();
  }

  /**
   * Flujo completo de retiro por Echeq
   * @param date - Fecha en formato DD/MM/YYYY
   * @param amount - Número de echeq
   * @param observation - Observación
   */
  async retirarPorEcheq(date: string, amount: string, observation: string = 'Test Automatizado') {
    await this.seleccionarMetodoRetiro(MetodoRetiro.ECHEQ);
    await this.completarFormularioEcheq(date, amount, observation);
    await this.confirmarSolicitudRetiro();
    await this.completeSuccessFlow();
  }

  // ============================================
  // VERIFICACIONES
  // ============================================

  /**
   * Verifica que se muestren las opciones de moneda para transferencia
   */
  async verificarOpcionesMoneda() {
    await this.verifyTextVisible(Moneda.ARS);
    await this.verifyTextVisible(Moneda.USD);
    await this.verifyTextVisible(Moneda.CABLE);
  }

  /**
   * Verifica que el botón Continuar esté deshabilitado (validación de campos)
   */
  async verificarBotonContinuarDeshabilitado() {
    await this.verifyButtonDisabled('Continuar');
  }

  /**
   * Click en "Solicitar más fondos" después del éxito
   */
  async solicitarMasFondos() {
    await this.page.getByRole('button', { name: 'Solicitar más fondos' }).click();
    await WaitHelper.shortWait(this.page, 1000);
    await this.verifyStep(1, this.TOTAL_STEPS);
  }
}
