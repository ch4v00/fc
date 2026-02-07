import { Page } from '@playwright/test';
import { WaitHelper } from '../utils/helpers/WaitHelper';
import { BUTTONS } from '../utils/constants';

/**
 * Componente para manejo de subida de archivos
 * Encapsula la lógica de selección de archivos via file chooser
 */
export class FileUploader {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Sube un archivo usando el diálogo de selección
   * @param buttonText - Texto del botón que abre el file chooser (default: 'Adjuntar comprobante')
   * @param filePath - Ruta del archivo a subir (default: 'test.pdf')
   */
  async uploadFile(
    buttonText: string = BUTTONS.ATTACH_FILE,
    filePath: string = 'test.pdf'
  ) {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.page.getByText(buttonText).click()
    ]);

    await fileChooser.setFiles(filePath);
    await WaitHelper.shortWait(this.page, 500);
  }

  /**
   * Sube documentación (usado en algunos formularios)
   * @param filePath - Ruta del archivo (default: './test.pdf')
   */
  async uploadDocumentation(filePath: string = './test.pdf') {
    await this.uploadFile(BUTTONS.ATTACH_DOCUMENTATION, filePath);
  }

  /**
   * Sube un archivo usando un input type="file" directamente
   * @param inputSelector - Selector del input file
   * @param filePath - Ruta del archivo
   */
  async uploadFileDirectly(inputSelector: string, filePath: string = 'test.pdf') {
    const fileInput = this.page.locator(inputSelector);
    await fileInput.setInputFiles(filePath);
    await WaitHelper.shortWait(this.page, 500);
  }

  /**
   * Verifica que un archivo fue subido
   * @param fileName - Nombre del archivo
   */
  async verifyFileUploaded(fileName: string) {
    await this.page.getByText(fileName).waitFor({ state: 'visible', timeout: 5000 });
  }
}
