import { Page, expect } from '@playwright/test';
import { BaseWizard } from '../base/BaseWizard';
import { DataGenerator } from '../../utils/generators/DataGenerator';
import { BUTTONS } from '../../utils/constants/buttons';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

/**
 * Page Object para el wizard de mover fondos
 * Maneja el flujo completo de 3 pasos para transferir fondos entre cuentas
 */
export class MoverFondosWizard extends BaseWizard {
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
  async intercambiarOrigenDestino() {
    await this.page.locator('button').filter({ hasText: '' }).first().click();
    await WaitHelper.shortWait(this.page, 500);
  }

  /**
   * Ingresa el monto a mover
   * @param amount - Monto (opcional, se genera random si no se proporciona)
   */
  async ingresarMonto(amount?: number) {
    const moveAmount = amount || DataGenerator.randomAmount(1, 19999);
    await this.fillInput('Ingresa el monto', moveAmount.toString());
  }

  /**
   * Click en botón MAX para usar el saldo disponible completo
   */
  async clickearMontoMaximo() {
    await this.page.getByText(BUTTONS.MAX).click();
    await WaitHelper.shortWait(this.page, 500);
  }

  /**
   * Ingresa observaciones
   * @param observation - Texto de observación (default: 'Test Automatizado')
   */
  async ingresarObservacion(observation: string = 'Test Automatizado') {
    await this.fillInput('Ingresá una observación', observation);
  }

  /**
   * Acepta términos y condiciones
   */
  async aceptarTerminos() {
    await this.clickCheckbox();
    await WaitHelper.shortWait(this.page, 500);
  }

  /**
   * Completa el paso 1 con todos los datos
   * @param amount - Monto (opcional)
   * @param swapDirection - Si debe intercambiar origen/destino (default: false)
   */
  async completarDatosMovimiento(amount?: number, swapDirection: boolean = false) {
    await this.verifyStep(1, this.TOTAL_STEPS);
    await this.verifyTextVisible('Mover fondos');

    // Intercambiar si es necesario
    if (swapDirection) {
      await this.intercambiarOrigenDestino();
      await WaitHelper.shortWait(this.page, 500);
    }

    // Ingresar datos
    await this.ingresarMonto(amount);
    await this.ingresarObservacion();
    await this.aceptarTerminos();

    // Continuar
    await this.continue();
  }

  // ============================================
  // PASO 2: Confirmar solicitud
  // ============================================

  /**
   * Confirma la solicitud de movimiento
   */
  async confirmarYEnviar() {
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
  async moverFondos(amount?: number, fromInvestments: boolean = true) {
    await this.completarDatosMovimiento(amount, fromInvestments);
    await this.confirmarYEnviar();
    await this.completeSuccessFlow();
  }

  /**
   * Mueve fondos desde Inversiones a Granos
   * @param amount - Monto (opcional)
   */
  async moverDeInversionesAGranos(amount?: number) {
    await this.moverFondos(amount, true);
  }

  /**
   * Mueve fondos desde Granos a Inversiones
   * @param amount - Monto (opcional)
   */
  async moverDeGranosAInversiones(amount?: number) {
    await this.moverFondos(amount, false);
  }

  /**
   * Click en "Realizar otro movimiento"
   */
  async realizarOtroMovimiento() {
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
  async verificarDireccion(direction: string) {
    await this.verifyTextVisible(direction);
  }

  /**
   * Verifica que se muestre el Total Disponible
   */
  async verificarSaldoDisponibleVisible() {
    await this.verifyTextVisible('Total Disponible');
  }

  /**
   * Verifica que el botón continuar esté deshabilitado sin términos aceptados
   */
  async verificarContinuarDeshabilitadoSinTerminos() {
    await this.verifyContinueDisabled();
  }
}
