import { Page, expect } from '@playwright/test';
import { BaseWizard } from '../base/BaseWizard';
import { CurrencySelector, Currency } from '../../components/CurrencySelector';
import { FileUploader } from '../../components/FileUploader';
import { DataGenerator } from '../../utils/generators/DataGenerator';
import { BankingDataGenerator } from '../../utils/generators/BankingDataGenerator';
import { DateHelper } from '../../utils/generators/DateHelper';
import { BUTTONS } from '../../utils/constants/buttons';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

/**
 * Enum para tipos de depósito
 */
export enum TipoDeposito {
  TRANSFERENCIA_BANCARIA = 'Transferencia bancaria',
  ECHEQ = 'Echeq'
}

/**
 * Page Object para el wizard de informar depósito
 * Maneja el flujo completo de 4 pasos para informar un depósito
 */
export class DepositoWizard extends BaseWizard {
  private currencySelector: CurrencySelector;
  private fileUploader: FileUploader;
  private readonly TOTAL_STEPS = 4;

  constructor(page: Page) {
    super(page);
    this.currencySelector = new CurrencySelector(page);
    this.fileUploader = new FileUploader(page);
  }

  // ============================================
  // PASO 1: Seleccionar tipo de depósito
  // ============================================

  /**
   * Selecciona el tipo de depósito
   * @param depositType - Tipo de depósito (Transferencia bancaria o Echeq)
   */
  async seleccionarTipoDeposito(depositType: TipoDeposito) {
    await this.verifyStep(1, this.TOTAL_STEPS);
    await this.page.locator('div').filter({ hasText: new RegExp(`^${depositType}$`) }).click();
    await WaitHelper.shortWait(this.page, 1000);
    await this.verifyStep(2, this.TOTAL_STEPS);
  }

  // ============================================
  // PASO 2: Completar datos del depósito
  // ============================================

  /**
   * Completa el formulario de transferencia bancaria
   * @param currency - Moneda (ARS, USD, CABLE)
   * @param bankName - Nombre del banco origen
   * @param amount - Monto (opcional, se genera random si no se proporciona)
   */
  async completarDatosTransferencia(
    currency: Currency = Currency.ARS,
    bankName: string = 'Banco de Galicia y Bs. As. SA',
    amount?: number
  ) {
    await this.verifyStep(2, this.TOTAL_STEPS);
    await WaitHelper.shortWait(this.page, 3000);
    // Seleccionar moneda si no es ARS
    if (currency !== Currency.ARS) {
      await this.currencySelector.selectCurrency(currency);
    }

    // Ingresar monto
    await WaitHelper.shortWait(this.page, 5000);
    const depositAmount = amount || DataGenerator.randomAmount(1, 99999999);
    await this.fillInput('Ingresá el monto', depositAmount.toString());

    // Ingresar fecha actual
    await this.page.locator('input[placeholder="dd/mm/aaaa"]').first().fill(DateHelper.getCurrentDate());

    // Seleccionar cuenta origen
    await WaitHelper.shortWait(this.page, 3000);
    await this.page.locator('.select-box').click();
    await WaitHelper.shortWait(this.page, 1000);
    await this.page.getByText(bankName).click();

    // Seleccionar cuenta destino fyo
    await this.page.locator('mat-radio-button').nth(3).click();
    await WaitHelper.shortWait(this.page, 500);

    // Ingresar observaciones
    await this.fillInput('Ingresá una observación', 'Test Automatizado');

    // Adjuntar comprobante
    await this.fileUploader.uploadFile();

    // Continuar
    await this.continue();
  }

  /**
   * Completa el formulario de Echeq
   * @param amount - Monto (opcional, se genera random si no se proporciona)
   */
  async completarDatosEcheq(amount?: number) {
    await this.verifyStep(2, this.TOTAL_STEPS);

    // Fecha actual
    const today = DateHelper.getCurrentDate();

    // Ingresar Fecha de Emisión
    await this.page.locator('input[placeholder="dd/mm/aaaa"]').first().fill(today);

    // Ingresar Fecha de Pago
    await this.page.locator('input[placeholder="dd/mm/aaaa"]').nth(1).fill(today);

    // Generar monto random
    const echeqAmount = amount || DataGenerator.randomAmount(1, 99999999);
    await this.fillInput('Ingresá el monto', echeqAmount.toString());

    // Ingresar Nro de Echeq
    const echeqNumber = BankingDataGenerator.randomEcheqNumber();
    await this.fillByPlaceholder('Ingresá el numero', echeqNumber.toString());

    // Seleccionar cuenta destino fyo
    await this.page.locator('mat-radio-button').first().click();
    await WaitHelper.shortWait(this.page, 500);

    // Ingresar observaciones
    await this.fillInput('Ingresá una observación', 'Test Automatizado');

    // Adjuntar comprobante
    await this.fileUploader.uploadFile();

    // Continuar
    await this.continue();
  }

  // ============================================
  // PASO 3: Confirmar solicitud
  // ============================================

  /**
   * Confirma y envía la solicitud
   */
  async confirmarYEnviar() {
    await this.verifyStep(3, this.TOTAL_STEPS);
    await this.confirmRequest();
  }

  // ============================================
  // FLUJOS COMPLETOS
  // ============================================

  /**
   * Flujo completo de transferencia bancaria
   * @param currency - Moneda
   * @param bankName - Banco origen
   * @param amount - Monto (opcional)
   */
  async informarTransferenciaBancaria(
    currency: Currency = Currency.ARS,
    bankName: string = 'Banco de Galicia y Bs. As. SA',
    amount?: number
  ) {
    await this.seleccionarTipoDeposito(TipoDeposito.TRANSFERENCIA_BANCARIA);
    await this.completarDatosTransferencia(currency, bankName, amount);
    await this.confirmarYEnviar();
    await this.completeSuccessFlow();
  }

  /**
   * Flujo completo de Echeq
   * @param amount - Monto (opcional)
   */
  async informarEcheq(amount?: number) {
    await this.seleccionarTipoDeposito(TipoDeposito.ECHEQ);
    await this.completarDatosEcheq(amount);
    await this.confirmarYEnviar();
    await this.completeSuccessFlow();
  }

  /**
   * Click en "Informar otro depósito"
   */
  async informarOtroDeposito() {
    await this.page.getByRole('button', { name: BUTTONS.INFORM_ANOTHER_DEPOSIT }).click();
    await WaitHelper.shortWait(this.page, 1000);
    await this.verifyStep(1, this.TOTAL_STEPS);
  }

  // ============================================
  // VERIFICACIONES
  // ============================================

  /**
   * Verifica opciones de tipo de depósito
   */
  async verificarOpcionesTipoDeposito() {
    await this.verifyTextVisible(TipoDeposito.TRANSFERENCIA_BANCARIA);
    await this.verifyTextVisible(TipoDeposito.ECHEQ);
  }

  /**
   * Verifica opciones de moneda
   */
  async verificarOpcionesMoneda() {
    await this.currencySelector.verifyAllCurrenciesVisible();
  }
}
