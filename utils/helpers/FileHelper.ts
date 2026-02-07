import { Page } from '@playwright/test';
import { WaitHelper } from './WaitHelper';

/**
 * Helper para manejo de archivos
 * Facilita la subida de archivos en formularios
 */
export class FileHelper {
  /**
   * Sube un archivo usando el diálogo de selección de archivos
   * @param page - Página de Playwright
   * @param buttonText - Texto del botón que abre el file chooser
   * @param filePath - Ruta del archivo a subir (default: test.pdf)
   */
  static async uploadFile(
    page: Page,
    buttonText: string = 'Adjuntar comprobante',
    filePath: string = 'test.pdf'
  ) {
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByText(buttonText).click()
    ]);

    await fileChooser.setFiles(filePath);
    await WaitHelper.shortWait(page, 500);
  }

  /**
   * Sube un archivo usando un input type="file" directamente
   * @param page - Página de Playwright
   * @param inputSelector - Selector del input file
   * @param filePath - Ruta del archivo a subir
   */
  static async uploadFileDirectly(
    page: Page,
    inputSelector: string,
    filePath: string = 'test.pdf'
  ) {
    const fileInput = page.locator(inputSelector);
    await fileInput.setInputFiles(filePath);
    await WaitHelper.shortWait(page, 500);
  }

  /**
   * Verifica que un archivo fue subido correctamente
   * @param page - Página de Playwright
   * @param fileName - Nombre del archivo esperado
   */
  static async verifyFileUploaded(page: Page, fileName: string) {
    // Verificar que el nombre del archivo aparece en la UI
    await page.getByText(fileName).waitFor({ state: 'visible', timeout: 5000 });
  }
}
