import { Page, expect } from '@playwright/test';
import { BaseWizard } from '../base/BaseWizard';
import { FileUploader } from '../../components/FileUploader';
import { DataGenerator } from '../../utils/generators/DataGenerator';
import { BUTTONS } from '../../utils/constants/buttons';
import { MESSAGES } from '../../utils/constants/messages';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

/**
 * Interface para datos de usuario
 */
export interface DatosUsuario {
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
}

/**
 * Page Object para el wizard de añadir usuario
 * Maneja el flujo completo de 4 pasos para crear un usuario
 */
export class AgregarUsuarioWizard extends BaseWizard {
  private fileUploader: FileUploader;
  private readonly TOTAL_STEPS = 4;

  constructor(page: Page) {
    super(page);
    this.fileUploader = new FileUploader(page);
  }

  // ============================================
  // PASO 1: Información básica del usuario
  // ============================================

  /**
   * Completa la información básica del usuario
   * @param userData - Datos del usuario (opcional, se genera random si no se proporciona)
   */
  async completarInfoBasicaUsuario(userData?: DatosUsuario) {
    await this.verifyHeading(MESSAGES.SECTIONS.NEW_USER);

    const user = userData || DataGenerator.randomUser();

    await this.fillInput('Ingrese un mail', user.email);
    await this.fillInput('Ingrese el nombre', user.nombre);
    await this.fillInput('Ingrese el apellido', user.apellido);
    await this.fillByPlaceholder('Ingrese un teléfono', user.telefono);

    await this.continue();

    return user;
  }

  // ============================================
  // PASO 2: Seleccionar Empresa y Estado
  // ============================================

  /**
   * Selecciona la empresa
   * @param companyName - Nombre de la empresa (default: 'Agro In Srl')
   */
  async seleccionarEmpresa(companyName: string = 'Agro In Srl') {
    await this.selectFromCombobox('Seleccione Seleccione', companyName);
    await this.closeDropdown();
  }

  /**
   * Selecciona el estado del usuario
   * @param status - Estado ('Activo' o 'Inactivo')
   */
  async seleccionarEstado(status: string = 'Activo') {
    await this.page.locator('.select-container.default > .select-box').click();
    await this.page.getByText(status, { exact: true }).click();
  }

  /**
   * Completa el paso 2: Empresa y Estado
   * @param companyName - Nombre de la empresa
   * @param status - Estado del usuario
   */
  async completarEmpresaYEstado(companyName: string = 'Agro In Srl', status: string = 'Activo') {
    await this.seleccionarEmpresa(companyName);
    await this.seleccionarEstado(status);
    await this.continue();
  }

  // ============================================
  // PASO 3: Secciones y Roles
  // ============================================

  /**
   * Selecciona las secciones para el usuario
   * @param sections - Array de secciones (ej: ['Finanzas', 'Fyocapital'])
   */
  async seleccionarSecciones(sections: string[]) {
    // Abrir selector de secciones
    await this.page.getByRole('combobox', { name: 'Seleccione Seleccione' }).click();
    await WaitHelper.shortWait(this.page, 1000);

    // Seleccionar cada sección
    for (const section of sections) {
      await this.page.locator('mat-option', { hasText: section }).click();
      await WaitHelper.shortWait(this.page, 500);
    }

    // Cerrar dropdown
    await this.closeDropdown();
    await WaitHelper.shortWait(this.page, 1000);
  }

  /**
   * Selecciona un rol en una sección (radio button)
   * @param roleName - Nombre del rol exacto
   */
  async seleccionarRol(roleName: string) {
    await this.page.locator('mat-radio-button').filter({
      has: this.page.locator('p.rol').filter({ hasText: new RegExp(`^${roleName}$`) })
    }).click();
  }

  /**
   * Selecciona múltiples roles (checkboxes)
   * @param roles - Array de nombres de roles
   */
  async seleccionarMultiplesRoles(roles: string[]) {
    for (const role of roles) {
      await this.page.locator('mat-checkbox', {
        has: this.page.locator('p.rol', { hasText: role })
      }).click();
    }

    await WaitHelper.shortWait(this.page, 500);
  }

  /**
   * Completa el paso 3: Secciones, Roles y Documentación
   * @param sections - Secciones a seleccionar
   * @param primaryRole - Rol principal (radio button)
   * @param additionalRoles - Roles adicionales (checkboxes)
   * @param observation - Observación (default: 'Test de automatización')
   */
  async completarSeccionesYRoles(
    sections: string[] = ['Finanzas', 'Fyocapital'],
    primaryRole: string = 'Analista Finanzas',
    additionalRoles: string[] = ['Analista instrumentos financieros', 'Operador de Instrumentos Financieros'],
    observation: string = 'Test de automatización'
  ) {
    // Seleccionar secciones
    await this.seleccionarSecciones(sections);

    // Seleccionar rol principal
    await this.seleccionarRol(primaryRole);

    // Seleccionar roles adicionales
    await this.seleccionarMultiplesRoles(additionalRoles);

    // Adjuntar documentación
    await this.fileUploader.uploadDocumentation('./test.pdf');

    // Agregar observaciones
    await this.fillInput('Ingresá una observación', observation);

    await this.continue();
  }

  // ============================================
  // PASO 4: Confirmar creación
  // ============================================

  /**
   * Verifica los datos del usuario y confirma la creación
   * @param userData - Datos del usuario para verificar
   */
  async confirmarCreacionUsuario(userData: DatosUsuario) {
    await expect(
      this.page.getByRole('heading', { name: MESSAGES.CONFIRMATION.CONFIRM_USER })
    ).toBeVisible();

    // Verificar información
    await this.verifyTextVisible(userData.nombre);
    await this.verifyTextVisible(userData.apellido);
    await this.verifyTextVisible('Agro In SRL');
    await this.verifyTextVisible('Activo');
    await this.verifyTextVisible('Finanzas, fyoCapital');

    // Añadir usuario
    await this.clickButton(BUTTONS.ADD_USER);
    await WaitHelper.shortWait(this.page, 5000);
  }

  // ============================================
  // FLUJO COMPLETO
  // ============================================

  /**
   * Flujo completo para añadir un usuario
   * @param userData - Datos del usuario (opcional, se genera random si no se proporciona)
   */
  async agregarUsuario(userData?: DatosUsuario) {
    // Paso 1: Información básica
    const user = await this.completarInfoBasicaUsuario(userData);

    // Paso 2: Empresa y Estado
    await this.completarEmpresaYEstado();

    // Paso 3: Secciones y Roles
    await this.completarSeccionesYRoles();

    // Paso 4: Confirmar
    await this.confirmarCreacionUsuario(user);

    // Finalizar
    await this.clickButton(BUTTONS.FINISH);
    await WaitHelper.waitForNavigation(this.page);
    await expect(this.page).toHaveURL('/');
  }

  // ============================================
  // VERIFICACIONES
  // ============================================

  /**
   * Verifica que el botón Continuar esté deshabilitado en el paso especificado
   * @param step - Número de paso
   */
  async verificarContinuarDeshabilitadoEnPaso(step: number) {
    await this.verifyContinueDisabled();
  }
}
