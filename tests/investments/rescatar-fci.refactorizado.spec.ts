/**
 * TESTS DE RESCATE FCI - REFACTORIZADO
 *
 * Reducción: De ~665 líneas a ~120 líneas (82% menos código)
 */

import { test, expect } from '../../pages/TestBase';
import { TipoFondo } from '../../pages/investments/InvertirFCIWizard';

test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Rescates de FCI', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  // ============================================
  // RESCATES SIN RETIRO DE FONDO
  // ============================================

  test('completar rescate FCI en pesos sin retiro de fondo', async ({
    homePage,
    rescatarFCIDesdeInversionesWizard
  }) => {
    await homePage.clickInvestFCI();

    await rescatarFCIDesdeInversionesWizard.rescatarIAMAhorroPesos('1000');
  });

  test('completar rescate FCI en dólares sin retiro de fondo', async ({
    homePage,
    rescatarFCIDesdeInversionesWizard
  }) => {
    await homePage.clickInvestFCI();

    await rescatarFCIDesdeInversionesWizard.rescatarIAMRentaDolares('1000');
  });

  // ============================================
  // RESCATES CON RETIRO DE FONDO
  // ============================================

  test('completar rescate FCI en pesos con retiro de fondo', async ({
    homePage,
    rescatarFCIDesdeInversionesWizard
  }) => {
    await homePage.clickInvestFCI();

    await rescatarFCIDesdeInversionesWizard.rescatarFondoConRetiro(
      TipoFondo.PESOS,
      'IAM Ahorro Pesos - Clase BIAM 37 CI $',
      '1000'
    );
  });


  // ============================================
  // FUNCIONALIDADES
  // ============================================

  test('usar botón MAX para retirar saldo completo', async ({
    homePage,
    rescatarFCIDesdeInversionesWizard
  }) => {
    await homePage.clickInvestFCI();

    await rescatarFCIDesdeInversionesWizard.seleccionarTipoFondo(TipoFondo.PESOS);
    await rescatarFCIDesdeInversionesWizard.seleccionarFondo('IAM Ahorro Pesos - Clase BIAM 37 CI $');
    await rescatarFCIDesdeInversionesWizard.seleccionarRescatar();

    // Hacer clic en botón MAX
    await rescatarFCIDesdeInversionesWizard.clickearMontoMaximo();
    await rescatarFCIDesdeInversionesWizard.wait(500);

    // Verificar que el monto fue completado
    const inputMonto = rescatarFCIDesdeInversionesWizard.getPage().getByRole('textbox', { name: 'Ingresá el monto' });
    const montoValue = await inputMonto.inputValue();
    expect(montoValue).not.toBe('');

    // Verificar que el botón Siguiente está habilitado
    await expect(rescatarFCIDesdeInversionesWizard.getPage().getByRole('button', { name: 'Siguiente' })).toBeEnabled();
  });

  // ============================================
  // VALIDACIONES
  // ============================================

  test('prevenir continuar sin ingresar monto', async ({
    homePage,
    rescatarFCIDesdeInversionesWizard
  }) => {
    await homePage.clickInvestFCI();

    // Avanzar al paso 4 (ingresar monto)
    await rescatarFCIDesdeInversionesWizard.seleccionarTipoFondo(TipoFondo.PESOS);
    await rescatarFCIDesdeInversionesWizard.seleccionarFondo('IAM Ahorro Pesos - Clase BIAM 37 CI $');
    await rescatarFCIDesdeInversionesWizard.seleccionarRescatar();

    // Verificar que el botón Siguiente está deshabilitado
    await rescatarFCIDesdeInversionesWizard.verifyNextDisabled();
  });

  // ============================================
  // NAVEGACIÓN
  // ============================================

  test('cancelar rescate usando botón Salir', async ({
    homePage,
    rescatarFCIDesdeInversionesWizard
  }) => {
    await homePage.clickInvestFCI();

    await rescatarFCIDesdeInversionesWizard.seleccionarTipoFondo(TipoFondo.PESOS);
    await rescatarFCIDesdeInversionesWizard.exit();
  });

  // ============================================
  // VERIFICACIONES DE UI
  // ============================================

  test('mostrar información correcta del fondo antes del rescate', async ({
    homePage,
    rescatarFCIDesdeInversionesWizard
  }) => {
    await homePage.clickInvestFCI();

    await rescatarFCIDesdeInversionesWizard.seleccionarTipoFondo(TipoFondo.PESOS);
    await rescatarFCIDesdeInversionesWizard.seleccionarFondo('IAM Ahorro Pesos - Clase BIAM 37 CI $');

    // Verificar detalles del fondo
    await rescatarFCIDesdeInversionesWizard.verificarDetallesFondo('IAM Ahorro Pesos - Clase B', 'IAM 37');
  });
});
