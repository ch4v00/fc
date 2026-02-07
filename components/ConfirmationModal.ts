import { Page, expect } from '@playwright/test';
import { BUTTONS } from '../utils/constants/buttons';
import { WaitHelper } from '../utils/helpers/WaitHelper';

/**
 * Componente para modales de confirmación
 * Maneja diálogos de confirmación (cancelar, salir, etc.)
 */
export class ConfirmationModal {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Verifica que el modal de confirmación sea visible
   */
  async verifyModalVisible() {
    const modal = this.page.locator('dialog, .modal, [role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });
  }

  /**
   * Click en "Si, cancelar" en el modal de confirmación
   */
  async confirmCancel() {
    const cancelButton = this.page.getByRole('button', { name: BUTTONS.YES_CANCEL });
    const isVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await cancelButton.click();
      await WaitHelper.shortWait(this.page, 500);
    }
  }

  /**
   * Click en "No, quedarme" en el modal de confirmación
   */
  async cancelModal() {
    const stayButton = this.page.getByRole('button', { name: BUTTONS.NO_STAY });
    const isVisible = await stayButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await stayButton.click();
      await WaitHelper.shortWait(this.page, 500);
    }
  }

  /**
   * Maneja el modal de confirmación si aparece
   * @param confirm - true para confirmar, false para cancelar
   */
  async handleConfirmationModal(confirm: boolean = true) {
    if (confirm) {
      await this.confirmCancel();
    } else {
      await this.cancelModal();
    }
  }
}
