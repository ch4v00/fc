import { Page, expect } from '@playwright/test';
import { BUTTONS } from '../../utils/constants/buttons';
import { MESSAGES } from '../../utils/constants/messages';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

/**
 * Componente para el modal de éxito
 * Maneja el mensaje "¡Felicitaciones!" y botones de finalización
 */
export class SuccessModal {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Verifica que el modal de éxito sea visible
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
   * Click en "Finalizar" y vuelve a home
   */
  async finish() {
    await this.page.getByRole('button', { name: BUTTONS.FINISH }).click();
    await WaitHelper.waitForNavigation(this.page);
    await expect(this.page).toHaveURL('/');
  }

  /**
   * Flujo completo: verifica éxito y finaliza
   */
  async completeSuccessFlow() {
    await this.verifySuccess();
    await this.finish();
  }

  /**
   * Click en botón de repetir acción (ej: "Añadir otra cuenta")
   * @param buttonText - Texto del botón
   */
  async repeatAction(buttonText: string) {
    await this.page.getByRole('button', { name: buttonText }).click();
    await WaitHelper.shortWait(this.page, 1000);
  }
}
