import { Page, expect } from '@playwright/test';
import { BaseWizard } from '../base/BaseWizard';
import { CurrencySelector, Currency } from '../../components/CurrencySelector';
import { FileUploader } from '../../components/FileUploader';
import { BankingDataGenerator } from '../../utils/generators/BankingDataGenerator';
import { BUTTONS } from '../../utils/constants';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

/**
 * Page Object para el wizard de añadir cuenta bancaria
 * Maneja el flujo completo de 2 pasos para crear una cuenta bancaria
 */
export class AddAccountWizard extends BaseWizard {
  private currencySelector: CurrencySelector;
  private fileUploader: FileUploader;
  private readonly TOTAL_STEPS = 2;

  constructor(page: Page) {
    super(page);
    this.currencySelector = new CurrencySelector(page);
    this.fileUploader = new FileUploader(page);
  }

  // ============================================
  // PASO 1: Completar datos de la cuenta
  // ============================================

  /**
   * Completa el paso 1 con todos los datos de la cuenta
   * @param currency - Moneda (ARS, USD, CABLE)
   * @param bankName - Nombre del banco
   * @param accountType - Tipo de cuenta (para ARS/USD, vacío para Cable)
   */
  async fillAccountDetails(
    currency: Currency,
    bankName: string,
    accountType: string = ''
  ) {
    await this.verifyStep(1, this.TOTAL_STEPS);
    await this.verifyTextVisible('Completa los datos');

    // Seleccionar comitente
    await this.selectComitente();

    // Seleccionar moneda si no es ARS (ARS es default)
    if (currency !== Currency.ARS) {
      await WaitHelper.shortWait(this.page, 1500);
      await this.currencySelector.selectCurrency(currency);
      await WaitHelper.shortWait(this.page, 1500);
    }

    // Seleccionar banco
    await this.selectBank(bankName);

    // Completar campos según moneda
    if (currency === Currency.CABLE) {
      await this.fillCableFields();
    } else {
      await this.fillStandardFields(accountType);
    }

    // Adjuntar comprobante
    await this.fileUploader.uploadFile();

    // Continuar
    await this.continue();
  }

  /**
   * Selecciona el comitente (primera opción disponible)
   */
  private async selectComitente() {
    await this.page.locator('.select-box').first().click();
    await WaitHelper.shortWait(this.page, 500);
    await this.page.getByText('AGRO IN SRL -').click();
  }

  /**
   * Selecciona un banco del listado
   * @param bankName - Nombre del banco
   */
  private async selectBank(bankName: string) {
    await this.page.locator('.select-container.default > .select-box').first().click();
    await WaitHelper.shortWait(this.page, 500);
    await this.page.getByText(bankName).click();
  }

  /**
   * Completa los campos para cuentas ARS/USD
   * @param accountType - Tipo de cuenta
   */
  private async fillStandardFields(accountType: string) {
    await this.fillInput('Ingresá el CBU', BankingDataGenerator.randomCBU());
    await this.fillInput('Ingresá el número', BankingDataGenerator.randomAccountNumber());
    await this.fillInput('Ingresá una observación', 'Test Automatizado');

    // Seleccionar tipo de cuenta
    await this.page.locator('.select-container.default > .select-box').click();
    await WaitHelper.shortWait(this.page, 500);
    await this.page.getByText(accountType).click();
  }

  /**
   * Completa los campos para cuentas en Dólar Cable
   */
  private async fillCableFields() {
    await this.fillInput('Ingresá el SWIFT', BankingDataGenerator.randomSWIFT());
    await this.fillInput('Ingresá el ABA', BankingDataGenerator.randomABA());
    await this.fillInput('Ingresá el número', BankingDataGenerator.randomAccountNumber());
    await this.fillInput('Ingresá una observación', 'Test Automatizado');
  }

  // ============================================
  // PASO 2: Confirmar y enviar
  // ============================================

  /**
   * Confirma los datos y envía la solicitud
   */
  async confirmAndSend() {
    await this.verifyStep(2, this.TOTAL_STEPS);
    await this.confirmRequest();
  }

  // ============================================
  // FLUJO COMPLETO
  // ============================================

  /**
   * Ejecuta el flujo completo para añadir una cuenta
   * @param currency - Moneda
   * @param bankName - Nombre del banco
   * @param accountType - Tipo de cuenta
   */
  async addAccount(
    currency: Currency,
    bankName: string,
    accountType: string = ''
  ) {
    await this.fillAccountDetails(currency, bankName, accountType);
    await this.confirmAndSend();
    await this.completeSuccessFlow();
  }

  /**
   * Click en "Añadir otra cuenta" después del éxito
   */
  async addAnotherAccount() {
    await this.page.getByRole('button', { name: BUTTONS.ADD_ANOTHER_ACCOUNT }).click();
    await WaitHelper.shortWait(this.page, 1000);
    await this.verifyStep(1, this.TOTAL_STEPS);
  }

  // ============================================
  // VERIFICACIONES
  // ============================================

  /**
   * Verifica que las opciones de moneda estén visibles
   */
  async verifyCurrencyOptions() {
    await this.currencySelector.verifyAllCurrenciesVisible();
  }

  /**
   * Verifica campos específicos de Dólar Cable
   */
  async verifyCableFields() {
    await this.verifyTextVisible('*SWIFT');
    await this.verifyTextVisible('*ABA');
  }

  /**
   * Verifica mensaje de demora de habilitación
   */
  async verifyDelayMessage() {
    await this.verifyTextVisible('Las nuevas cuentas tendrán una demora de 24 hs para su habilitación.');
  }
}
