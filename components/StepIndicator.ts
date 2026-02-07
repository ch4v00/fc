import { Page, expect } from '@playwright/test';
import { MESSAGES } from '../utils/constants/messages';

/**
 * Componente para indicador de pasos en wizards
 * Verifica y maneja los indicadores de "Paso X de Y"
 */
export class StepIndicator {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Verifica que se muestre el paso correcto
   * @param currentStep - Paso actual
   * @param totalSteps - Total de pasos
   */
  async verifyStep(currentStep: number, totalSteps: number) {
    const stepText = MESSAGES.STEP(currentStep, totalSteps);
    await expect(this.page.getByText(stepText)).toBeVisible({ timeout: 10000 });
  }

  /**
   * Obtiene el número del paso actual leyendo el texto
   * @returns Número del paso actual
   */
  async getCurrentStep(): Promise<number> {
    const stepText = await this.page.locator('text=/Paso \\d+ de \\d+/').textContent();
    if (!stepText) return 0;

    const match = stepText.match(/Paso (\d+) de \d+/);
    return match ? parseInt(match[1]) : 0;
  }
}
