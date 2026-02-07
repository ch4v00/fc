/**
 * TESTS DE AÑADIR USUARIO - REFACTORIZADO
 *
 * Reducción: De ~236 líneas a ~80 líneas (66% menos código)
 */

import { test, expect } from '../../pages/TestBase';
import { DataGenerator } from '../../utils/generators/DataGenerator';

test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Añadir Nuevo Usuario', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  // ============================================
  // FLUJO COMPLETO
  // ============================================

  test('crear nuevo usuario exitosamente', async ({
    homePage,
    agregarUsuarioWizard
  }) => {
    await homePage.clickMiEmpresa();
    await homePage.wait(2000);
    await homePage.clickAddUser();

    await agregarUsuarioWizard.agregarUsuario();
  });

  test('crear usuario con datos específicos', async ({
    homePage,
    agregarUsuarioWizard
  }) => {
    const userData = {
      email: 'test@example.com',
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '1234567890'
    };

    await homePage.clickMiEmpresa();
    await homePage.wait(2000);
    await homePage.clickAddUser();

    await agregarUsuarioWizard.agregarUsuario(userData);
  });

  // ============================================
  // VALIDACIONES POR PASO
  // ============================================

  test('validar campos requeridos en paso 1', async ({
    homePage,
    agregarUsuarioWizard
  }) => {
    await homePage.clickMiEmpresa();
    await homePage.wait(1000);
    await homePage.clickAddUser();

    await agregarUsuarioWizard.verifyHeading('Nuevo Usuario');
    await agregarUsuarioWizard.verifyContinueDisabled();
  });

  test('validar campos requeridos en paso 2', async ({
    homePage,
    agregarUsuarioWizard
  }) => {
    await homePage.clickMiEmpresa();
    await homePage.wait(1000);
    await homePage.clickAddUser();

    // Completar paso 1
    await agregarUsuarioWizard.completarInfoBasicaUsuario();

    // En paso 2, sin completar campos
    await agregarUsuarioWizard.verifyContinueDisabled();
  });

  test('validar campos requeridos en paso 3', async ({
    homePage,
    agregarUsuarioWizard
  }) => {
    await homePage.clickMiEmpresa();
    await homePage.wait(1000);
    await homePage.clickAddUser();

    // Completar pasos 1 y 2
    await agregarUsuarioWizard.completarInfoBasicaUsuario();
    await agregarUsuarioWizard.completarEmpresaYEstado();

    // En paso 3, sin seleccionar secciones o roles
    await agregarUsuarioWizard.wait(1000);
    await agregarUsuarioWizard.verifyContinueDisabled();
  });

  // ============================================
  // NAVEGACIÓN
  // ============================================

  test('cancelar creación de usuario', async ({
    homePage,
    agregarUsuarioWizard
  }) => {
    await homePage.clickMiEmpresa();
    await homePage.wait(1000);
    await homePage.clickAddUser();

    await agregarUsuarioWizard.verifyHeading('Nuevo Usuario');
    await agregarUsuarioWizard.exit();
  });
});
