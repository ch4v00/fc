import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { BUTTONS, MESSAGES } from '../../utils/constants';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

/**
 * Clase base para wizards multi-step (formularios de varios pasos)
 * Proporciona métodos comunes para navegación entre pasos,
 * confirmación y mensajes de éxito
 */
export abstract class BaseWizard extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Verifica que estamos en el paso correcto del wizard
   * @param stepNumber - Número del paso actual
   * @param totalSteps - Total de pasos del wizard
   */
  async verifyStep(stepNumber: number, totalSteps: number) {
    await expect(
      this.page.getByText(MESSAGES.STEP(stepNumber, totalSteps))
    ).toBeVisible({ timeout: 10000 });
  }

  /**
   * Click en el botón "Continuar" y espera
   * Verifica que el botón esté habilitado antes de hacer click
   */
  async continue() {
    const continueButton = this.page.getByRole('button', { name: BUTTONS.CONTINUE });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();
    await WaitHelper.shortWait(this.page, 1000);
  }

  /**
   * Click en el botón "Siguiente" y espera
   * Similar a continue() pero usa el texto "Siguiente"
   */
  async next() {
    const nextButton = this.page.getByRole('button', { name: BUTTONS.NEXT });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
    await WaitHelper.shortWait(this.page, 1000);
  }

  /**
   * Click en el botón "Anterior" para volver al paso previo
   */
  async previous() {
    await this.clickButton(BUTTONS.PREVIOUS);
    await WaitHelper.shortWait(this.page, 500);
  }

  /**
   * Sale del wizard usando el botón "Salir"
   * Maneja el modal de confirmación si aparece
   * Verifica que vuelva a la home page
   */
  async exit() {
    await this.page.locator('.back').filter({ hasText: BUTTONS.EXIT }).click();

    // Manejar modal de confirmación si aparece
    const cancelButton = this.page.getByRole('button', { name: BUTTONS.YES_CANCEL });
    const isVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await cancelButton.click();
    }

    await WaitHelper.waitForNavigation(this.page);
    await WaitHelper.shortWait(this.page, 500);
    await expect(this.page).toHaveURL('/');
  }

  /**
   * Confirma la solicitud en el paso de confirmación
   * Verifica el mensaje "Confirmá tu solicitud"
   * Click en "Enviar solicitud"
   * Espera respuesta del servidor
   */
  async confirmRequest() {
    await expect(
      this.page.getByText(MESSAGES.CONFIRMATION.CONFIRM_REQUEST)
    ).toBeVisible();

    const sendButton = this.page.getByRole('button', { name: BUTTONS.SEND_REQUEST });
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    // Espera para respuesta del servidor
    await WaitHelper.shortWait(this.page, 3000);
  }

  /**
   * Verifica el mensaje de éxito
   * Comprueba que aparezcan los mensajes:
   * - "¡Felicitaciones!"
   * - "Tu solicitud fue enviada con éxito"
   */
  async verifySuccess() {
    await expect(
      this.page.getByText(MESSAGES.SUCCESS.TITLE)
    ).toBeVisible({ timeout: 10000 });

    await expect(
      this.page.getByText(MESSAGES.SUCCESS.SENT_SUCCESSFULLY)
    ).toBeVisible();
  }

  /**
   * Click en el botón "Finalizar"
   * Espera navegación y verifica que vuelva a home
   */
  async finish() {
    await this.clickButton(BUTTONS.FINISH);
    await WaitHelper.waitForNavigation(this.page);
    await expect(this.page).toHaveURL('/');
  }

  /**
   * Completa el flujo de éxito completo:
   * 1. Verifica mensaje de éxito
   * 2. Click en Finalizar
   * 3. Verifica que vuelva a home
   */
  async completeSuccessFlow() {
    await this.verifySuccess();
    await this.finish();
  }

  /**
   * Verifica que el botón Continuar esté deshabilitado
   * Útil para tests de validación
   */
  async verifyContinueDisabled() {
    const continueButton = this.page.getByRole('button', { name: BUTTONS.CONTINUE });
    await expect(continueButton).toBeDisabled();
  }

  /**
   * Verifica que el botón Siguiente esté deshabilitado
   * Útil para tests de validación
   */
  async verifyNextDisabled() {
    const nextButton = this.page.getByRole('button', { name: BUTTONS.NEXT });
    await expect(nextButton).toBeDisabled();
  }

  /**
   * Verifica que el botón Enviar solicitud esté deshabilitado
   * Útil para tests de validación
   */
  async verifySendRequestDisabled() {
    const sendButton = this.page.getByRole('button', { name: BUTTONS.SEND_REQUEST });
    await expect(sendButton).toBeDisabled();
  }
}
